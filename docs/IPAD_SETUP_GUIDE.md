# iPad App Setup and Usage Guide

This document explains the iPad-specific features, themes, and best practices for the Solidi mobile app on iPad devices.

## Overview

The app now fully supports iPad devices with:
- ✅ Landscape and portrait orientations
- ✅ iPad-optimized layouts and spacing
- ✅ Larger touch targets and fonts
- ✅ Split-view and multitasking support
- ✅ Responsive grid system
- ✅ Device-specific themes

## Configuration Files

### 1. Info.plist Updates
**Location:** `ios/SolidiMobileApp4/Info.plist`

```xml
<key>UIRequiresFullScreen</key>
<false/>
<key>UISupportedInterfaceOrientations~ipad</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationPortraitUpsideDown</string>
    <string>UIInterfaceOrientationLandscapeLeft</string>
    <string>UIInterfaceOrientationLandscapeRight</string>
</array>
```

### 2. iPad Theme
**Location:** `src/styles/iPadTheme.js`

Provides iPad-specific styling with:
- Larger spacing (1.3-1.5x multiplier)
- Larger fonts (1.15x multiplier)
- Optimized touch targets (48-56px)
- Layout configurations for portrait/landscape

### 3. iPad Configuration
**Location:** `src/util/iPadConfig.js`

Utilities for:
- Device detection
- Layout modes (portrait/landscape/split)
- Grid calculations
- Modal sizing
- Multitasking support

### 4. Updated Dimensions
**Location:** `src/util/dimensions.js`

Enhanced with:
- iPad detection: `isIPad()` and `deviceIsIPad`
- iPad-specific base dimensions (834x1194)
- Controlled scaling (max 1.5x)
- Device-appropriate padding/margins

## Usage Examples

### 1. Detect iPad Device

```javascript
import { deviceIsIPad } from 'src/util/dimensions';
import { isIPad } from 'src/styles/iPadTheme';

// Simple check
if (deviceIsIPad) {
  // iPad-specific code
}
```

### 2. Use iPad Theme

```javascript
import { useDeviceTheme } from 'src/styles/iPadTheme';

const MyComponent = () => {
  const theme = useDeviceTheme();
  
  return (
    <View style={{ padding: theme.spacing.md }}>
      <Text style={{ fontSize: theme.typography.fontSize.md }}>
        Hello iPad!
      </Text>
    </View>
  );
};
```

### 3. Responsive Styling

```javascript
import { getResponsiveStyle } from 'src/styles/iPadTheme';
import { iPadStyleHelpers } from 'src/util/iPadConfig';

const MyComponent = () => {
  return (
    <View style={getResponsiveStyle(
      { padding: 16 },  // Phone style
      { padding: 24 }   // iPad style
    )}>
      <TextInput style={iPadStyleHelpers.input()} />
      <Button style={iPadStyleHelpers.button()} />
    </View>
  );
};
```

### 4. Responsive Grid Layout

```javascript
import { getIPadGridColumns, iPadStyleHelpers } from 'src/util/iPadConfig';

const MyGridComponent = () => {
  const columns = getIPadGridColumns(300); // min card width 300px
  
  return (
    <View style={iPadStyleHelpers.grid(columns)}>
      {items.map(item => (
        <View key={item.id} style={iPadStyleHelpers.gridItem(columns)}>
          {/* Card content */}
        </View>
      ))}
    </View>
  );
};
```

### 5. Layout Mode Detection

```javascript
import { getIPadLayoutMode, shouldUseSplitView } from 'src/util/iPadConfig';

const MyComponent = () => {
  const layoutMode = getIPadLayoutMode();
  const useSplitView = shouldUseSplitView();
  
  if (useSplitView) {
    // Render split layout (sidebar + content)
    return <SplitLayout />;
  }
  
  if (layoutMode === 'landscape') {
    // Render landscape-optimized layout
    return <LandscapeLayout />;
  }
  
  // Default layout
  return <StandardLayout />;
};
```

