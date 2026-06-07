import fs from 'fs';
import path from 'path';

const __dirname = import.meta.dirname;
const sourceDir = path.join(__dirname, '..', 'node_modules', '@imgly', 'background-removal-data', 'dist');
const destDir = path.join(__dirname, '..', 'public', 'models');

if (!fs.existsSync(sourceDir)) {
  console.warn(`[copy-models] Source directory ${sourceDir} does not exist. Skipping copy.`);
  process.exit(0);
}

// Copy sourceDir to destDir recursively
try {
  fs.cpSync(sourceDir, destDir, { recursive: true, force: true });
  console.log(`[copy-models] Successfully copied local AI models to ${destDir}`);
} catch (err) {
  console.error(`[copy-models] Error copying models:`, err);
  process.exit(1);
}
