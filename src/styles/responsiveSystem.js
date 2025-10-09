// Responsive Design System
// src/styles/responsiveSystem.js

import { Dimensions, Platform } from 'react-native';
import { useState, useEffect } from 'react';

// Breakpoints for responsive design
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

// Container max-widths for different breakpoints
export const containerMaxWidths = {
  sm: 540,
  md: 720,
  lg: 960,
  xl: 1140,
  xxl: 1320,
};

// Grid system configuration
export const gridConfig = {
  columns: 12,
  gutterWidth: 16,
  marginWidth: 16,
};

/**
 * Hook to get current screen dimensions and breakpoint
 */
export const useResponsiveScreen = () => {
  const [screenData, setScreenData] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return {
      width,
      height,
      breakpoint: getCurrentBreakpoint(width),
      isWeb: Platform.OS === 'web',
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData({
        width: window.width,
        height: window.height,
        breakpoint: getCurrentBreakpoint(window.width),
        isWeb: Platform.OS === 'web',
      });
    });

    return () => subscription?.remove();
  }, []);

  return screenData;
};

/**
 * Get current breakpoint based on width
 */
export const getCurrentBreakpoint = (width) => {
  if (width >= breakpoints.xxl) return 'xxl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
};

/**
 * Check if current screen is at or above a breakpoint
 */
export const useBreakpointUp = (breakpoint) => {
  const { width } = useResponsiveScreen();
  return width >= breakpoints[breakpoint];
};

/**
 * Check if current screen is below a breakpoint
 */
export const useBreakpointDown = (breakpoint) => {
  const { width } = useResponsiveScreen();
  return width < breakpoints[breakpoint];
};

/**
 * Get responsive value based on breakpoints
 */
export const useResponsiveBreakpoint = (values) => {
  const { breakpoint } = useResponsiveScreen();
  
  // Sort breakpoints by size (largest to smallest)
  const sortedBreakpoints = Object.keys(breakpoints).sort(
    (a, b) => breakpoints[b] - breakpoints[a]
  );
  
  // Find the appropriate value for current breakpoint
  for (const bp of sortedBreakpoints) {
    if (values[bp] !== undefined && getCurrentBreakpoint(Dimensions.get('window').width) === bp) {
      return values[bp];
    }
  }
  
  // Fallback to default or smallest breakpoint
  return values.default || values[sortedBreakpoints[sortedBreakpoints.length - 1]];
};

/**
 * Get container styles based on breakpoint
 */
export const useContainerStyles = (fluid = false) => {
  const { width, breakpoint } = useResponsiveScreen();
  
  if (fluid) {
    return {
      width: '100%',
      paddingHorizontal: gridConfig.marginWidth,
    };
  }
  
  const maxWidth = containerMaxWidths[breakpoint] || width;
  
  return {
    width: '100%',
    maxWidth,
    marginHorizontal: 'auto',
    paddingHorizontal: gridConfig.marginWidth,
  };
};

/**
 * Grid column utilities
 */
export const getColumnWidth = (columns, totalColumns = gridConfig.columns) => {
  const percentage = (columns / totalColumns) * 100;
  return `${percentage}%`;
};

/**
 * Responsive grid hook
 */
export const useResponsiveGrid = (columnConfig) => {
  const { breakpoint } = useResponsiveScreen();
  
  // Default column configuration if not provided for current breakpoint
  const defaultColumns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
    xxl: 4,
  };
  
  const columns = columnConfig[breakpoint] || defaultColumns[breakpoint] || 1;
  
  return {
    columns,
    columnWidth: getColumnWidth(gridConfig.columns / columns),
    gap: gridConfig.gutterWidth,
  };
};

/**
 * Responsive spacing hook
 */
export const useResponsiveSpacing = (spacingConfig) => {
  const { breakpoint } = useResponsiveScreen();
  
  // Find the appropriate spacing for current breakpoint
  const sortedBreakpoints = Object.keys(breakpoints).sort(
    (a, b) => breakpoints[b] - breakpoints[a]
  );
  
  for (const bp of sortedBreakpoints) {
    if (spacingConfig[bp] !== undefined && breakpoints[bp] <= Dimensions.get('window').width) {
      return spacingConfig[bp];
    }
  }
  
  return spacingConfig.default || spacingConfig.xs || 16;
};

