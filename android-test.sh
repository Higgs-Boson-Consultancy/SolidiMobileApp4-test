#!/bin/bash
# Android Testing Script for Solidi Mobile App
# This script helps test the app on connected Android devices

echo "🤖 ===== Android Testing Helper for Solidi Mobile App ====="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if ADB is installed
if ! command -v adb &> /dev/null; then
    echo -e "${RED}❌ ADB not found. Please install Android SDK Platform Tools.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ ADB found at: $(which adb)${NC}"
echo ""

# Check for connected devices
echo "📱 Checking for connected Android devices..."
DEVICES=$(adb devices | grep -v "List of devices" | grep "device$" | wc -l | tr -d ' ')

if [ "$DEVICES" -eq "0" ]; then
    echo -e "${RED}❌ No Android devices detected!${NC}"
    echo ""
    echo "📋 Setup Checklist for Google Pixel 6a:"
    echo "   1. Enable Developer Options (Settings → About → Tap Build Number 7x)"
    echo "   2. Enable USB Debugging (Settings → System → Developer Options)"
    echo "   3. Connect via USB and allow debugging when prompted"
    echo "   4. Set USB mode to 'File Transfer' or 'PTP'"
    echo ""
    echo "Run this script again after completing setup."
    exit 1
else
    echo -e "${GREEN}✅ Found $DEVICES connected device(s)${NC}"
    echo ""
    echo "📱 Device Details:"
    adb devices -l
    echo ""
fi

# Get device info
echo "📊 Device Information:"
DEVICE_MODEL=$(adb shell getprop ro.product.model 2>/dev/null | tr -d '\r')
DEVICE_ANDROID=$(adb shell getprop ro.build.version.release 2>/dev/null | tr -d '\r')
DEVICE_API=$(adb shell getprop ro.build.version.sdk 2>/dev/null | tr -d '\r')

echo -e "   Model: ${BLUE}$DEVICE_MODEL${NC}"
echo -e "   Android: ${BLUE}$DEVICE_ANDROID (API $DEVICE_API)${NC}"
echo ""

# Check if Metro bundler is running
echo "🔍 Checking Metro bundler status..."
if lsof -ti:8081 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Metro bundler is running on port 8081${NC}"
else
    echo -e "${YELLOW}⚠️  Metro bundler is not running${NC}"
    echo "   Start it with: npm start"
fi
echo ""

# Menu
echo "🎯 What would you like to do?"
echo ""
echo "   1) 🚀 Build and install debug APK"
echo "   2) 📦 Build release APK"
echo "   3) 🔄 Reinstall existing APK"
echo "   4) 📱 Launch app on device"
echo "   5) 📝 View app logs (logcat)"
echo "   6) 🧹 Clean build cache"
echo "   7) 🔍 Check app installation status"
echo "   8) 🗑️  Uninstall app from device"
echo "   9) 📊 Device system info"
echo "   0) ❌ Exit"
echo ""
read -p "Enter your choice (0-9): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Building and installing debug APK..."
        cd android && ./gradlew assembleDebug && ./gradlew installDebug
        ;;
    2)
        echo ""
        echo "📦 Building release APK..."
        cd android && ./gradlew assembleRelease
        echo ""
        echo "📍 Release APK location:"
        ls -lh android/app/build/outputs/apk/release/*.apk
        ;;
    3)
        echo ""
        echo "🔄 Reinstalling app..."
        adb uninstall com.solidimobileapp4 2>/dev/null
        cd android && ./gradlew installDebug
        ;;
    4)
        echo ""
        echo "📱 Launching Solidi app..."
        adb shell am start -n com.solidimobileapp4/.MainActivity
        ;;
    5)
        echo ""
        echo "📝 Showing app logs (Ctrl+C to stop)..."
        echo ""
        adb logcat | grep -E "SolidiMobileApp|ReactNativeJS|AndroidRuntime"
        ;;
    6)
        echo ""
        echo "🧹 Cleaning build cache..."
        cd android && ./gradlew clean
        rm -rf android/app/build
        echo "✅ Clean complete"
        ;;
    7)
        echo ""
        echo "🔍 Checking app installation..."
        if adb shell pm list packages | grep -q "com.solidimobileapp4"; then
            echo -e "${GREEN}✅ App is installed${NC}"
            APP_VERSION=$(adb shell dumpsys package com.solidimobileapp4 | grep versionName | head -1)
            echo "   $APP_VERSION"
        else
            echo -e "${RED}❌ App is not installed${NC}"
        fi
        ;;
    8)
        echo ""
        echo "🗑️  Uninstalling app..."
        adb uninstall com.solidimobileapp4
        echo "✅ Uninstall complete"
        ;;
    9)
        echo ""
        echo "📊 Device System Information:"
        echo ""
        echo "🔋 Battery:"
        adb shell dumpsys battery | grep level
        echo ""
        echo "💾 Storage:"
        adb shell df -h | grep "/data"
        echo ""
        echo "🧠 Memory:"
        adb shell cat /proc/meminfo | grep MemTotal
        ;;
    0)
        echo ""
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Operation complete!"
echo ""
