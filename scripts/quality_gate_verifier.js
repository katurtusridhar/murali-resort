const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';

async function runQualityGate() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const report = {};

  console.log('=== RUNNING TARGETED QUALITY GATE CHECKS ===\n');

  // =========================================================================
  // CHECK 1: Facilities.tsx Inactive Slides, aria-hidden, inert & Keyboard Tab Order
  // =========================================================================
  console.log('1. Checking Facilities.tsx keyboard focus and inactive slides...');
  const deskContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const deskPage = await deskContext.newPage();
  await deskPage.goto(`${BASE_URL}/facilities`, { waitUntil: 'networkidle' });
  await deskPage.waitForTimeout(1000);

  const facilitiesTabCheck = await deskPage.evaluate(() => {
    // Scroll to the desktop facilities section
    const desktopSection = document.querySelector('.hidden.lg\\:grid');
    if (!desktopSection) return { error: 'Desktop facilities section not found' };

    const slides = Array.from(desktopSection.querySelectorAll('.absolute.inset-0'));
    const results = slides.map((slide, index) => {
      const isAriaHidden = slide.getAttribute('aria-hidden');
      const isInert = slide.hasAttribute('inert') || slide.inert === true;
      const focusable = Array.from(slide.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'));
      const h2 = slide.querySelector('h2')?.textContent.trim();
      const opacity = window.getComputedStyle(slide).opacity;
      return {
        index,
        h2,
        opacity,
        isAriaHidden,
        isInert,
        focusableCount: focusable.length
      };
    });

    return { totalSlides: slides.length, slides: results };
  });

  report.facilitiesKeyboardCheck = facilitiesTabCheck;
  console.log('Facilities slides status:', facilitiesTabCheck);

  // Tab key test through the desktop section
  let tabFocusedElements = [];
  for (let i = 0; i < 20; i++) {
    await deskPage.keyboard.press('Tab');
    const focusedInfo = await deskPage.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      return {
        tag: el.tagName.toLowerCase(),
        text: el.textContent.trim().substring(0, 30),
        ariaHiddenAncestor: !!el.closest('[aria-hidden="true"]'),
        inertAncestor: !!el.closest('[inert]')
      };
    });
    if (focusedInfo) tabFocusedElements.push(focusedInfo);
  }
  const trappedInHidden = tabFocusedElements.filter(f => f.ariaHiddenAncestor || f.inertAncestor);
  report.keyboardTrappedInHidden = trappedInHidden;
  console.log(`Tab navigation test: ${tabFocusedElements.length} focused elements, ${trappedInHidden.length} inside hidden/inert containers.`);
  await deskContext.close();

  // =========================================================================
  // CHECK 2: Accessible Names in Home5Hero.tsx & Home5Spaces.tsx
  // =========================================================================
  console.log('\n2. Checking Accessible Names & Visible Labels...');
  const homeContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const homePage = await homeContext.newPage();
  await homePage.goto(`${BASE_URL}/home`, { waitUntil: 'networkidle' });
  await homePage.waitForTimeout(1000);

  const accessibleNames = await homePage.evaluate(() => {
    // 1. Scroll prompt button
    const scrollBtn = document.querySelector('button.hidden.sm\\:inline-flex');
    const scrollVisibleText = scrollBtn ? scrollBtn.textContent.trim().replace(/\s+/g, ' ') : null;
    const scrollAriaLabel = scrollBtn ? scrollBtn.getAttribute('aria-label') : null;

    // 2. Spaces tab-more link
    const tabMore = document.querySelector('#tab-more');
    const tabMoreVisibleText = tabMore ? tabMore.textContent.trim().replace(/\s+/g, ' ') : null;
    const tabMoreAriaLabel = tabMore ? tabMore.getAttribute('aria-label') : null;

    return {
      scrollBtn: {
        visibleText: scrollVisibleText,
        ariaLabel: scrollAriaLabel,
        matchesPrefix: scrollAriaLabel ? scrollAriaLabel.toLowerCase().startsWith(scrollVisibleText.toLowerCase()) : true
      },
      tabMore: {
        visibleText: tabMoreVisibleText,
        ariaLabel: tabMoreAriaLabel,
        matchesPrefix: tabMoreAriaLabel ? tabMoreAriaLabel.toLowerCase().startsWith(tabMoreVisibleText.toLowerCase()) : true
      }
    };
  });

  report.accessibleNames = accessibleNames;
  console.log('Accessible Names check:', accessibleNames);
  await homeContext.close();

  // =========================================================================
  // CHECK 3: Contrast and Target Size Measurements
  // =========================================================================
  console.log('\n3. Measuring exact target sizes and contrast ratios...');
  const navContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const navPage = await navContext.newPage();
  await navPage.goto(`${BASE_URL}/facilities`, { waitUntil: 'networkidle' });
  await navPage.waitForTimeout(1000);

  const navMeasurements = await navPage.evaluate(() => {
    const activeLink = document.querySelector('nav[aria-label="Desktop Navigation"] a[href$="facilities"]');
    if (!activeLink) return { error: 'Active link not found' };

    const rect = activeLink.getBoundingClientRect();
    const style = window.getComputedStyle(activeLink);
    const color = style.color;

    // Get header backdrop
    const capsule = activeLink.closest('.max-w-5xl') || activeLink.closest('header');
    const bgStyle = capsule ? window.getComputedStyle(capsule).backgroundColor : 'unknown';

    return {
      activeLinkText: activeLink.textContent.trim(),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      computedColor: color,
      capsuleBg: bgStyle
    };
  });
  report.navMeasurements = navMeasurements;
  console.log('Active nav link measurements on /facilities:', navMeasurements);
  await navContext.close();

  // Target size check on Contact
  const contactContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const contactPage = await contactContext.newPage();
  await contactPage.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle' });
  await contactPage.waitForTimeout(1000);

  const contactTargets = await contactPage.evaluate(() => {
    // Leaflet marker
    const marker = document.querySelector('.leaflet-marker-icon');
    const markerRect = marker ? marker.getBoundingClientRect() : null;

    // Phone and email links
    const phoneLinks = Array.from(document.querySelectorAll('a[href^="tel:"]')).map(a => {
      const r = a.getBoundingClientRect();
      return { text: a.textContent.trim(), width: Math.round(r.width), height: Math.round(r.height) };
    });
    const emailLinks = Array.from(document.querySelectorAll('a[href^="mailto:"]')).map(a => {
      const r = a.getBoundingClientRect();
      return { text: a.textContent.trim(), width: Math.round(r.width), height: Math.round(r.height) };
    });
    const waLink = document.querySelector('a[href*="wa.me"]');
    const waRect = waLink ? waLink.getBoundingClientRect() : null;

    return {
      marker: markerRect ? { width: Math.round(markerRect.width), height: Math.round(markerRect.height) } : null,
      phoneLinks,
      emailLinks,
      waLink: waRect ? { width: Math.round(waRect.width), height: Math.round(waRect.height) } : null
    };
  });
  report.contactTargets = contactTargets;
  console.log('Contact interactive targets:', contactTargets);
  await contactContext.close();

  // =========================================================================
  // CHECK 4: Enquiry Form Submission Flow & Outgoing Message Verification
  // =========================================================================
  console.log('\n4. Testing Enquiry Form Submission Flow & Output URLs...');
  const formContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const formPage = await formContext.newPage();
  await formPage.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle' });
  await formPage.waitForTimeout(1000);

  // Fill the form with test data
  await formPage.fill('#name', 'Lakshmi Narayana');
  await formPage.fill('#email', 'lakshmi.n@example.com');
  await formPage.fill('#phone', '+91 9876543210');
  await formPage.selectOption('#eventType', 'wedding');
  await formPage.fill('#message', 'Looking for wedding banquet booking in December 2026 for 600 guests.');

  // Submit form
  await formPage.click('button[type="submit"]');
  await formPage.waitForTimeout(1000);

  const submissionState = await formPage.evaluate(() => {
    const dispatchCard = document.querySelector('.lg\\:col-span-2');
    const heading = dispatchCard?.querySelector('h3')?.textContent.trim();
    const paragraph = dispatchCard?.querySelector('p.text-stone-600')?.textContent.trim();
    const waAnchor = dispatchCard?.querySelector('a[href*="wa.me"]');
    const mailtoAnchor = dispatchCard?.querySelector('a[href^="mailto:"]');
    const resetBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('start over'));

    return {
      heading,
      paragraph,
      waHref: waAnchor ? waAnchor.getAttribute('href') : null,
      mailtoHref: mailtoAnchor ? mailtoAnchor.getAttribute('href') : null,
      hasResetBtn: !!resetBtn
    };
  });

  report.submissionState = submissionState;
  console.log('Enquiry submission state:', submissionState);

  // Verify decoded WhatsApp message contents
  if (submissionState.waHref) {
    const urlObj = new URL(submissionState.waHref);
    const textParam = urlObj.searchParams.get('text');
    console.log('Decoded WhatsApp message:\n', textParam);
    report.decodedWaMessage = textParam;
  }
  await formContext.close();

  // =========================================================================
  // CHECK 5: Celebrations Link Navigation Verification
  // =========================================================================
  console.log('\n5. Verifying Celebrations link navigation across pages & viewports...');
  const navTestContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const navTestPage = await navTestContext.newPage();

  // Test 5A: Click Celebrations on /facilities
  await navTestPage.goto(`${BASE_URL}/facilities`, { waitUntil: 'networkidle' });
  const celebLink = await navTestPage.$('header nav a:has-text("Celebrations")');
  await celebLink.click();
  await navTestPage.waitForTimeout(1000);
  const urlAfterClickFacilities = navTestPage.url();
  console.log('URL after clicking Celebrations on /facilities:', urlAfterClickFacilities);

  // Test 5B: Check if section #moments exists and is scrolled to
  const scrollPosition = await navTestPage.evaluate(() => {
    const momentsEl = document.getElementById('moments');
    return {
      momentsExists: !!momentsEl,
      momentsTop: momentsEl ? Math.round(momentsEl.getBoundingClientRect().top) : null,
      scrollY: Math.round(window.scrollY)
    };
  });
  console.log('Scroll position at #moments:', scrollPosition);

  // Test 5C: Click Celebrations while already on /home
  // First scroll back to top of /home to test the primary navigation link
  await navTestPage.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await navTestPage.waitForTimeout(600);

  const primaryCelebLink = navTestPage.locator('nav[aria-label="Primary Center Navigation"] a:has-text("Celebrations")');
  await primaryCelebLink.click();
  await navTestPage.waitForTimeout(1000);

  const scrollAfterSamePageClick = await navTestPage.evaluate(() => ({
    scrollY: Math.round(window.scrollY),
    momentsTop: Math.round(document.getElementById('moments').getBoundingClientRect().top)
  }));
  const urlAfterClickHome = navTestPage.url();
  console.log('Scroll & URL after clicking Celebrations on /home:', scrollAfterSamePageClick, urlAfterClickHome);

  report.celebrationsNavigation = {
    urlFromFacilities: urlAfterClickFacilities,
    momentsExists: scrollPosition.momentsExists,
    scrollY: scrollPosition.scrollY,
    urlFromHome: urlAfterClickHome,
    scrollAfterSamePageClick
  };

  await navTestContext.close();

  // Test 5D: Mobile Navigation Drawer test
  const mobileNavContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mobileNavPage = await mobileNavContext.newPage();
  await mobileNavPage.goto(`${BASE_URL}/facilities`, { waitUntil: 'networkidle' });
  await mobileNavPage.waitForTimeout(500);

  // Click hamburger
  const menuBtn = await mobileNavPage.$('button[aria-label*="menu" i], button[aria-controls="mobile-nav-drawer"]');
  await menuBtn.click();
  await mobileNavPage.waitForTimeout(500);

  // Click Celebrations in drawer
  const drawerCelebLink = await mobileNavPage.$('#mobile-nav-drawer a:has-text("Celebrations")');
  await drawerCelebLink.click();
  await mobileNavPage.waitForTimeout(1000);

  const mobileUrlAfterClick = mobileNavPage.url();
  const drawerClosed = !(await mobileNavPage.isVisible('#mobile-nav-drawer'));
  console.log('Mobile URL after clicking Celebrations in drawer:', mobileUrlAfterClick, 'Drawer closed:', drawerClosed);

  report.mobileCelebrationsNavigation = {
    url: mobileUrlAfterClick,
    drawerClosed
  };
  await mobileNavContext.close();

  await browser.close();

  console.log('\n=== QUALITY GATE VERIFICATION COMPLETED ===');
  return report;
}

runQualityGate()
  .then(res => {
    require('fs').writeFileSync('design_audit/quality_gate_evidence.json', JSON.stringify(res, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error('Quality gate check error:', err);
    process.exit(1);
  });
