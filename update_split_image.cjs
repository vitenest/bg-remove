const fs = require('fs');
let content = fs.readFileSync('src/utils/seoContent.js', 'utf8');

content = content.replace(/splitImage:\s*["'][^"']+["']/g, 'splitImage: "/images/privacy_minimal.png"');

fs.writeFileSync('src/utils/seoContent.js', content);
console.log('Split images updated to minimal version successfully');
