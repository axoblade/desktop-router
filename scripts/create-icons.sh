#!/bin/bash

# Create a simple PNG icon for the application
# This script creates a basic icon using ImageMagick (if available)
# or provides instructions for manual creation

echo "Creating application icons..."

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "ImageMagick found, creating PNG icon..."
    
    # Create a simple icon with ImageMagick
    convert -size 512x512 xc:transparent \
        -fill "#667eea" \
        -draw "roundrectangle 64,64 448,448 32,32" \
        -fill white \
        -font Arial-Bold -pointsize 48 \
        -gravity center \
        -annotate +0-20 "DR" \
        -font Arial -pointsize 20 \
        -annotate +0+30 "Desktop Router" \
        public/icon.png
    
    # Create different sizes
    convert public/icon.png -resize 256x256 public/icon-256.png
    convert public/icon.png -resize 128x128 public/icon-128.png
    convert public/icon.png -resize 64x64 public/icon-64.png
    convert public/icon.png -resize 32x32 public/icon-32.png
    convert public/icon.png -resize 16x16 public/icon-16.png
    
    echo "✅ Icons created successfully!"
    
else
    echo "⚠️  ImageMagick not found. Please create icons manually:"
    echo "1. Create a 512x512 PNG file named 'icon.png' in the 'public' folder"
    echo "2. Optionally create icon.ico for Windows and icon.icns for macOS"
    echo "3. You can use online tools like:"
    echo "   - https://convertio.co/png-ico/"
    echo "   - https://iconverticons.com/online/"
    
    # Create a placeholder README
    cat > public/create-icons.md << 'EOF'
# Creating Application Icons

## Required Icons

### For all platforms:
- `public/icon.png` (512x512 pixels) - Main application icon

### Platform-specific (optional but recommended):
- `public/icon.ico` (Windows) - Use online converter from PNG
- `public/icon.icns` (macOS) - Use online converter from PNG

## Icon Design Guidelines

1. **Size**: 512x512 pixels minimum for best quality
2. **Format**: PNG with transparency support
3. **Style**: Simple, recognizable design
4. **Content**: Should represent the app's purpose (routing/networking)

## Online Tools

- **PNG to ICO**: https://convertio.co/png-ico/
- **PNG to ICNS**: https://iconverticons.com/online/
- **Icon Generator**: https://icon.kitchen/

## Simple Design Ideas

- Router/network symbol
- Arrows showing direction/routing
- Simple geometric shapes
- App initials "DR" with styling

Create your icon and save it as `public/icon.png`, then the build process will work correctly.
EOF

    echo "📝 Created instructions in public/create-icons.md"
fi
