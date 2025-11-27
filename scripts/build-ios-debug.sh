#!/bin/bash

# iOS Debug Build Script
# Builds and installs the app on a connected iOS device

set -e

echo "🍎 Building iOS Debug App..."

cd ios

# Clean build folder
echo "🧹 Cleaning build folder..."
rm -rf build

# Install pods if needed
if [ ! -d "Pods" ]; then
    echo "📦 Installing CocoaPods dependencies..."
    pod install
fi

# Build for device
echo "🔨 Building for iOS device..."
xcodebuild -workspace SolidiMobileApp4.xcworkspace \
  -scheme SolidiMobileApp4 \
  -configuration Debug \
  -destination 'generic/platform=iOS' \
  -derivedDataPath build \
  CODE_SIGN_IDENTITY="" \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGNING_ALLOWED=NO

echo "✅ Build complete!"
echo ""
echo "📱 To install on your iPhone:"
echo "1. Open Xcode"
echo "2. Open SolidiMobileApp4.xcworkspace"
echo "3. Select your iPhone from the device dropdown"
echo "4. Click the Run button (▶️)"
