@echo off
echo Creating application icon instructions...

echo ⚠️  Please create application icons manually:
echo 1. Create a 512x512 PNG file named 'icon.png' in the 'public' folder
echo 2. Optionally create icon.ico for Windows and icon.icns for macOS
echo 3. You can use online tools like:
echo    - https://convertio.co/png-ico/
echo    - https://iconverticons.com/online/

REM Create a placeholder README
(
echo # Creating Application Icons
echo.
echo ## Required Icons
echo.
echo ### For all platforms:
echo - `public/icon.png` ^(512x512 pixels^) - Main application icon
echo.
echo ### Platform-specific ^(optional but recommended^):
echo - `public/icon.ico` ^(Windows^) - Use online converter from PNG
echo - `public/icon.icns` ^(macOS^) - Use online converter from PNG
echo.
echo ## Icon Design Guidelines
echo.
echo 1. **Size**: 512x512 pixels minimum for best quality
echo 2. **Format**: PNG with transparency support
echo 3. **Style**: Simple, recognizable design
echo 4. **Content**: Should represent the app's purpose ^(routing/networking^)
echo.
echo ## Online Tools
echo.
echo - **PNG to ICO**: https://convertio.co/png-ico/
echo - **PNG to ICNS**: https://iconverticons.com/online/
echo - **Icon Generator**: https://icon.kitchen/
echo.
echo ## Simple Design Ideas
echo.
echo - Router/network symbol
echo - Arrows showing direction/routing
echo - Simple geometric shapes
echo - App initials "DR" with styling
echo.
echo Create your icon and save it as `public/icon.png`, then the build process will work correctly.
) > public\create-icons.md

echo 📝 Created instructions in public\create-icons.md
echo.
echo Next steps:
echo 1. Create your icon design
echo 2. Save as public\icon.png ^(512x512 pixels^)
echo 3. Run the build again: npm run build

pause
