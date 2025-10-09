# Migration Guide: Converting Components to Universal Theme System

## 🎯 Overview
This guide shows you how to convert your existing React Native components to use the universal theme system, making them compatible with both mobile and web platforms.

## 📋 Before and After Comparison

### ❌ OLD WAY (Hardcoded Styles)
```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OldComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',  // ❌ Hardcoded
    padding: 16,                 // ❌ Hardcoded
  },
  title: {
    fontSize: 24,                // ❌ Hardcoded
    color: '#000000',           // ❌ Hardcoded
    fontWeight: 'bold',         // ❌ Hardcoded
  }
});
```

### ✅ NEW WAY (Theme-Aware)
```javascript
import React from 'react';
import { View, Text } from 'react-native';
import { useThemedStyles, useTheme } from 'src/styles/ThemeProvider';

const NewComponent = () => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
    </View>
  );
};

const createStyles = ({ theme, isWeb, platform }) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,  // ✅ Theme-aware
    padding: theme.spacing.md,                 // ✅ Theme-aware
    
    // ✅ Platform-specific optimizations
    ...(isWeb && {
      maxWidth: 600,
      margin: '0 auto'
    })
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,   // ✅ Theme-aware
    color: theme.colors.text.primary,         // ✅ Theme-aware
    fontWeight: theme.typography.fontWeight.bold, // ✅ Theme-aware
    fontFamily: theme.typography.fontFamily.bold,  // ✅ Platform fonts
  }
});
```

## 🔄 Step-by-Step Migration Process

### Step 1: Import Theme Hooks
```javascript
// Add these imports to your component
import { useThemedStyles, useTheme } from 'src/styles/ThemeProvider';
```

### Step 2: Replace StyleSheet with Theme Function
```javascript
// BEFORE:
const styles = StyleSheet.create({
  // styles here
});

// AFTER:
const styles = useThemedStyles(createStyles);

const createStyles = ({ theme, isWeb, platform }) => ({
  // theme-aware styles here
});
```

### Step 3: Replace Hardcoded Values with Theme Variables
```javascript
// Color Replacements:
'#ffffff' → theme.colors.background
'#000000' → theme.colors.text.primary
'#666666' → theme.colors.text.secondary
'#1976d2' → theme.colors.primary
'#f44336' → theme.colors.error

// Spacing Replacements:
4 → theme.spacing.xs
8 → theme.spacing.sm
16 → theme.spacing.md
24 → theme.spacing.lg
32 → theme.spacing.xl

// Typography Replacements:
12 → theme.typography.fontSize.xs
14 → theme.typography.fontSize.sm
16 → theme.typography.fontSize.md
18 → theme.typography.fontSize.lg
24 → theme.typography.fontSize.xxl

'bold' → theme.typography.fontWeight.bold
'normal' → theme.typography.fontWeight.normal
```

### Step 4: Add Platform-Specific Optimizations
```javascript
const createStyles = ({ theme, isWeb, platform }) => ({
  container: {
    // Base styles for all platforms
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    
    // Web-specific styles
    ...(isWeb && {
      maxWidth: 800,
      margin: '0 auto',
      minHeight: '100vh'
    }),
    
    // Platform-specific shadows
    ...(platform === 'web' ? {
      boxShadow: `0 2px 8px rgba(0,0,0,0.1)`
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    })
  }
});
```

## 🎨 Common Theme Patterns

### Buttons
```javascript
const createButtonStyles = ({ theme, isWeb }) => ({
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.layout.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    
    // Web enhancements
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        opacity: 0.9
      }
    })
  },
  buttonText: {
    color: theme.colors.text.onPrimary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium
  }
});
```

### Cards
```javascript
const createCardStyles = ({ theme, platform }) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.borderRadius.lg,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
    
    // Platform-specific shadows
    ...(platform === 'web' ? {
      boxShadow: `0 ${theme.layout.elevation.medium}px ${theme.layout.elevation.medium * 2}px rgba(0,0,0,0.1)`
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: theme.layout.elevation.medium },
      shadowOpacity: 0.1,
      shadowRadius: theme.layout.elevation.medium,
      elevation: theme.layout.elevation.medium
    })
  }
});
```

### Forms
```javascript
const createFormStyles = ({ theme, isWeb }) => ({
  input: {
    borderWidth: theme.layout.borderWidth.thin,
    borderColor: theme.colors.text.disabled,
    borderRadius: theme.layout.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.regular,
    
    // Web-specific focus states
    ...(isWeb && {
      outline: 'none',
      '&:focus': {
        borderColor: theme.colors.primary
      }
    })
  }
});
```

## 🚀 Migration Priority

### High Priority (Week 1):
1. **App.js** - Main app wrapper ✅ (Already done)
2. **Login/Register** - Authentication flows
3. **MainPanel** - Core layout component
4. **Navigation** - Menu and routing

### Medium Priority (Week 2):
1. **Dashboard** - Main trading interface
2. **CryptoContent** - Trading components
3. **Settings** - Configuration screens
4. **Forms** - Input components

### Low Priority (Week 3):
1. **History** - Transaction lists
2. **Notifications** - Alert components
3. **Help/Support** - Static content
4. **Error pages** - Error handling

## 🎯 Testing Your Migration

### 1. Theme Switching Test
```javascript
// Add this to any component to test theme switching
const { isDarkMode, toggleTheme } = useTheme();

return (
  <TouchableOpacity onPress={toggleTheme}>
    <Text>Switch to {isDarkMode ? 'Light' : 'Dark'} Mode</Text>
  </TouchableOpacity>
);
```

### 2. Platform Test
```javascript
// Test platform-specific features
const { isWeb, platform } = useTheme();

return (
  <View>
    <Text>Platform: {platform}</Text>
    <Text>Is Web: {isWeb ? 'Yes' : 'No'}</Text>
  </View>
);
```

### 3. Responsive Test
```javascript
// Test responsive behavior
const containerWidth = useResponsiveValue('100%', '600px');

return (
  <View style={{ width: containerWidth }}>
    <Text>Responsive Container</Text>
  </View>
);
```

## 📋 Migration Checklist

For each component you migrate:

- [ ] Import theme hooks
- [ ] Replace StyleSheet.create with useThemedStyles
- [ ] Replace hardcoded colors with theme.colors.*
- [ ] Replace hardcoded spacing with theme.spacing.*
- [ ] Replace hardcoded fonts with theme.typography.*
- [ ] Add platform-specific optimizations
- [ ] Test on both mobile and web
- [ ] Test theme switching (light/dark)
- [ ] Verify responsive behavior

## 🎉 Benefits After Migration

Once migrated, your components will:

1. ✅ **Work on both mobile and web** automatically
2. ✅ **Support light/dark themes** out of the box
3. ✅ **Adapt to different screen sizes** responsively
4. ✅ **Use consistent design tokens** across the app
5. ✅ **Enable easy rebranding** through theme changes
6. ✅ **Provide platform-optimized UX** automatically

## 🔧 Quick Migration Script

Use this pattern for quick conversion:

```bash
# Find components with hardcoded styles
grep -r "backgroundColor.*#" src/components/
grep -r "color.*#" src/components/
grep -r "fontSize.*[0-9]" src/components/

# Replace common patterns
sed -i 's/#ffffff/theme.colors.background/g' Component.js
sed -i 's/#000000/theme.colors.text.primary/g' Component.js
sed -i 's/fontSize: 16/fontSize: theme.typography.fontSize.md/g' Component.js
```

Start with the ThemeDemo component we created to see the system in action!