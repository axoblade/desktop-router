@echo off
setlocal enabledelayedexpansion

echo 🚀 Preparing Desktop Router for release...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

REM Get current version
for /f %%i in ('node -p "require('./package.json').version"') do set CURRENT_VERSION=%%i
echo 📦 Current version: %CURRENT_VERSION%

REM Check for uncommitted changes
git status --porcelain > temp_status.txt
set /p STATUS_CHECK=<temp_status.txt
del temp_status.txt

if not "%STATUS_CHECK%"=="" (
    echo ⚠️  Warning: You have uncommitted changes. Please commit or stash them before releasing.
    git status --short
    set /p CONTINUE="Continue anyway? (y/N): "
    if /i not "!CONTINUE!"=="y" exit /b 1
)

REM Ask for version bump type
echo 🔄 Version bump options:
echo 1. patch (1.0.0 -^> 1.0.1)
echo 2. minor (1.0.0 -^> 1.1.0)
echo 3. major (1.0.0 -^> 2.0.0)
echo 4. custom
echo 5. no change

set /p VERSION_CHOICE="Select version bump (1-5): "

if "%VERSION_CHOICE%"=="1" (
    for /f %%i in ('npm version patch --no-git-tag-version') do set NEW_VERSION=%%i
) else if "%VERSION_CHOICE%"=="2" (
    for /f %%i in ('npm version minor --no-git-tag-version') do set NEW_VERSION=%%i
) else if "%VERSION_CHOICE%"=="3" (
    for /f %%i in ('npm version major --no-git-tag-version') do set NEW_VERSION=%%i
) else if "%VERSION_CHOICE%"=="4" (
    set /p CUSTOM_VERSION="Enter new version: "
    npm version !CUSTOM_VERSION! --no-git-tag-version
    set NEW_VERSION=v!CUSTOM_VERSION!
) else if "%VERSION_CHOICE%"=="5" (
    set NEW_VERSION=v%CURRENT_VERSION%
    echo 📌 Keeping current version: !NEW_VERSION!
) else (
    echo ❌ Invalid choice
    exit /b 1
)

echo 📋 New version: %NEW_VERSION%

REM Run tests
echo 🧪 Running tests...
npm test
if errorlevel 1 (
    echo ❌ Tests failed! Please fix tests before releasing.
    exit /b 1
)

REM Build application
echo 🔨 Building application...
npm run build
if errorlevel 1 (
    echo ❌ Build failed! Please fix build errors before releasing.
    exit /b 1
)

REM Commit version change if version was bumped
if not "%VERSION_CHOICE%"=="5" (
    git add package.json
    git commit -m "Bump version to %NEW_VERSION%"
    echo ✅ Version bump committed
)

REM Push to trigger release workflow
echo 🚀 Ready to release!
echo To trigger the release workflow, push to main branch:
echo   git push origin main
echo.
echo This will:
echo   ✅ Build executables for Windows, macOS, and Linux
echo   ✅ Create a GitHub release with tag %NEW_VERSION%
echo   ✅ Upload all build artifacts to the release
echo.

set /p PUSH_NOW="Push now? (y/N): "
if /i "%PUSH_NOW%"=="y" (
    git push origin main
    echo 🎉 Release workflow triggered! Check GitHub Actions for progress.
    echo 🔗 https://github.com/axoblade/desktop-router/actions
) else (
    echo 📝 Remember to push when ready: git push origin main
)

pause
