# Universal Theme & Component System - Complete Guide

## 🎯 Overview
This guide explains how to use the universal theme system that makes your React Native app compatible with both mobile and web platforms through a single codebase.

## 🚀 Quick Start

### 1. Basic Theme Usage
```javascript
import React from 'react';
import { View, Text } from 'react-native';
import { useThemedStyles, useTheme } from 'src/styles/themeHooks';

const MyComponent = () => {
  const { colors, spacing } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theme-Aware Component</Text>
    </View>
  );
};

const createStyles = ({ theme, isWeb, platform }) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    // Platform-specific optimizations
    ...(isWeb && {
      maxWidth: 600,
      margin: '0 auto'
    })
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium
  }
});
```

### 2. Using Universal Components
```javascript
import React from 'react';
import { 
  UniversalContainer, 
  UniversalText, 
  UniversalButton, 
  UniversalCard 
} from 'src/components/universal/UniversalComponents';

const MyScreen = () => {
  return (
    <UniversalContainer>
      <UniversalCard elevation="medium">
        <UniversalText variant="h2">Welcome</UniversalText>
        <UniversalText variant="body">
          This component automatically adapts to mobile and web!
        </UniversalText>
        <UniversalButton
          title="Get Started"
          variant="primary"
          onPress={() => console.log('Button pressed')}
        />
      </UniversalCard>
    </UniversalContainer>
  );
};
```

## 🎨 Theme System Structure

### Design Tokens
- **Colors**: Primary, secondary, background, text, status colors
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl, xxl, xxxl)
- **Layout**: Border radius, elevation, border widths
- **Breakpoints**: Responsive design breakpoints

### Available Hooks
- `useTheme()` - Access complete theme object
- `useThemedStyles(fn)` - Create platform-aware styles
- `useResponsiveValue(mobile, web)` - Platform-specific values
- `useThemeColors()` - Quick access to colors
- `useThemeSpacing()` - Quick access to spacing
- `useThemeTypography()` - Quick access to typography

## 📱 Mobile vs Web Adaptations

### Automatic Platform Optimizations
The theme system automatically provides:

#### Mobile:
- Touch-friendly tap targets (44px minimum)
- Native shadow/elevation styles
- Mobile-optimized font sizes
- Platform-appropriate fonts (San Francisco on iOS, Roboto on Android)

#### Web:
- Hover states and transitions
- Larger font sizes for readability
- CSS box-shadows instead of React Native shadows
- Mouse cursor changes
- Keyboard navigation support
- Responsive container max-widths

### Platform-Specific Styling
```javascript
const createStyles = ({ theme, isWeb, platform }) => ({
  button: {
    // Base styles for all platforms
    padding: theme.spacing.md,
    borderRadius: theme.layout.borderRadius.md,
    
    // Web-specific enhancements
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        opacity: 0.9
      }
    }),
    
    // Mobile-specific optimizations
    ...(platform !== 'web' && {
      minHeight: 44, // Touch target size
    })
  }
});
```

## 🎛️ Theme Switching

### Light/Dark Mode
```javascript
const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <UniversalButton
      title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
      onPress={toggleTheme}
    />
  );
};
```

### Custom Themes
```javascript
// Create custom theme variants
const customTheme = {
  colors: {
    primary: '#your-brand-color',
    // ... other customizations
  }
};

// Apply in ThemeProvider
<ThemeProvider customTheme={customTheme}>
  <App />
</ThemeProvider>
```

## 🔄 Migration Guide

### Step 1: Replace Hardcoded Styles
```javascript
// BEFORE ❌
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
  }
});

// AFTER ✅
const styles = useThemedStyles(({ theme }) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  }
}));
```

### Step 2: Use Universal Components
```javascript
// BEFORE ❌
<View style={styles.card}>
  <Text style={styles.title}>Title</Text>
  <TouchableOpacity style={styles.button}>
    <Text>Button</Text>
  </TouchableOpacity>
</View>

// AFTER ✅
<UniversalCard>
  <UniversalText variant="h3">Title</UniversalText>
  <UniversalButton title="Button" onPress={handlePress} />
</UniversalCard>
```

