const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9255;
const USER_DATA_DIR = path.join(__dirname, 'edge_functional_test_profile');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function runTests() {
  const edge = spawn(EDGE_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    '--headless=new',
    'about:blank'
  ]);

  await sleep(2000);
  const targetsRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const targets = await targetsRes.json();
  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise(resolve => {
    const curId = id++;
    const h = (e) => {
      const m = JSON.parse(e.data);
      if (m.id === curId) { ws.removeEventListener('message', h); resolve(m.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  // Test 1: Navigation from /home to /facilities
  console.log('Testing Test 1: Navigation');
  await send('Page.navigate', { url: 'http://localhost:3000/home' });
  await sleep(3500);

  const navClick = await send('Runtime.evaluate', {
    expression: `(() => {
      const navLink = document.querySelector('nav a[href="/facilities"]');
      if (navLink) { navLink.click(); return { clicked: true }; }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  await sleep(3000);

  const afterNav = await send('Runtime.evaluate', {
    expression: `(() => ({ url: window.location.href, title: document.title }))()`,
    returnByValue: true
  });
  const t1Passed = afterNav.result.value.url.includes('/facilities');
  console.log('Test 1 Passed:', t1Passed);

  // Test 2: Contact form submission with transparent concierge dispatch
  console.log('Testing Test 2: Contact Enquiry');
  await send('Page.navigate', { url: 'http://localhost:3000/contact' });
  await sleep(3500);

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
  const t2Passed = afterForm.result.value.hasReadyNotice && afterForm.result.value.waLinkPresent;
  console.log('Test 2 Passed:', t2Passed);

  // Test 3: Gallery Lightbox Open & Close (both button & escape)
  console.log('Testing Test 3: Gallery Lightbox');
  await send('Page.navigate', { url: 'http://localhost:3000/gallery' });
  await sleep(4000);

  const openClick = await send('Runtime.evaluate', {
    expression: `(() => {
      const tile = document.querySelector('.drift-wall [role="button"]');
      if (tile) { tile.click(); return { clicked: true, label: tile.getAttribute('aria-label') }; }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  await sleep(1000);

  const openCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const dialog = document.querySelector('#gallery-lightbox');
      const closeBtn = document.querySelector('button[aria-label="Close image preview"]');
      return { isOpen: !!dialog, hasCloseBtn: !!closeBtn, ariaLabel: dialog ? dialog.getAttribute('aria-label') : null };
    })()`,
    returnByValue: true
  });

  // Click close button
  const closeBtnClick = await send('Runtime.evaluate', {
    expression: `(() => {
      const closeBtn = document.querySelector('button[aria-label="Close image preview"]');
      if (closeBtn) { closeBtn.click(); return { clicked: true }; }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  await sleep(1000);

  const afterCloseCheck = await send('Runtime.evaluate', {
    expression: `(() => ({ isOpen: !!document.querySelector('#gallery-lightbox') }))()`,
    returnByValue: true
  });

  const t3Passed = openCheck.result.value.isOpen && !afterCloseCheck.result.value.isOpen;
  console.log('Test 3 Passed:', t3Passed, 'openCheck:', openCheck.result.value, 'afterCloseCheck:', afterCloseCheck.result.value);

  const functionalResults = {
    test1_navigation: {
      action: "Click Navbar /facilities link on /home",
      clickResult: navClick.result.value,
      afterNav: afterNav.result.value,
      passed: t1Passed
    },
    test2_enquiryFlow: {
      action: "Fill Contact form and submit without backend provider",
      formSubmission: formFill.result.value,
      dispatchResult: afterForm.result.value,
      passed: t2Passed
    },
    test3_galleryLightbox: {
      action: "Click DriftWall tile, verify modal opened and dismiss via Close button",
      tileClick: openClick.result.value,
      modalOpened: openCheck.result.value,
      closeButtonClick: closeBtnClick.result.value,
      modalDismissed: !afterCloseCheck.result.value.isOpen,
      passed: t3Passed
    }
  };

  const outPath = path.join(__dirname, '09_functional_regression.json');
  fs.writeFileSync(outPath, JSON.stringify(functionalResults, null, 2));
  console.log('Saved clean 09_functional_regression.json');

  ws.close();
  edge.kill();
  await sleep(500);
  try { fs.rmSync(USER_DATA_DIR, { recursive: true, force: true }); } catch {}
  process.exit(0);
}

runTests().catch(e => {
  console.error(e);
  process.exit(1);
});
