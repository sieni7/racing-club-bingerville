const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '../../backend/src/routes');
let violations = 0;

function scanSecurity() {
  if (!fs.existsSync(routesDir)) return;

  const files = fs.readdirSync(routesDir);
  for (const file of files) {
    if (file.endsWith('.ts')) {
      const content = fs.readFileSync(path.join(routesDir, file), 'utf8');
      
      // Look for post/put/delete routes that DO NOT have `authenticate` middleware
      // A naive approach: count total mutations and total `authenticate` usages
      const mutations = (content.match(/router\.(post|put|delete)/g) || []).length;
      const protectedRoutes = (content.match(/authenticate/g) || []).length;
      
      if (mutations > 0 && protectedRoutes === 0 && file !== 'authRoutes.ts') {
        violations += mutations; // Assuming all are unprotected
      }
    }
  }
}

scanSecurity();

const reportPath = path.join(__dirname, '../../reports');
if (!fs.existsSync(reportPath)) {
  fs.mkdirSync(reportPath, { recursive: true });
}

fs.writeFileSync(path.join(reportPath, 'security.json'), JSON.stringify({
  status: violations === 0 ? 'PASS' : 'FAIL',
  violations
}, null, 2));

console.log(`Security Gate: ${violations === 0 ? 'PASS' : 'FAIL'} (${violations} violations)`);
