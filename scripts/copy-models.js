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
  
  // Patch resources.json to support 'isnet_fp16' and fix chunk names
  const resourcesPath = path.join(destDir, 'resources.json');
  if (fs.existsSync(resourcesPath)) {
    const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));
    
    // Fix chunks: @imgly/background-removal v1.7.0+ expects chunk.name instead of chunk.hash
    for (const key in resources) {
      if (resources[key] && resources[key].chunks) {
        resources[key].chunks.forEach(chunk => {
          if (chunk.hash && !chunk.name) {
            chunk.name = chunk.hash;
          }
        });
      }
    }

    // Map isnet_fp16 to small (or medium) to satisfy the library requirement
    if (resources['/models/small'] && !resources['/models/isnet_fp16']) {
      resources['/models/isnet_fp16'] = resources['/models/small'];
      resources['/models/isnet'] = resources['/models/medium'] || resources['/models/small'];
    }
    
    fs.writeFileSync(resourcesPath, JSON.stringify(resources, null, 2), 'utf8');
    console.log(`[copy-models] Patched resources.json to support 'isnet_fp16' and fixed chunk names`);
  }

  console.log(`[copy-models] Successfully copied local AI models to ${destDir}`);
} catch (err) {
  console.error(`[copy-models] Error copying models:`, err);
  process.exit(1);
}
