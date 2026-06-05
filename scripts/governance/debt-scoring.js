const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, '../../reports');

function safeRead(filename) {
  try {
    return JSON.parse(fs.readFileSync(path.join(reportsDir, filename), 'utf8'));
  } catch (e) {
    return {};
  }
}

const typeSafety = safeRead('type-safety.json');
const zod = safeRead('zod-validation.json');
const arch = safeRead('architecture.json');
const security = safeRead('security.json');
const data = safeRead('data-integrity.json');

let debtScore = 0;

if (typeSafety.anyCount) debtScore += typeSafety.anyCount * 3;
if (typeSafety.tsIgnoreCount) debtScore += typeSafety.tsIgnoreCount * 5;

if (zod.violations) debtScore += zod.violations * 10;
if (arch.violations) debtScore += arch.violations * 15;
if (security.violations) debtScore += security.violations * 20;
if (data.violations) debtScore += data.violations * 10;

// Write output
const reportPath = path.join(__dirname, '../../reports');
if (!fs.existsSync(reportPath)) {
  fs.mkdirSync(reportPath, { recursive: true });
}

fs.writeFileSync(path.join(reportPath, 'debt-score.json'), JSON.stringify({
  debtScore,
  status: debtScore > 60 ? 'FAIL' : (debtScore > 30 ? 'WARN' : 'PASS')
}, null, 2));

console.log(`Debt Score: ${debtScore}`);
