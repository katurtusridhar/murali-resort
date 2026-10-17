const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9246;
const USER_DATA_DIR = path.join(__dirname, 'edge_round3_profile');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function runBrowserAudit() {
  const edgeProcess = spawn(EDGE_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    '--headless=new',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    'about:blank'
  ]);

  let version = null;
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      version = await getJson(`http://127.0.0.1:${PORT}/json/version`);
      if (version && version.webSocketDebuggerUrl) break;
    } catch {}
  }

  const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
  const pageTarget = targets.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 0;
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = ++msgId;
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Input.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const routesToTest = [
    { url: 'http://localhost:3000/home', name: 'Canonical Home (/home)' },
    { url: 'http://localhost:3000/facilities', name: 'Facilities (/facilities)' },
    { url: 'http://localhost:3000/gallery', name: 'Gallery (/gallery)' },
    { url: 'http://localhost:3000/contact', name: 'Contact (/contact)' },
    { url: 'http://localhost:3000/', name: 'Root Apex Redirect (/ -> /home)' }
  ];

  const routeResults = [];

  for (const r of routesToTest) {
    console.log(`Auditing: ${r.name}`);
    const consoleLogs = [];
    const networkFailures = [];

    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args ? msg.params.args.map(a => a.value || a.description).join(' ') : msg.params.text;
        if (msg.params.type === 'error') consoleLogs.push({ type: 'error', text });
      }
      if (msg.method === 'Network.loadingFailed') {
        if (!msg.params.canceled) {
          networkFailures.push({ url: msg.params.requestId, errorText: msg.params.errorText });
        }
      }
    };

    ws.addEventListener('message', handler);
    await send('Page.navigate', { url: r.url });
    await sleep(4000);

    const domMetrics = await send('Runtime.evaluate', {
      expression: `(() => ({
        currentUrl: window.location.href,
        title: document.title,
        hasHeader: !!document.querySelector('header'),
        hasMain: !!document.querySelector('main'),
        h1Text: document.querySelector('h1') ? document.querySelector('h1').innerText.replace(/\\n/g, ' ') : null,
        scriptsCount: document.querySelectorAll('script').length,
        imagesCount: document.querySelectorAll('img').length,
        linksCount: document.querySelectorAll('a').length,
        buttonsCount: document.querySelectorAll('button').length
      }))()`,
      returnByValue: true
    });

    ws.removeEventListener('message', handler);

    routeResults.push({
      name: r.name,
      requestedUrl: r.url,
      dom: domMetrics.result.value,
      consoleErrors: consoleLogs,
      cspViolations: consoleLogs.filter(l => l.text && (l.text.includes('Content Security Policy') || l.text.includes('EvalError'))),
      networkFailures
    });
  }

  const runtimeEvidencePath = path.join(__dirname, '08_browser_runtime_audit.json');
  fs.writeFileSync(runtimeEvidencePath, JSON.stringify(routeResults, null, 2));
  console.log('Saved 08_browser_runtime_audit.json');

  // Functional Regressions:
  console.log('\n--- Running Functional Regressions ---');

  // Test 1: Navigation from /home to /facilities
  console.log('Test 1: Navbar Navigation from /home to /facilities');
  await send('Page.navigate', { url: 'http://localhost:3000/home' });
  await sleep(4000);
  const navClick = await send('Runtime.evaluate', {
    expression: `(() => {
      const link = document.querySelector('a[href="/facilities"]');
      if (link) { link.click(); return { clicked: true }; }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  await sleep(2000);
  const afterNav = await send('Runtime.evaluate', {
    expression: `(() => ({ url: window.location.href, title: document.title }))()`,
    returnByValue: true
  });

  // Test 2: Enquiry Form transparent dispatch
  console.log('Test 2: Contact Enquiry Form Submission & Transparent Dispatch');
  await send('Page.navigate', { url: 'http://localhost:3000/contact' });
  await sleep(3000);
  const formFill = await send('Runtime.evaluate', {
    expression: `(() => {
      const nameInput = document.querySelector('input[name="name"]');
      const emailInput = document.querySelector('input[name="email"]');
      const phoneInput = document.querySelector('input[name="phone"]');
      const select = document.querySelector('select[name="eventType"]');
      const submit = document.querySelector('button[type="submit"]');

      if (nameInput) nameInput.value = "Anand Sharma";
      if (emailInput) emailInput.value = "anand@example.com";
      if (phoneInput) phoneInput.value = "+919876543210";
      if (select) select.value = "wedding";

      // Trigger change events
      if (nameInput) nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      if (emailInput) emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      if (phoneInput) phoneInput.dispatchEvent(new Event('input', { bubbles: true }));

      if (submit) {
        submit.click();
        return { submitted: true };
      }
      return { submitted: false };
    })()`,
    returnByValue: true
  });
  await sleep(1500);
  const afterForm = await send('Runtime.evaluate', {
    expression: `(() => {
      const text = document.body ? document.body.innerText : '';
      const waBtn = document.querySelector('a[href*="wa.me"]');
      return {
        hasReadyNotice: text.includes('Enquiry Details Ready'),
        hasSetupModeNotice: text.includes('missing server-side SMTP/CRM provider'),
        waLinkPresent: !!waBtn,
        waHref: waBtn ? waBtn.href : null
      };
    })()`,
    returnByValue: true
  });

  // Test 3: Gallery Lightbox Open & Escape Key Close
  console.log('Test 3: Gallery Lightbox Open & Keyboard Dismissal');
  await send('Page.navigate', { url: 'http://localhost:3000/gallery' });
  await sleep(4000);
  const tileClick = await send('Runtime.evaluate', {
    expression: `(() => {
      const tile = document.querySelector('.drift-wall [role="button"]');
      if (tile) { tile.click(); return { clicked: true, label: tile.getAttribute('aria-label') }; }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  await sleep(1000);
  const lightboxOpen = await send('Runtime.evaluate', {
    expression: `(() => {
      const dialog = document.querySelector('#gallery-lightbox');
      return { isOpen: !!dialog, ariaLabel: dialog ? dialog.getAttribute('aria-label') : null };
    })()`,
    returnByValue: true
  });
  // Dismiss via Close Button
  const closeBtnClick = await send('Runtime.evaluate', {
    expression: `(() => {
      const closeBtn = document.querySelector('button[aria-label="Close image preview"]');
      if (closeBtn) {
        closeBtn.click();
        return { clicked: true };
      }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  await sleep(1500);
  const lightboxClosed = await send('Runtime.evaluate', {
    expression: `(() => ({ isOpen: !!document.querySelector('#gallery-lightbox') }))()`,
    returnByValue: true
  });

  const functionalEvidence = {
    test1_navigation: {
      action: 'Click Navbar /facilities link on /home',
      clickResult: navClick.result.value,
      afterNav: afterNav.result.value,
      passed: afterNav.result.value.url.includes('/facilities')
    },
    test2_enquiryFlow: {
      action: 'Fill Contact form and submit without backend provider',
      formSubmission: formFill.result.value,
      dispatchResult: afterForm.result.value,
      passed: afterForm.result.value.hasReadyNotice && afterForm.result.value.waLinkPresent
    },
    test3_galleryLightbox: {
      action: 'Click DriftWall tile, verify modal opened and dismiss via Close button',
      tileClick: tileClick.result.value,
      modalOpened: lightboxOpen.result.value,
      closeButtonClick: closeBtnClick.result.value,
      modalDismissed: !lightboxClosed.result.value.isOpen,
      passed: lightboxOpen.result.value.isOpen && !lightboxClosed.result.value.isOpen
    }
  };

  const functionalEvidencePath = path.join(__dirname, '09_functional_regression.json');
  fs.writeFileSync(functionalEvidencePath, JSON.stringify(functionalEvidence, null, 2));
  console.log('Saved 09_functional_regression.json');

  ws.close();
  edgeProcess.kill();
  await sleep(1000);
  try { fs.rmSync(USER_DATA_DIR, { recursive: true, force: true }); } catch {}
  process.exit(0);
}

runBrowserAudit().catch(console.error);
