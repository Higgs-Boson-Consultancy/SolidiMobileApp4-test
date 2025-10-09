// Universal Theme Hooks and Utilities
// Provides easy-to-use hooks for working with the theme system

import React, { useMemo } from 'react';
import { Platform, Dimensions } from 'react-native';
import { useTheme } from './ThemeProvider';

// Hook for creating theme-aware styles
export const useThemedStyles = (createStylesFunction) => {
  const { theme, isWeb, currentPlatform, isDarkMode } = useTheme();
  
  return useMemo(() => {
    return createStylesFunction({ 
      theme, 
      isWeb, 
      platform: currentPlatform, 
      isDark: isDarkMode 
    });
  }, [theme, isWeb, currentPlatform, isDarkMode, createStylesFunction]);
};

// Hook for responsive values based on platform
export const useResponsiveValue = (mobileValue, webValue) => {
  const { isWeb } = useTheme();
  return isWeb ? webValue : mobileValue;
};

// Hook for getting current dimensions and breakpoints
export const useResponsiveDimensions = () => {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');
  
  return useMemo(() => ({
    width,
    height,
    isTablet: width >= theme.breakpoints?.tablet || width >= 768,
    isDesktop: Platform.OS === 'web' && (width >= theme.breakpoints?.desktop || width >= 1024),
    isMobile: Platform.OS !== 'web' || width < (theme.breakpoints?.tablet || 768),
    isLandscape: width > height
  }), [width, height, theme.breakpoints]);
};

// Hook for platform-specific values
export const usePlatformValue = (values) => {
  const { currentPlatform } = useTheme();
  
  return useMemo(() => {
    if (values[currentPlatform]) {
      return values[currentPlatform];
    }
    return values.default || values.mobile || Object.values(values)[0];
  }, [values, currentPlatform]);
};

// Hook for theme colors with easy access
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

// Hook for theme spacing with easy access
export const useThemeSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

// Hook for theme typography with easy access
export const useThemeTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

// Higher-order component for theme consumption
export const withTheme = (Component) => {
  return React.forwardRef((props, ref) => {
    const themeProps = useTheme();
    return <Component {...props} ref={ref} theme={themeProps} />;
  });
};

// Utility function to create platform-aware styles
export const createUniversalStyles = (styleObject, theme) => {
  const { platform } = theme;
  
  const processStyle = (style) => {
    if (typeof style === 'function') {
      return style(theme);
    }
    
    if (style && typeof style === 'object') {
      const processedStyle = {};
      
      Object.keys(style).forEach(key => {
        if (key.startsWith('web:') && platform.isWeb) {
          const webKey = key.replace('web:', '');
          processedStyle[webKey] = style[key];
        } else if (key.startsWith('mobile:') && platform.isMobile) {
          const mobileKey = key.replace('mobile:', '');
          processedStyle[mobileKey] = style[key];
        } else if (!key.includes(':')) {
          processedStyle[key] = processStyle(style[key]);
        }
      });
      
      return processedStyle;
    }
    
    return style;
  };
  
  return processStyle(styleObject);
};

// Utility for getting elevation styles
export const getElevationStyle = (elevation, theme) => {
  if (Platform.OS === 'web') {
    const shadowIntensity = elevation * 2;
    return {
      boxShadow: `0 ${elevation}px ${shadowIntensity}px rgba(0, 0, 0, 0.1)`,
    };
  } else if (Platform.OS === 'ios') {
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.1,
      shadowRadius: elevation,
    };
  } else {
    return {
      elevation: elevation,
    };
  }
};

// Utility for creating responsive containers
export const getContainerStyle = (theme, maxWidth = true) => {
  const baseStyle = {
    flex: 1,
    padding: theme.spacing.md,
  };
  
  if (Platform.OS === 'web') {
    return {
      ...baseStyle,
      maxWidth: maxWidth ? (theme.layout?.maxWidth || '1200px') : '100%',
      margin: '0 auto',
      minHeight: '100vh',
      padding: theme.spacing.lg,
    };
  }
  
  return baseStyle;
};

// Utility for creating theme-aware button styles
export const getButtonStyle = (variant, theme) => {
  const baseStyle = {
    borderRadius: theme.layout.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: theme.layout.borderWidth.thin,
      borderColor: theme.colors.primary,
    },
    text: {
      backgroundColor: 'transparent',
    },
  };
  
  const webEnhancements = Platform.OS === 'web' ? {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none',
    outline: 'none',
  } : {};
  
  return {
    ...baseStyle,
    ...variants[variant],
    ...webEnhancements,
  };
};

// Utility for creating theme-aware text styles
export const getTextStyle = (variant, theme) => {
  const variants = {
    h1: {
      fontSize: theme.typography.fontSize.xxxl,
      fontWeight: theme.typography.fontWeight.bold,
      lineHeight: theme.typography.lineHeight.tight,
    },
    h2: {
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: theme.typography.fontWeight.bold,
      lineHeight: theme.typography.lineHeight.tight,
    },
    h3: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.normal,
    },
    body: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.normal,
      lineHeight: theme.typography.lineHeight.normal,
    },
    caption: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.normal,
      lineHeight: theme.typography.lineHeight.normal,
    },
  };
  
  return {
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.regular,
    ...variants[variant],
  };
};

export default {
  useThemedStyles,
  useResponsiveValue,
  useResponsiveDimensions,
  usePlatformValue,
  useThemeColors,
  useThemeSpacing,
  useThemeTypography,
  withTheme,
  createUniversalStyles,
  getElevationStyle,
  getContainerStyle,
  getButtonStyle,
  getTextStyle,
};