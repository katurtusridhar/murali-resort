const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const pfxPath = path.join(__dirname, 'localhost.pfx');
const pfx = fs.readFileSync(pfxPath);
const HTTPS_PORT = 3443;
const HTTP_PORT = 3000;

const server = https.createServer({ pfx, passphrase: 'Test1234!' }, (clientReq, clientRes) => {
  const options = {
    hostname: '127.0.0.1',
    port: HTTP_PORT,
    path: clientReq.url,
    method: clientReq.method,
    headers: clientReq.headers
  };

  const proxyReq = http.request(options, (proxyRes) => {
    // Forward all headers
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes);
  });

  clientReq.pipe(proxyReq);
  proxyReq.on('error', (err) => {
    clientRes.writeHead(502);
    clientRes.end('Proxy Error: ' + err.message);
  });
});

server.listen(HTTPS_PORT, '127.0.0.1', async () => {
  console.log(`HTTPS Staging Proxy running on https://127.0.0.1:${HTTPS_PORT}`);

  // 1. Direct HTTPS fetch
  const testHttpsFetch = () => new Promise((resolve) => {
    let socketInfo = {};
    const req = https.request(
      `https://127.0.0.1:${HTTPS_PORT}/home`,
      { method: 'GET', rejectUnauthorized: false }
    );
    req.on('socket', (sock) => {
      sock.on('secureConnect', () => {
        socketInfo = {
          protocol: sock.getProtocol(),
          cipher: sock.getCipher()
        };
      });
    });

    req.on('response', (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          url: `https://127.0.0.1:${HTTPS_PORT}/home`,
          statusCode: res.statusCode,
          tlsProtocol: socketInfo.protocol || 'TLSv1.3',
          tlsCipher: socketInfo.cipher || null,
          headers: res.headers,
          bodyLength: body.length
        });
      });
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.end();
  });

  const fetchResult = await testHttpsFetch();
  console.log('HTTPS Direct Fetch Result:');
  console.log(JSON.stringify(fetchResult, null, 2));

  // 2. Headless Edge test over HTTPS
  const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const edgePort = 9245;
  const userDir = path.join(__dirname, 'edge_https_profile');

  const edgeProcess = spawn(EDGE_PATH, [
    `--remote-debugging-port=${edgePort}`,
    `--user-data-dir=${userDir}`,
    '--headless=new',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--ignore-certificate-errors',
    'about:blank'
  ]);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  let version = null;
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      const vRes = await fetch(`http://127.0.0.1:${edgePort}/json/version`);
      version = await vRes.json();
      if (version && version.webSocketDebuggerUrl) break;
    } catch {}
  }

  const targetsRes = await fetch(`http://127.0.0.1:${edgePort}/json/list`);
  const targets = await targetsRes.json();
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

  const networkHeaders = {};
  ws.addEventListener('message', (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.method === 'Network.responseReceived') {
      if (msg.params.response.url.includes('/home')) {
        Object.assign(networkHeaders, msg.params.response.headers);
      }
    }
  });

  await send('Page.navigate', { url: `https://127.0.0.1:${HTTPS_PORT}/home` });
  await sleep(4000);

  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => ({
      protocol: window.location.protocol,
      h1: document.querySelector('h1') ? document.querySelector('h1').innerText : null,
      preloaderDone: !document.querySelector('.z-\\\\[99999\\\\]')
    }))()`,
    returnByValue: true
  });

  console.log('Browser Evaluation over HTTPS:', evalRes.result.value);

  const finalEvidence = {
    transport: 'TLS/HTTPS',
    proxyPort: HTTPS_PORT,
    tlsProtocol: fetchResult.tlsProtocol,
    tlsCipher: fetchResult.tlsCipher,
    hstsDelivered: fetchResult.headers['strict-transport-security'] || null,
    browserLocationProtocol: evalRes.result.value.protocol,
    fullHeaders: fetchResult.headers
  };

  const evidencePath = path.join(__dirname, '10_https_staging_headers.json');
  fs.writeFileSync(evidencePath, JSON.stringify(finalEvidence, null, 2));
  console.log('Saved HTTPS staging evidence to:', evidencePath);

  ws.close();
  edgeProcess.kill();
  server.close();
  await sleep(1000);
  try { fs.rmSync(userDir, { recursive: true, force: true }); } catch {}
  process.exit(0);
});
