#!/bin/bash

# Build and deploy to connected iOS device
# This script builds the app and installs it on a connected iPhone

set -e

echo "🔨 Building Solidi Mobile App for iOS device..."
echo ""

# Navigate to iOS directory
cd "$(dirname "$0")/ios"

# Install pods if needed
if [ ! -d "Pods" ]; then
    echo "📦 Installing CocoaPods dependencies..."
    pod install
fi

# Build and deploy to device
echo "📱 Building and deploying to connected iPhone..."
echo ""

xcodebuild \
    -workspace SolidiMobileApp4.xcworkspace \
    -scheme SolidiMobileApp4 \
    -configuration Debug \
    -destination 'generic/platform=iOS' \
    -allowProvisioningUpdates \
    CODE_SIGN_IDENTITY="iPhone Developer" \
    CODE_SIGN_STYLE=Automatic \
    DEVELOPMENT_TEAM="" \
    build

echo ""
echo "✅ Build complete!"
echo ""
echo "To install on your device:"
echo "1. Open Xcode"
echo "2. Go to Window > Devices and Simulators"
echo "3. Select your iPhone"
echo "4. Drag the .app file from the build folder to install"
echo ""
echo "Or use Xcode to run directly:"
echo "  open ios/SolidiMobileApp4.xcworkspace"
