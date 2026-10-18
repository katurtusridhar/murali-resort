const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'design_audit', 'screenshots');

const PAGES = [
  { key: 'home', path: '/home', name: 'Home' },
  { key: 'facilities', path: '/facilities', name: 'Facilities' },
  { key: 'gallery', path: '/gallery', name: 'Gallery' },
  { key: 'contact', path: '/contact', name: 'Contact' }
];

const VIEWPORTS = [
  { key: 'desktop', width: 1440, height: 900, isMobile: false, hasTouch: false },
  { key: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
  { key: 'tablet', width: 768, height: 1024, isMobile: false, hasTouch: true }
];

async function runAudit(phase = 'initial') {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const rawResults = [];

  for (const pageDef of PAGES) {
    for (const vp of VIEWPORTS) {
      console.log(`\n========================================`);
      console.log(`Scanning [${phase.toUpperCase()}] ${pageDef.name} (${pageDef.path}) on ${vp.key.toUpperCase()} (${vp.width}x${vp.height})...`);
      console.log(`========================================`);

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.isMobile,
        hasTouch: vp.hasTouch,
        deviceScaleFactor: 2
      });

      const page = await context.newPage();
      const consoleErrors = [];
      const failedRequests = [];

      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('requestfailed', req => {
        failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
      });

      await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: 'networkidle', timeout: 30000 });
      // Allow extra time for animations and fonts to settle
      await page.waitForTimeout(1500);

      // 1. Capture Full Page Screenshot
      const screenshotFilename = `${phase}_${pageDef.key}_${vp.key}.png`;
      const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotFilename);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Saved screenshot: ${screenshotFilename}`);

      // 2. Axe WCAG 2.2 AA Audit
      const axeBuilder = new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']);
      const axeResults = await axeBuilder.analyze();

      console.log(`Axe Violations: ${axeResults.violations.length}`);

      // 3. DOM & Visual Inspection Evaluation
      const domEvaluation = await page.evaluate(() => {
        const issues = [];
        const winWidth = window.innerWidth;
        const docWidth = document.documentElement.scrollWidth;

        // Check horizontal overflow
        if (docWidth > winWidth + 2) {
          issues.push({
            type: 'USABILITY_LAYOUT',
            severity: 'Critical',
            title: 'Horizontal layout overflow detected',
            detail: `Document width (${docWidth}px) exceeds viewport width (${winWidth}px)`
          });
        }

        // Headings hierarchy check
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
          tag: h.tagName.toLowerCase(),
          text: h.textContent.trim().replace(/\s+/g, ' '),
          fontSize: window.getComputedStyle(h).fontSize,
          fontWeight: window.getComputedStyle(h).fontWeight,
          lineHeight: window.getComputedStyle(h).lineHeight
        }));

        const h1Count = headings.filter(h => h.tag === 'h1').length;
        if (h1Count === 0) {
          issues.push({
            type: 'ACCESSIBILITY_SEMANTICS',
            severity: 'Major',
            title: 'Missing H1 heading landmark',
            detail: 'The page has no <h1> element.'
          });
        } else if (h1Count > 1) {
          issues.push({
            type: 'USABILITY_TYPOGRAPHY',
            severity: 'Minor',
            title: 'Multiple H1 headings detected',
            detail: `Found ${h1Count} <h1> elements.`
          });
        }

        // Check heading level skips
        const levelOrder = { h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 };
        let prevLevel = 0;
        for (const h of headings) {
          const currLevel = levelOrder[h.tag];
          if (prevLevel > 0 && currLevel > prevLevel + 1) {
            issues.push({
              type: 'ACCESSIBILITY_SEMANTICS',
              severity: 'Moderate',
              title: `Skipped heading level from <${Object.keys(levelOrder)[prevLevel-1]}> to <${h.tag}>`,
              detail: `Heading text: "${h.text.substring(0, 40)}..."`
            });
          }
          prevLevel = currLevel;
        }

        // Check touch target sizes on interactive elements
        const interactive = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="tab"]'));
        const smallTargets = [];
        interactive.forEach(el => {
          // Ignore hidden or sr-only elements
          if (el.offsetParent === null && el.offsetWidth === 0 && el.offsetHeight === 0) return;
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;
          if (el.classList.contains('sr-only')) return;

          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            if (rect.width < 24 || rect.height < 24) {
              smallTargets.push({
                selector: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.split(' ').filter(Boolean).slice(0, 2).join('.') : ''),
                text: el.textContent.trim().substring(0, 30),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              });
            }
          }
        });

        // Check buttons: computed styles count
        const buttons = Array.from(document.querySelectorAll('button, a.btn-primary, a.btn-primary-light, a.btn-primary-dark, a.btn-outline, a.btn-outline-light, a.btn-outline-dark, a.btn-pill, [role="button"]'));
        const buttonStyles = new Set();
        buttons.forEach(b => {
          if (b.classList.contains('sr-only')) return;
          const style = window.getComputedStyle(b);
          if (style.display === 'none' || style.visibility === 'hidden') return;
          const key = `${style.paddingTop}_${style.paddingRight}_${style.backgroundColor}_${style.borderRadius}_${style.fontSize}_${style.textTransform}`;
          buttonStyles.add(key);
        });

        // Check long all-caps text
        const longAllCaps = [];
        const textElements = Array.from(document.querySelectorAll('span, p, a, button, h1, h2, h3, h4, h5, h6'));
        textElements.forEach(el => {
          if (el.children.length === 0 && el.textContent) {
            const text = el.textContent.trim();
            const style = window.getComputedStyle(el);
            if (style.textTransform === 'uppercase' && text.length > 15) {
              longAllCaps.push({
                selector: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.split(' ').filter(Boolean).slice(0, 2).join('.') : ''),
                text: text,
                length: text.length
              });
            }
          }
        });

        // Extract all visible copy for reading analysis
        const paragraphs = Array.from(document.querySelectorAll('p, blockquote, .prose')).map(p => ({
          text: p.textContent.trim().replace(/\s+/g, ' '),
          selector: p.tagName.toLowerCase() + (p.id ? '#' + p.id : '') + (p.className ? '.' + p.className.split(' ').filter(Boolean).slice(0, 2).join('.') : '')
        })).filter(p => p.text.length > 20);

        // Check links with preventDefault or empty href
        const links = Array.from(document.querySelectorAll('a')).map(a => ({
          text: a.textContent.trim().replace(/\s+/g, ' '),
          href: a.getAttribute('href'),
          target: a.getAttribute('target'),
          ariaLabel: a.getAttribute('aria-label'),
          hasOnClick: !!a.onclick
        }));

        return {
          issues,
          headings,
          smallTargets: smallTargets.slice(0, 10),
          buttonStylesCount: buttonStyles.size,
          longAllCaps,
          paragraphs: paragraphs.slice(0, 25),
          links: links.filter(l => !l.href || l.href === '#' || l.text.toLowerCase().includes('click here') || l.href.includes('celebrations')),
          pageTitle: document.title
        };
      });

      // 4. Interactive Testing
      let interactiveTestResults = {};

      if (vp.isMobile || vp.width <= 768) {
        // Test mobile menu toggle
        try {
          const menuBtn = await page.$('button[aria-label*="menu" i], button[aria-controls="mobile-nav-drawer"]');
          if (menuBtn) {
            await menuBtn.click();
            await page.waitForTimeout(400);
            const isExpanded = await menuBtn.getAttribute('aria-expanded');
            const drawer = await page.$('#mobile-nav-drawer, [role="dialog"]');
            const drawerVisible = drawer ? await drawer.isVisible() : false;
            interactiveTestResults.mobileMenu = {
              opened: drawerVisible,
              ariaExpanded: isExpanded
            };
            // Close it
            await page.keyboard.press('Escape');
            await page.waitForTimeout(400);
            interactiveTestResults.mobileMenuEscapeCloses = !(await drawer?.isVisible());
          }
        } catch (e) {
          interactiveTestResults.mobileMenuError = e.message;
        }
      }

      if (pageDef.key === 'contact') {
        // Test form fields and validation
        try {
          const form = await page.$('form');
          if (form) {
            const submitBtn = await form.$('button[type="submit"], input[type="submit"], button:has-text("Submit"), button:has-text("Enquire"), button:has-text("Send")');
            interactiveTestResults.formPresent = true;
            interactiveTestResults.submitButton = !!submitBtn;
          }
        } catch (e) {
          interactiveTestResults.formError = e.message;
        }
      }

      rawResults.push({
        phase,
        page: pageDef,
        viewport: vp,
        screenshot: screenshotFilename,
        consoleErrors,
        failedRequests,
        axeViolations: axeResults.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          tags: v.tags,
          nodes: v.nodes.map(n => ({
            html: n.html,
            target: n.target,
            failureSummary: n.failureSummary,
            any: n.any,
            all: n.all,
            none: n.none
          }))
        })),
        axePassesCount: axeResults.passes.length,
        domEvaluation,
        interactiveTestResults
      });

      await context.close();
    }
  }

  await browser.close();

  const outputPath = path.join(__dirname, '..', 'design_audit', `${phase === 'initial' ? '01_initial_raw_data' : '03_final_raw_data'}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(rawResults, null, 2), 'utf-8');
  console.log(`\nAudit complete! Saved raw results to: ${outputPath}`);
  return rawResults;
}

runAudit(process.argv[2] || 'initial')
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Audit failed:', err);
    process.exit(1);
  });
