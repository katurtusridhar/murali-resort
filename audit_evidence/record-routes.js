const http = require('http');
const fs = require('fs');
const path = require('path');

const routes = [
  { path: '/home', intended: 'Core Canonical Homepage', public: true },
  { path: '/facilities', intended: 'Core Facilities & Amenities', public: true },
  { path: '/gallery', intended: 'Core Visual Gallery', public: true },
  { path: '/contact', intended: 'Core Contact & Concierge', public: true },
  { path: '/', intended: 'Apex Domain Root', public: false },
  { path: '/home2', intended: 'Retired Homepage Variant', public: false },
  { path: '/home3', intended: 'Retired Homepage Variant', public: false },
  { path: '/home4', intended: 'Retired Homepage Variant', public: false },
  { path: '/home5', intended: 'Promoted Homepage Variant', public: false },
  { path: '/celebrations', intended: 'Temporary Booking Hold Route', public: false },
  { path: '/accommodations', intended: 'Obsolete Prototype Route', public: false },
  { path: '/experience', intended: 'Obsolete Prototype Route', public: false },
  { path: '/unregistered-test-page', intended: 'Custom 404 Not Found Handler', public: false },
  { path: '/sitemap.xml', intended: 'XML Sitemap Index', public: true }
];

function fetchPath(item) {
  return new Promise((resolve) => {
    const req = http.request(
      `http://localhost:3000${item.path}`,
      { method: 'GET' },
      (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          resolve({
            path: item.path,
            intendedPurpose: item.intended,
            intendedPublic: item.public,
            statusCode: res.statusCode,
            redirectLocation: res.headers.location || null,
            headers: {
              'content-security-policy': res.headers['content-security-policy'] || null,
              'strict-transport-security': res.headers['strict-transport-security'] || null,
              'x-frame-options': res.headers['x-frame-options'] || null,
              'x-content-type-options': res.headers['x-content-type-options'] || null,
              'referrer-policy': res.headers['referrer-policy'] || null,
              'permissions-policy': res.headers['permissions-policy'] || null,
            },
            bodyLength: body.length
          });
        });
      }
    );
    req.on('error', (err) => {
      resolve({ path: item.path, error: err.message });
    });
    req.end();
  });
}

async function run() {
  const results = [];
  for (const r of routes) {
    const res = await fetchPath(r);
    results.push(res);
  }
  const outPath = path.join(__dirname, '..', 'audit_evidence', '07_routes_status_matrix.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log('Saved routes status matrix to:', outPath);
  console.log(JSON.stringify(results.map(r => ({ path: r.path, status: r.statusCode, redirect: r.redirectLocation })), null, 2));
}

run();