/**
 * Responsive font size hook
 */
export const useResponsiveFontSize = (fontSizeConfig) => {
  const { breakpoint } = useResponsiveScreen();
  
  const defaultSizes = {
    xs: 1,
    sm: 1,
    md: 1.1,
    lg: 1.2,
    xl: 1.3,
    xxl: 1.4,
  };
  
  const baseSize = fontSizeConfig.base || 16;
  const multiplier = fontSizeConfig[breakpoint] || defaultSizes[breakpoint] || 1;
  
  return baseSize * multiplier;
};

/**
 * Device orientation hook
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return width > height ? 'landscape' : 'portrait';
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    });

    return () => subscription?.remove();
  }, []);

  return orientation;
};

/**
 * Safe area utilities for different platforms
 */
export const getSafeAreaPadding = (theme) => {
  const { isWeb } = useResponsiveScreen();
  
  if (isWeb) {
    return {
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    };
  }
  
  // For React Native, use SafeAreaView or react-native-safe-area-context
  return {
    paddingTop: 0,
    paddingBottom: 0,
  };
};

/**
 * Responsive image sizing
 */
export const useResponsiveImageSize = (aspectRatio = 16/9, maxWidth = '100%') => {
  const { width } = useResponsiveScreen();
  
  const imageWidth = typeof maxWidth === 'string' 
    ? width * (parseFloat(maxWidth) / 100)
    : Math.min(maxWidth, width);
    
  return {
    width: imageWidth,
    height: imageWidth / aspectRatio,
  };
};

/**
 * Responsive modal/dialog sizing
 */
export const useResponsiveModalSize = () => {
  const { width, height, breakpoint } = useResponsiveScreen();
  
  if (breakpoint === 'xs' || breakpoint === 'sm') {
    // Full screen on mobile
    return {
      width: '100%',
      height: '100%',
      margin: 0,
    };
  }
  
  // Centered modal on larger screens
  return {
    width: Math.min(600, width * 0.9),
    maxHeight: height * 0.9,
    margin: 'auto',
  };
};

/**
 * Utility functions for responsive design
 */
export const responsiveUtils = {
  // Convert px to responsive units
  px: (value, base = 16) => value / base,
  
  // Get spacing based on screen size
  getSpacing: (size, theme) => {
    const { breakpoint } = useResponsiveScreen();
    const multiplier = breakpoint === 'xs' ? 0.8 : breakpoint === 'sm' ? 0.9 : 1;
    return theme.spacing[size] * multiplier;
  },
  
  // Get responsive border radius
  getBorderRadius: (size, theme) => {
    const { breakpoint } = useResponsiveScreen();
    const multiplier = breakpoint === 'xs' ? 0.8 : 1;
    return theme.layout.borderRadius[size] * multiplier;
  },
  
  // Check if mobile device
  isMobile: () => {
    const { breakpoint } = useResponsiveScreen();
    return breakpoint === 'xs' || breakpoint === 'sm';
  },
  
  // Check if tablet device
  isTablet: () => {
    const { breakpoint } = useResponsiveScreen();
    return breakpoint === 'md';
  },
  
  // Check if desktop device
  isDesktop: () => {
    const { breakpoint } = useResponsiveScreen();
    return breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === 'xxl';
  },
};

export default {
  breakpoints,
  containerMaxWidths,
  gridConfig,
  useResponsiveScreen,
  getCurrentBreakpoint,
  useBreakpointUp,
  useBreakpointDown,
  useResponsiveBreakpoint,
  useContainerStyles,
  getColumnWidth,
  useResponsiveGrid,
  useResponsiveSpacing,
  useResponsiveFontSize,
  useOrientation,
  getSafeAreaPadding,
  useResponsiveImageSize,
  useResponsiveModalSize,
  responsiveUtils,
};