### 6. Modal Sizing

```javascript
import { getIPadModalSize } from 'src/util/iPadConfig';

const MyModal = () => {
  const modalSize = getIPadModalSize('medium'); // 'small', 'medium', 'large'
  
  return (
    <Modal visible={visible}>
      <View style={{ width: modalSize.width, height: modalSize.height }}>
        {/* Modal content */}
      </View>
    </Modal>
  );
};
```

### 7. Multitasking Support

```javascript
import { getIPadMultitaskingMode, shouldAdaptForMultitasking } from 'src/util/iPadConfig';

const MyComponent = () => {
  const mode = getIPadMultitaskingMode(); // 'fullscreen', 'splitview', 'slideover'
  const shouldAdapt = shouldAdaptForMultitasking();
  
  if (shouldAdapt) {
    // Render compact layout for split view
    return <CompactLayout />;
  }
  
  return <FullLayout />;
};
```

### 8. Device-Specific Padding

```javascript
import { getDevicePadding, getDeviceMargin } from 'src/util/dimensions';
import { getIPadPadding } from 'src/util/iPadConfig';

const MyComponent = () => {
  const padding = getDevicePadding(16);  // 16 on phone, 24 on iPad
  const margin = getDeviceMargin(16);    // 16 on phone, 24 on iPad
  
  // Or get comprehensive padding
  const iPadPadding = getIPadPadding(16);
  // Returns: { horizontal, vertical, card, modal }
  
  return (
    <View style={{ padding, margin }}>
      {/* Content */}
    </View>
  );
};
```

### 9. Normalized Fonts

```javascript
import { normaliseFont, getDeviceFontSize } from 'src/util/dimensions';

const styles = StyleSheet.create({
  text: {
    fontSize: normaliseFont(16), // Automatically scales for iPad
  },
  heading: {
    fontSize: getDeviceFontSize(24), // 24 on phone, ~27.6 on iPad
  },
});
```

### 10. Container with Max Width

```javascript
import { iPadStyleHelpers } from 'src/util/iPadConfig';

const MyComponent = () => {
  return (
    <View style={iPadStyleHelpers.container(700)}>
      {/* Content will be centered with max-width on iPad */}
    </View>
  );
};
```

## Orientation Handling

### Listen to Orientation Changes

```javascript
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const MyComponent = () => {
  const [orientation, setOrientation] = useState('portrait');
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    });
    
    return () => subscription?.remove();
  }, []);
  
  return (
    <View>
      <Text>Current orientation: {orientation}</Text>
    </View>
  );
};
```

### Orientation-Specific Styles

```javascript
import { createOrientationStyles } from 'src/styles/iPadTheme';

const MyComponent = () => {
  const styles = createOrientationStyles(
    { flexDirection: 'column' },  // Portrait
    { flexDirection: 'row' }      // Landscape
  );
  
  return <View style={styles}>{/* Content */}</View>;
};
```

## Best Practices

### 1. Touch Targets
- Use minimum 44pt touch targets (Apple HIG)
- On iPad, prefer 48-56pt for comfort
- Add sufficient spacing between interactive elements

```javascript
const styles = StyleSheet.create({
  button: {
    minHeight: deviceIsIPad ? 52 : 44,
    minWidth: deviceIsIPad ? 52 : 44,
  },
});
```

### 2. Content Width
- Limit content width on large screens for readability
- Recommended max: 700-800px for text-heavy content

```javascript
<View style={iPadStyleHelpers.container(700)}>
  <Text>Long form content...</Text>
</View>
```

### 3. Grid Layouts
- Use responsive grids that adapt to orientation
- 2 columns portrait, 3 columns landscape typically

```javascript
const columns = getIPadGridColumns(300);
// Automatically adjusts based on screen size and orientation
```

