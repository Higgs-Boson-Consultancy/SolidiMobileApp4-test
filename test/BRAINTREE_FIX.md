# Fix for Braintree iOS 13.0 Deprecation Warning

## Issue
```
'SecTrustEvaluate' is deprecated: first deprecated in iOS 13.0
```

This warning comes from the Braintree SDK (v4.38.0) used by react-native-payments.

## Solutions (Choose One)

### Solution 1: Quick Fix - Suppress Warning in Xcode

Add this to your iOS project build settings:

1. Open Xcode: `ios/SolidiMobileApp4.xcworkspace`
2. Select your project target
3. Go to "Build Settings" 
4. Search for "Other Warning Flags"
5. Add: `-Wno-deprecated-declarations`

### Solution 2: Update Podfile to Use Newer Braintree

Edit `ios/Podfile` and add:

```ruby
# Force newer Braintree version
pod 'Braintree', '~> 5.0'
```

Then run:
```bash
cd ios && pod update Braintree
```

### Solution 3: Alternative Apple Pay Library

Replace `react-native-payments` with a more modern Apple Pay solution:

1. **Remove current library:**
```bash
npm uninstall react-native-payments
cd ios && pod install
```

2. **Install @react-native-apple-pay/apple-pay:**
```bash
npm install @react-native-apple-pay/apple-pay
cd ios && pod install
```

### Solution 4: Use Native iOS Apple Pay (Recommended)

Since you only need Apple Pay, use the native iOS implementation without third-party libraries.

## Immediate Fix (Recommended)

Since this is just a deprecation warning and doesn't affect functionality, the quickest fix is to suppress it:

### Add Warning Suppression to Podfile

```ruby
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['WARNING_CFLAGS'] ||= []
      config.build_settings['WARNING_CFLAGS'] << '-Wno-deprecated-declarations'
    end
  end
end
```

## Implementation

I'll implement Solution 4 (add warning suppression) as it's the safest approach that won't break your current Apple Pay implementation.