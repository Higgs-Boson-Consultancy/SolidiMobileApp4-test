// Universal Theme System for Solidi App
// This provides platform-aware theming that works for both mobile and web

import { Platform } from 'react-native';

// Base theme that works across all platforms
export const baseTheme = {
  colors: {
    // Primary brand colors
    primary: '#1976d2',
    primaryLight: '#42a5f5',
    primaryDark: '#1565c0',
    
    // Secondary colors
    secondary: '#dc004e',
    secondaryLight: '#f48fb1',
    secondaryDark: '#ad1457',
    
    // Backgrounds
    background: '#ffffff',
    backgroundSecondary: '#f5f5f5',
    surface: '#ffffff',
    surfaceSecondary: '#fafafa',
    
    // Text colors
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#bdbdbd',
      onPrimary: '#ffffff',
      onSecondary: '#ffffff'
    },
    
    // Status colors
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    
    // Crypto-specific colors
    crypto: {
      bitcoin: '#f7931a',
      ethereum: '#627eea',
      profit: '#4caf50',
      loss: '#f44336'
    },
    
    // Chart colors
    chart: {
      line: '#1976d2',
      area: 'rgba(25, 118, 210, 0.1)',
      grid: '#e0e0e0',
      axis: '#757575'
    }
  },
  
  typography: {
    fontFamily: {
      regular: Platform.select({
        ios: 'System',
        android: 'Roboto',
        web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }),
      medium: Platform.select({
        ios: 'System-Medium',
        android: 'Roboto-Medium',
        web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }),
      bold: Platform.select({
        ios: 'System-Bold',
        android: 'Roboto-Bold',
        web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      })
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8
    }
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64
  },
  
  layout: {
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      pill: 9999
    },
    borderWidth: {
      thin: 1,
      medium: 2,
      thick: 3
    },
    elevation: {
      none: 0,
      low: 2,
      medium: 4,
      high: 8,
      highest: 16
    }
  },
  
  // Platform-specific configurations
  platform: {
    web: {
      maxWidth: '1200px',
      containerPadding: 24,
      navigationHeight: 64,
      sidebarWidth: 280,
      breakpoints: {
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200
      }
    },
    mobile: {
      statusBarHeight: Platform.select({ ios: 44, android: 24 }),
      navigationHeight: 56,
      tabBarHeight: Platform.select({ ios: 83, android: 56 }),
      safeAreaInsets: {
        top: Platform.select({ ios: 44, android: 0 }),
        bottom: Platform.select({ ios: 34, android: 0 })
      }
    }
  }
};

// Dark theme variant
export const darkTheme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    background: '#121212',
    backgroundSecondary: '#1e1e1e',
    surface: '#1e1e1e',
    surfaceSecondary: '#2d2d2d',
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      disabled: '#666666',
      onPrimary: '#ffffff',
      onSecondary: '#000000'
    },
    chart: {
      ...baseTheme.colors.chart,
      grid: '#333333',
      axis: '#666666'
    }
  }
};

// Web-specific theme adjustments
export const webThemeAdjustments = {
  typography: {
    fontSize: {
      // Slightly larger fonts for web
      xs: 13,
      sm: 15,
      md: 17,
      lg: 19,
      xl: 22,
      xxl: 26,
      xxxl: 30
    }
  },
  spacing: {
    // More generous spacing for web
    xs: 6,
    sm: 12,
    md: 20,
    lg: 28,
    xl: 36,
    xxl: 52,
    xxxl: 68
  }
};

// Function to get platform-aware theme
export const getPlatformTheme = (isDark = false, isWeb = Platform.OS === 'web') => {
  const baseThemeToUse = isDark ? darkTheme : baseTheme;
  
  if (isWeb) {
    return {
      ...baseThemeToUse,
      typography: {
        ...baseThemeToUse.typography,
        ...webThemeAdjustments.typography
      },
      spacing: {
        ...baseThemeToUse.spacing,
        ...webThemeAdjustments.spacing
      }
    };
  }
  
  return baseThemeToUse;
};

// Utility functions for responsive design
export const getResponsiveValue = (theme, mobileValue, webValue) => {
  return Platform.OS === 'web' ? webValue : mobileValue;
};

export const createPlatformStyles = (theme) => ({
  // Common shadow/elevation styles
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }
  }),
  
  // Platform-specific container styles
  container: Platform.select({
    web: {
      maxWidth: theme.platform.web.maxWidth,
      margin: '0 auto',
      padding: theme.platform.web.containerPadding
    },
    default: {
      flex: 1,
      padding: theme.spacing.md
    }
  }),
  
  // Navigation styles
  navigation: Platform.select({
    web: {
      height: theme.platform.web.navigationHeight,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg
    },
    default: {
      height: theme.platform.mobile.navigationHeight,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md
    }
  })
});

export default baseTheme;