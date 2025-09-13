@echo off
echo Installing Desktop Router dependencies...
cd /d "e:\axoblade\desktop-router"
npm install
if %errorlevel% equ 0 (
    echo.
    echo Installation completed successfully!
    echo.
    echo To start the application, run:
    echo npm start
    echo.
    echo To start in development mode with DevTools, run:
    echo npm run dev
) else (
    echo.
    echo Installation failed! Please check the error messages above.
)
pause