### 4. Typography
- Use normalized fonts for consistent scaling
- iPad gets 1.15x larger fonts automatically

```javascript
fontSize: normaliseFont(16) // Scales appropriately for iPad
```

### 5. Spacing
- Use device-aware spacing functions
- iPad gets 1.5x spacing by default

```javascript
padding: getDevicePadding(16) // 16 on phone, 24 on iPad
```

## Testing on iPad

### Simulators
Test on these iPad simulators:
- iPad Pro 11"
- iPad Pro 12.9"
- iPad Air
- iPad (9th/10th gen)

### Orientations
Test all orientations:
- ✅ Portrait
- ✅ Landscape Left
- ✅ Landscape Right
- ✅ Upside Down

### Multitasking
Test multitasking modes:
- ✅ Fullscreen
- ✅ Split View (1/2 and 2/3)
- ✅ Slide Over

### Build for iPad

```bash
# Debug build for iPad simulator
npx react-native run-ios --simulator="iPad Pro (11-inch)"

# Debug build for connected iPad
npx react-native run-ios --device

# Production build
cd ios
xcodebuild -workspace SolidiMobileApp4.xcworkspace \
  -scheme SolidiMobileApp4 \
  -configuration Release \
  -destination generic/platform=iOS \
  archive
```

## Common iPad Layout Patterns

### 1. Master-Detail (Split View)

```javascript
const MasterDetail = () => {
  const useSplit = shouldUseSplitView();
  
  if (useSplit) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: 280 }}>{/* Master */}</View>
        <View style={{ flex: 1 }}>{/* Detail */}</View>
      </View>
    );
  }
  
  return <SingleColumnLayout />;
};
```

### 2. Grid Dashboard

```javascript
const Dashboard = () => {
  const columns = getIPadGridColumns(300);
  
  return (
    <ScrollView>
      <View style={iPadStyleHelpers.grid(columns)}>
        {cards.map(card => (
          <View key={card.id} style={iPadStyleHelpers.gridItem(columns)}>
            <Card {...card} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
```

### 3. Centered Form

```javascript
const FormScreen = () => {
  return (
    <ScrollView>
      <View style={iPadStyleHelpers.container(600)}>
        <TextInput style={iPadStyleHelpers.input()} />
        <Button style={iPadStyleHelpers.button()} />
      </View>
    </ScrollView>
  );
};
```

## Troubleshooting

### Issue: Layout looks too cramped on iPad
**Solution:** Check if you're using device-aware spacing:
```javascript
import { getDevicePadding } from 'src/util/dimensions';
padding: getDevicePadding(16)
```

### Issue: Text is too small on iPad
**Solution:** Use normalizeFont for automatic scaling:
```javascript
import { normaliseFont } from 'src/util/dimensions';
fontSize: normaliseFont(16)
```

### Issue: Buttons too small for touch
**Solution:** Use iPad-optimized button styles:
```javascript
import { iPadStyleHelpers } from 'src/util/iPadConfig';
<Button style={iPadStyleHelpers.button()} />
```

### Issue: Modal takes full screen on iPad
**Solution:** Use getIPadModalSize:
```javascript
const modalSize = getIPadModalSize('medium');
<Modal><View style={{ width: modalSize.width }}></View></Modal>
```

## Resources

- [Apple Human Interface Guidelines - iPad](https://developer.apple.com/design/human-interface-guidelines/ipad)
- [React Native iPad Support](https://reactnative.dev/docs/running-on-device)
- [iOS Safe Area](https://developer.apple.com/design/human-interface-guidelines/layout)

## Summary

The app is now fully iPad-ready with:
- ✅ Automatic device detection
- ✅ Responsive layouts
- ✅ iPad-optimized spacing and typography
- ✅ Orientation support
- ✅ Multitasking support
- ✅ Easy-to-use utilities and helpers

Use the provided utilities and style helpers throughout your components to ensure consistent, iPad-optimized layouts!
