#!/bin/bash

# SolidiMobileApp4 - Run on Physical Device Script
# This script builds and deploys the app to your physical iPhone

echo "🚀 Building SolidiMobileApp4 for Physical iPhone Device..."
echo "📱 Detected Device: iPhone (18.6.2)"
echo "🔧 Device ID: 00008030-000669240A91402E"

# Kill any existing Metro processes
echo "🧹 Cleaning up existing processes..."
lsof -ti:8081 | xargs kill -9 2>/dev/null

# Start Metro bundler
echo "📦 Starting Metro bundler..."
npx react-native start --reset-cache &
METRO_PID=$!

# Wait for Metro to start
echo "⏳ Waiting for Metro to initialize..."
sleep 5

# Build and run on device
echo "🔨 Building and deploying to device..."
npx react-native run-ios --device "iPhone"

# Keep Metro running
echo "✅ App deployed! Metro bundler is running..."
echo "💡 To stop Metro bundler, press Ctrl+C"
wait $METRO_PID