#!/bin/bash

# Release preparation script for Desktop Router

set -e

echo "🚀 Preparing Desktop Router for release..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $CURRENT_VERSION"

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes. Please commit or stash them before releasing."
    git status --short
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Ask for version bump type
echo "🔄 Version bump options:"
echo "1. patch (1.0.0 -> 1.0.1)"
echo "2. minor (1.0.0 -> 1.1.0)"
echo "3. major (1.0.0 -> 2.0.0)"
echo "4. custom"
echo "5. no change"

read -p "Select version bump (1-5): " VERSION_CHOICE

case $VERSION_CHOICE in
    1)
        NEW_VERSION=$(npm version patch --no-git-tag-version)
        ;;
    2)
        NEW_VERSION=$(npm version minor --no-git-tag-version)
        ;;
    3)
        NEW_VERSION=$(npm version major --no-git-tag-version)
        ;;
    4)
        read -p "Enter new version: " CUSTOM_VERSION
        npm version $CUSTOM_VERSION --no-git-tag-version
        NEW_VERSION="v$CUSTOM_VERSION"
        ;;
    5)
        NEW_VERSION="v$CURRENT_VERSION"
        echo "📌 Keeping current version: $NEW_VERSION"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo "📋 New version: $NEW_VERSION"

# Run tests
echo "🧪 Running tests..."
npm test || {
    echo "❌ Tests failed! Please fix tests before releasing."
    exit 1
}

# Build application
echo "🔨 Building application..."
npm run build || {
    echo "❌ Build failed! Please fix build errors before releasing."
    exit 1
}

# Commit version change if version was bumped
if [ "$VERSION_CHOICE" != "5" ]; then
    git add package.json
    git commit -m "Bump version to $NEW_VERSION"
    echo "✅ Version bump committed"
fi

# Push to trigger release workflow
echo "🚀 Ready to release!"
echo "To trigger the release workflow, push to main branch:"
echo "  git push origin main"
echo ""
echo "This will:"
echo "  ✅ Build executables for Windows, macOS, and Linux"
echo "  ✅ Create a GitHub release with tag $NEW_VERSION"
echo "  ✅ Upload all build artifacts to the release"
echo ""

read -p "Push now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin main
    echo "🎉 Release workflow triggered! Check GitHub Actions for progress."
    echo "🔗 https://github.com/axoblade/desktop-router/actions"
else
    echo "📝 Remember to push when ready: git push origin main"
fi
