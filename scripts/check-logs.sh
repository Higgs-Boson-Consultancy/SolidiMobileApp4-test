#!/bin/bash

# Script to check logs for errors and important messages
# Usage: ./scripts/check-logs.sh

LOGS_DIR="logs"

echo "================================================"
echo "   LOG ANALYSIS - $(date)"
echo "================================================"
echo ""

# Check Metro bundler
echo "📦 METRO BUNDLER STATUS:"
if [ -f "$LOGS_DIR/metro-bundler.log" ]; then
    # Check if Metro is running
    if grep -q "Fast - Scalable - Integrated" "$LOGS_DIR/metro-bundler.log" 2>/dev/null; then
        echo "✅ Metro is running on port 8081"
    else
        echo "❌ Metro may not be running properly"
    fi
    
    # Check for errors
    ERROR_COUNT=$(grep -i "error" "$LOGS_DIR/metro-bundler.log" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$ERROR_COUNT" -gt 0 ]; then
        echo "⚠️  Found $ERROR_COUNT errors:"
        grep -i "error" "$LOGS_DIR/metro-bundler.log" 2>/dev/null | tail -5
    else
        echo "✅ No errors in Metro bundler"
    fi
else
    echo "❌ No Metro bundler log found"
fi
echo ""

# Check React Native JS logs
echo "⚛️  REACT NATIVE JS LOGS:"
if [ -f "$LOGS_DIR/react-native-js.log" ]; then
    # Check for errors
    JS_ERRORS=$(grep -i "error\|exception\|crash" "$LOGS_DIR/react-native-js.log" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$JS_ERRORS" -gt 0 ]; then
        echo "⚠️  Found $JS_ERRORS JavaScript errors:"
        grep -i "error\|exception\|crash" "$LOGS_DIR/react-native-js.log" 2>/dev/null | tail -5
    else
        echo "✅ No JavaScript errors"
    fi
    
    # Show recent logs
    echo ""
    echo "Recent activity (last 5 lines):"
    tail -5 "$LOGS_DIR/react-native-js.log" 2>/dev/null || echo "No recent activity"
else
    echo "⚠️  No React Native JS log found"
fi
echo ""

# Check Android logcat
echo "🤖 ANDROID LOGCAT:"
if [ -f "$LOGS_DIR/android-logcat.log" ]; then
    # Check for crashes
    CRASH_COUNT=$(grep -i "crash\|fatal" "$LOGS_DIR/android-logcat.log" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$CRASH_COUNT" -gt 0 ]; then
        echo "⚠️  Found $CRASH_COUNT potential crashes:"
        grep -i "crash\|fatal" "$LOGS_DIR/android-logcat.log" 2>/dev/null | tail -3
    else
        echo "✅ No crashes detected"
    fi
    
    # Check connection status
    if adb devices | grep -q "device$"; then
        echo "✅ Android device connected"
    else
        echo "❌ No Android device connected"
    fi
else
    echo "⚠️  No Android logcat log found"
fi
echo ""

# Summary
echo "================================================"
echo "   SUMMARY"
echo "================================================"
echo "Log files location: $LOGS_DIR/"
echo ""
echo "To view logs in real-time:"
echo "  Metro:        tail -f $LOGS_DIR/metro-bundler.log"
echo "  React Native: tail -f $LOGS_DIR/react-native-js.log"
echo "  Android:      tail -f $LOGS_DIR/android-logcat.log"
echo ""
echo "To search for specific errors:"
echo "  grep -i 'search_term' $LOGS_DIR/*.log"
echo ""