### Step 3: Add Platform Optimizations
```javascript
const createStyles = ({ theme, isWeb }) => ({
  container: {
    // Base mobile styles
    flex: 1,
    padding: theme.spacing.md,
    
    // Web optimizations
    ...(isWeb && {
      maxWidth: 800,
      margin: '0 auto',
      minHeight: '100vh'
    })
  }
});
```

## 📐 Responsive Design

### Breakpoint Usage
```javascript
const MyComponent = () => {
  const { width } = useResponsiveDimensions();
  const columns = width > 768 ? 3 : 1;
  
  return (
    <View style={{ flexDirection: columns > 1 ? 'row' : 'column' }}>
      {/* Content adapts to screen size */}
    </View>
  );
};
```

### Platform-Specific Values
```javascript
const containerWidth = useResponsiveValue('100%', '600px');
const fontSize = usePlatformValue({
  ios: 16,
  android: 14,
  web: 18,
  default: 16
});
```

## 🛠️ Best Practices

### 1. Always Use Theme Variables
```javascript
// ❌ DON'T
backgroundColor: '#ffffff'
fontSize: 16
padding: 20

// ✅ DO
backgroundColor: theme.colors.background
fontSize: theme.typography.fontSize.md
padding: theme.spacing.lg
```

### 2. Create Reusable Style Functions
```javascript
// Create utility functions for common patterns
const createCardStyle = (theme, elevation = 'medium') => ({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.layout.borderRadius.lg,
  padding: theme.spacing.lg,
  ...getElevationStyle(elevation, theme)
});
```

### 3. Test on Both Platforms
Always test your components on both mobile and web to ensure they work correctly across platforms.

### 4. Use Semantic Color Names
```javascript
// ❌ DON'T
color: theme.colors.primary

// ✅ DO (when appropriate)
color: theme.colors.text.primary
backgroundColor: theme.colors.surface
```

## 🎯 Common Patterns

### Form Components
```javascript
const LoginForm = () => {
  const styles = useThemedStyles(createLoginStyles);
  
  return (
    <UniversalContainer>
      <UniversalCard>
        <UniversalText variant="h2">Sign In</UniversalText>
        <UniversalInput
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
        />
        <UniversalInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
        />
        <UniversalButton
          title="Sign In"
          variant="primary"
          fullWidth
        />
      </UniversalCard>
    </UniversalContainer>
  );
};
```

### List Components
```javascript
const ItemList = ({ items }) => {
  const styles = useThemedStyles(({ theme }) => ({
    item: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderRadius: theme.layout.borderRadius.md,
    }
  }));
  
  return (
    <UniversalContainer>
      {items.map((item, index) => (
        <UniversalCard key={index} onPress={() => handleItemPress(item)}>
          <UniversalText variant="h3">{item.title}</UniversalText>
          <UniversalText variant="body" color="secondary">
            {item.description}
          </UniversalText>
        </UniversalCard>
      ))}
    </UniversalContainer>
  );
};
```

## 🚀 Next Steps

1. **Start with new components**: Use the universal theme system for all new components
2. **Gradually migrate existing components**: Convert existing components during updates
3. **Test theme switching**: Ensure all components work in both light and dark modes
4. **Optimize for web**: Add web-specific enhancements like hover states
5. **Create custom themes**: Develop brand-specific color schemes

## 🎉 Benefits

Once fully implemented, you'll have:
- ✅ Single codebase for mobile and web
- ✅ Automatic light/dark theme support
- ✅ Consistent design language
- ✅ Platform-optimized user experience
- ✅ Easy maintenance and updates
- ✅ Professional, polished appearance

The universal theme system ensures your app looks and feels native on every platform while maintaining design consistency!