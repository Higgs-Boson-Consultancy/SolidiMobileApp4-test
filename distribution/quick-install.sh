#!/bin/bash
# Quick Install Script for Solidi Mobile App
# Usage: ./quick-install.sh

echo "📱 Solidi Mobile App - Quick Installer"
echo "======================================"
echo ""

# Check if ADB is available
if ! command -v adb &> /dev/null; then
    echo "❌ ADB not found. Please install Android SDK Platform Tools."
    echo ""
    echo "Options:"
    echo "1. Transfer APK to your device manually"
    echo "2. Install ADB from: https://developer.android.com/studio/releases/platform-tools"
    exit 1
fi

# Find the APK
APK_FILE=$(find . -name "SolidiMobileApp-v*.apk" | head -1)

if [ -z "$APK_FILE" ]; then
    echo "❌ APK file not found in current directory"
    exit 1
fi

echo "✅ Found APK: $APK_FILE"
APK_SIZE=$(du -h "$APK_FILE" | cut -f1)
echo "📦 Size: $APK_SIZE"
echo ""

# Check for connected devices
echo "🔍 Checking for connected devices..."
DEVICES=$(adb devices | grep -v "List of devices" | grep "device$" | wc -l | tr -d ' ')

if [ "$DEVICES" -eq "0" ]; then
    echo "❌ No Android devices detected!"
    echo ""
    echo "📋 Setup Instructions:"
    echo "1. Enable USB Debugging on your Android device"
    echo "2. Connect device via USB"
    echo "3. Authorize computer when prompted"
    echo "4. Run this script again"
    echo ""
    echo "💡 Alternative: Transfer APK to device manually"
    exit 1
fi

echo "✅ Found $DEVICES connected device(s)"
echo ""

# Show device info
echo "📱 Device Information:"
adb devices -l | grep "device$"
echo ""

# Ask for confirmation
read -p "Install Solidi Mobile App on this device? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Installation cancelled."
    exit 0
fi

# Install APK
echo ""
echo "📲 Installing APK..."
adb install -r "$APK_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation successful!"
    echo ""
    echo "🚀 Launching app..."
    adb shell am start -n com.solidimobileapp4test/.MainActivity
    echo ""
    echo "✅ App launched! Check your device."
    echo ""
    echo "📝 To view logs, run:"
    echo "   adb logcat -s ReactNativeJS:V"
else
    echo ""
    echo "❌ Installation failed!"
    echo ""
    echo "💡 Try these solutions:"
    echo "1. Uninstall the old version first"
    echo "2. Check device storage space"
    echo "3. Enable 'Install from unknown sources'"
    echo "4. Try manual installation on device"
fi
