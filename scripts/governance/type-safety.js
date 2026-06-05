const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// A basic AST/Regex scanner for TypeScript files
const srcDir = path.join(__dirname, '../../backend/src');
const frontendDir = path.join(__dirname, '../../frontend/src');

function scanDirectory(dir, issues = { anyCount: 0, tsIgnoreCount: 0 }) {
  if (!fs.existsSync(dir)) return issues;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDirectory(fullPath, issues);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for `: any` or `as any` (simple regex matching)
      const anyMatches = content.match(/(: any(\s|;|,|=|\)|\]|>))|(as any)/g);
      if (anyMatches) {
        issues.anyCount += anyMatches.length;
      }

      // Look for `@ts-ignore`
      const tsIgnoreMatches = content.match(/@ts-ignore/g);
      if (tsIgnoreMatches) {
        issues.tsIgnoreCount += tsIgnoreMatches.length;
      }
    }
  }
  return issues;
}

const backendIssues = scanDirectory(srcDir);
const frontendIssues = scanDirectory(frontendDir);

const totalAny = backendIssues.anyCount + frontendIssues.anyCount;
const totalIgnore = backendIssues.tsIgnoreCount + frontendIssues.tsIgnoreCount;

const reportPath = path.join(__dirname, '../../reports');
if (!fs.existsSync(reportPath)) {
  fs.mkdirSync(reportPath, { recursive: true });
}

const status = (totalAny > 0 || totalIgnore > 0) ? 'FAIL' : 'PASS';

fs.writeFileSync(path.join(reportPath, 'type-safety.json'), JSON.stringify({
  status,
  anyCount: totalAny,
  tsIgnoreCount: totalIgnore
}, null, 2));

console.log(`Type Safety Gate: ${status}`);
console.log(`- 'any' usages: ${totalAny}`);
console.log(`- '@ts-ignore' usages: ${totalIgnore}`);
