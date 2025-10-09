# Universal Design System for Mobile & Web

## Overview
This guide establishes a unified design system that allows seamless theme switching between mobile and web platforms while maintaining consistent user experience.

## 🎨 Theme Architecture

### Core Theme Structure
```javascript
// src/styles/themes/base.js
export const baseTheme = {
  // Colors
  colors: {
    primary: '#1976d2',
    secondary: '#dc004e',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: {
      primary: '#000000',
      secondary: '#666666',
      disabled: '#999999'
    },
    error: '#f44336',
    warning: '#ff9800',
    success: '#4caf50',
    info: '#2196f3'
  },
  
  // Typography
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System-Medium',
      bold: 'System-Bold'
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8
    }
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  
  // Layout
  layout: {
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16
    },
    elevation: {
      low: 2,
      medium: 4,
      high: 8
    }
  },
  
  // Platform-specific adjustments
  platform: {
    web: {
      // Web-specific overrides
      maxWidth: '1200px',
      container: {
        padding: 24
      }
    },
    mobile: {
      // Mobile-specific overrides
      statusBarHeight: 44,
      bottomTabHeight: 83
    }
  }
};
```

### Platform-Aware Theme Provider
```javascript
// src/styles/ThemeProvider.js
import React, { createContext, useContext } from 'react';
import { Platform } from 'react-native';
import { baseTheme } from './themes/base';
import { webTheme } from './themes/web';
import { mobileTheme } from './themes/mobile';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children, theme = 'default' }) => {
  const getTheme = () => {
    const platformTheme = Platform.OS === 'web' ? webTheme : mobileTheme;
    return {
      ...baseTheme,
      ...platformTheme,
      // Allow runtime theme switching
      ...(theme === 'dark' ? darkTheme : {}),
      platform: {
        ...baseTheme.platform,
        current: Platform.OS
      }
    };
  };

  return (
    <ThemeContext.Provider value={getTheme()}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## 🏗️ Component Architecture

### 1. Platform-Agnostic Components
Create components that work universally:

```javascript
// src/components/universal/Card/Card.js
import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'src/styles/ThemeProvider';
import { createStyles } from 'src/styles/utils';

export const Card = ({ children, elevation = 'medium', ...props }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={[styles.card, styles[`elevation${elevation}`]]} {...props}>
      {children}
    </View>
  );
};

const createStyles = (theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    // Platform-specific shadows
    ...(theme.platform.current === 'web' ? {
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

### 2. Responsive Layout System
```javascript
// src/styles/responsive.js
import { Platform, Dimensions } from 'react-native';

export const getResponsiveValue = (mobileValue, webValue) => {
  return Platform.OS === 'web' ? webValue : mobileValue;
};

export const useResponsiveDimensions = () => {
  const { width, height } = Dimensions.get('window');
  
  return {
    width,
    height,
    isTablet: width > 768,
    isDesktop: Platform.OS === 'web' && width > 1024,
    isMobile: Platform.OS !== 'web' || width <= 768
  };
};
```

## 📱 Platform-Specific Adaptations

### Navigation Strategy
```javascript
// src/navigation/PlatformNavigator.js
import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const AppNavigator = () => {
  if (Platform.OS === 'web') {
    // Web uses drawer navigation
    return (
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Dashboard" component={DashboardScreen} />
          <Drawer.Screen name="Trading" component={TradingScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
  
  // Mobile uses stack navigation
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Trading" component={TradingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

## 🎛️ State Management Strategy

### Universal State with Platform Hooks
```javascript
// src/hooks/usePlatformState.js
import { Platform } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

export const usePlatformStorage = () => {
  const setItem = async (key, value) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
  };
  
  const getItem = async (key) => {
    if (Platform.OS === 'web') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } else {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
  };
  
  return { setItem, getItem };
};
```

## 🔧 Development Workflow

### 1. Feature Development Cycle
```
1. Design component for mobile first
2. Test on mobile platform
3. Add web-specific adaptations
4. Test on web platform
5. Create theme variants
6. Document platform differences
```

### 2. Theme Switching Implementation
```javascript
// src/contexts/AppContext.js
export const AppProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [platform, setPlatform] = useState(Platform.OS);
  
  const switchTheme = (themeName) => {
    setCurrentTheme(themeName);
    // Persist theme choice
    savePlatformSetting('theme', themeName);
  };
  
  return (
    <AppContext.Provider value={{ currentTheme, switchTheme, platform }}>
      <ThemeProvider theme={currentTheme}>
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
};
```

## 📋 Best Practices Checklist

### ✅ Component Development
- [ ] Use theme variables instead of hardcoded values
- [ ] Implement responsive breakpoints
- [ ] Test on both platforms before committing
- [ ] Document platform-specific behaviors
- [ ] Use Platform.select() for complex platform differences

### ✅ Styling Guidelines
- [ ] Define all styles through theme system
- [ ] Use consistent spacing and typography scales
- [ ] Implement proper elevation/shadow system
- [ ] Support both light and dark themes
- [ ] Ensure accessibility compliance

### ✅ Performance Considerations
- [ ] Lazy load platform-specific components
- [ ] Optimize bundle size for web
- [ ] Use platform-specific optimizations
- [ ] Implement proper caching strategies

## 🎯 Migration Strategy

### Phase 1: Establish Theme System
1. Create base theme structure
2. Implement ThemeProvider
3. Migrate existing styles to theme variables

### Phase 2: Component Unification
1. Identify common components
2. Create universal component library
3. Implement platform-specific adaptations

### Phase 3: Advanced Features
1. Add theme switching capability
2. Implement responsive design system
3. Optimize for each platform

## 🔄 Continuous Integration

### Testing Strategy
```yaml
# .github/workflows/test.yml
- name: Test Mobile
  run: npm run test:mobile
  
- name: Test Web
  run: npm run test:web
  
- name: Test Theme Switching
  run: npm run test:themes
```

This approach ensures your codebase remains maintainable while providing optimal experiences on both platforms.