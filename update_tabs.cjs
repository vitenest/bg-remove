const fs = require('fs');
let content = fs.readFileSync('src/utils/seoContent.js', 'utf8');

const newTabs = `tabs: [
      { name: 'Individuals', image: '/images/individual_with_bg.png', processedImage: '/images/individual_no_bg_transparent.png' },
      { name: 'E-Commerce', image: '/images/ecommerce_with_bg.png', processedImage: '/images/ecommerce_no_bg.png' },
      { name: 'Social Media', image: '/images/social_with_bg.png', processedImage: '/images/social_no_bg.png' },
      { name: 'Designers', image: '/images/designers_with_bg.png', processedImage: '/images/designers_no_bg.png' }
    ]`;

content = content.replace(/tabs:\s*\[[\s\S]*?\],/g, newTabs + ',');

fs.writeFileSync('src/utils/seoContent.js', content);
console.log('Tabs updated successfully');
