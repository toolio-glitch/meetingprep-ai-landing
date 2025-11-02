// Simple script to generate Chrome extension icons
// Uses Node.js with canvas package

const fs = require('fs');
const path = require('path');

// Simple function to create PNG using canvas (requires canvas package)
// If canvas isn't available, we'll use a fallback approach

async function generateIcons() {
  try {
    // Try to use canvas package
    const { createCanvas } = require('canvas');
    
    const sizes = [16, 48, 128];
    
    for (const size of sizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      
      // Add rounded corners (subtle)
      ctx.globalCompositeOperation = 'destination-in';
      const radius = size * 0.2;
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, radius);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      
      // Add "MP" text
      ctx.fillStyle = 'white';
      const fontSize = Math.floor(size * 0.4);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MP', size/2, size/2);
      
      // Save the icon
      const buffer = canvas.toBuffer('image/png');
      const filename = `icon${size}.png`;
      const filepath = path.join(__dirname, filename);
      
      fs.writeFileSync(filepath, buffer);
      console.log(`✓ Created ${filename} (${size}x${size})`);
    }
    
    console.log('\n✅ All icons generated successfully!');
    console.log('Files created in:', __dirname);
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('⚠️  Canvas package not found.');
      console.log('📝 Please run: npm install canvas');
      console.log('\nOr use the create-icons.html file in your browser instead.');
      process.exit(1);
    } else {
      console.error('Error generating icons:', error);
      process.exit(1);
    }
  }
}

generateIcons();

