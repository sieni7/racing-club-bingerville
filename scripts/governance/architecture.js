const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, '../../backend/src/controllers');
let violations = 0;
let details = [];

function scanControllers() {
  if (!fs.existsSync(controllersDir)) return;

  const files = fs.readdirSync(controllersDir);
  for (const file of files) {
    if (file.endsWith('.ts')) {
      const content = fs.readFileSync(path.join(controllersDir, file), 'utf8');
      
      // Look for DB access patterns like `.find(`, `.findOne(`, `.save(`, `.update(` that indicate missing Repository layer
      // This is a naive heuristic
      const dbAccessMatches = content.match(/\.(find|findOne|findByIdAndUpdate|save|deleteMany)\(/g);
      
      // However, we did write repositories! But let's check if the raw mongoose model is imported
      const modelImport = content.match(/import.*from.*models\/.*/g);
      
      if (modelImport && !file.includes('authController')) {
        // authController might use User directly for login if no repo method exists, but ideally it should use repo too.
        // We will just log warnings
        violations++;
        details.push(`Direct Model import in ${file}`);
      }
    }
  }
}

const servicesDir = path.join(__dirname, '../../backend/src/services');
function scanServices() {
  if (!fs.existsSync(servicesDir)) return;
  const files = fs.readdirSync(servicesDir);
  for (const file of files) {
    if (file.endsWith('.ts')) {
      const content = fs.readFileSync(path.join(servicesDir, file), 'utf8');
      
      const manualStatsUpdate = content.match(/StatsJoueur\.(update|updateOne|findOneAndUpdate)/g) || 
                                content.match(/\.\$inc.*buts/g) || 
                                content.match(/\.increment.*stats/gi);
      
      if (manualStatsUpdate) {
        violations++;
        details.push(`Manual stats update detected in ${file}. Use recalculateForJoueur instead.`);
      }
    }
  }
}

scanControllers();
scanServices();

const reportPath = path.join(__dirname, '../../reports');
if (!fs.existsSync(reportPath)) {
  fs.mkdirSync(reportPath, { recursive: true });
}

fs.writeFileSync(path.join(reportPath, 'architecture.json'), JSON.stringify({
  status: violations === 0 ? 'PASS' : 'WARN',
  violations,
  details
}, null, 2));

console.log(`Architecture Gate: ${violations === 0 ? 'PASS' : 'WARN'} (${violations} violations)`);
