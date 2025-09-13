const fs = require("fs");
const path = require("path");

// Create a simple PNG icon programmatically
// This creates a basic 512x512 icon with a router-like design

function createBasicIcon() {
	// This is a simple 16x16 PNG in base64 that we'll use as a template
	// A minimal blue square icon
	const base64Icon = `iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wkNDSgQqJW9owAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAiRJREFUWIXtl71qwzAQx3+KOzgECqFDpw7dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KFDhw4dOnTo0KJAAAAAABJRU5ErkJggg==`;

	// For now, let's create a simple router icon using SVG and convert it
	const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background rounded rectangle -->
  <rect x="32" y="32" width="448" height="448" rx="64" ry="64" fill="url(#grad)"/>
  
  <!-- Router icon -->
  <circle cx="256" cy="256" r="120" fill="none" stroke="white" stroke-width="12"/>
  <circle cx="256" cy="256" r="20" fill="white"/>
  
  <!-- Connection lines -->
  <line x1="80" y1="256" x2="136" y2="256" stroke="white" stroke-width="10" stroke-linecap="round"/>
  <line x1="376" y1="256" x2="432" y2="256" stroke="white" stroke-width="10" stroke-linecap="round"/>
  <line x1="256" y1="80" x2="256" y2="136" stroke="white" stroke-width="10" stroke-linecap="round"/>
  <line x1="256" y1="376" x2="256" y2="432" stroke="white" stroke-width="10" stroke-linecap="round"/>
  
  <!-- Corner connections -->
  <line x1="150" y1="150" x2="186" y2="186" stroke="white" stroke-width="8" stroke-linecap="round"/>
  <line x1="362" y1="150" x2="326" y2="186" stroke="white" stroke-width="8" stroke-linecap="round"/>
  <line x1="150" y1="362" x2="186" y2="326" stroke="white" stroke-width="8" stroke-linecap="round"/>
  <line x1="362" y1="362" x2="326" y2="326" stroke="white" stroke-width="8" stroke-linecap="round"/>
  
  <!-- Text -->
  <text x="256" y="420" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
        text-anchor="middle" fill="white">Desktop Router</text>
</svg>`;

	// Write the SVG file
	const publicDir = path.join(__dirname, "..", "public");
	if (!fs.existsSync(publicDir)) {
		fs.mkdirSync(publicDir, { recursive: true });
	}

	fs.writeFileSync(path.join(publicDir, "icon.svg"), svgIcon);

	console.log("✅ Created icon.svg");
	console.log("📝 To complete icon setup:");
	console.log("1. Convert icon.svg to icon.png (512x512) using online tools:");
	console.log("   - https://convertio.co/svg-png/");
	console.log("   - https://www.svg2png.com/");
	console.log(
		"2. Optionally create icon.ico and icon.icns for platform-specific builds"
	);
	console.log("3. Run build again: npm run build");
}

// Run the function if this script is executed directly
if (require.main === module) {
	createBasicIcon();
}

module.exports = { createBasicIcon };
