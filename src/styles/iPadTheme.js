/**
 * iPad-Specific Theme Configuration
 * 
 * This file contains styling adjustments and configurations specifically
 * optimized for iPad devices, including larger screens and landscape mode.
 */

import { Dimensions, Platform } from 'react-native';
import { createTheme } from './theme';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from './shared';

// Detect if current device is an iPad
export const isIPad = () => {
  if (Platform.OS !== 'ios') return false;
  
  const { width, height } = Dimensions.get('window');
  const aspectRatio = height / width;
  
  // iPad typically has aspect ratio closer to 4:3 (1.33) vs iPhone's ~16:9 (1.77)
  // and screen width >= 768
  return width >= 768 && aspectRatio < 1.6;
};

// Get device type
export const getDeviceType = () => {
  if (Platform.OS === 'web') return 'web';
  if (isIPad()) return 'ipad';
  return 'phone';
};

// iPad-specific spacing (larger than phone)
const iPadSpacing = {
  xs: spacing.xs * 1.2,
  sm: spacing.sm * 1.2,
  md: spacing.md * 1.3,
  lg: spacing.lg * 1.4,
  xl: spacing.xl * 1.5,
  xxl: spacing.xxl * 1.5,
};

// iPad-specific font sizes (slightly larger for readability on bigger screens)
const iPadFontSize = {
  xs: fontSize.xs * 1.1,
  sm: fontSize.sm * 1.1,
  md: fontSize.md * 1.15,
  lg: fontSize.lg * 1.2,
  xl: fontSize.xl * 1.2,
  xxl: fontSize.xxl * 1.25,
  xxxl: fontSize.xxxl * 1.25,
};

// iPad-specific border radius (slightly larger)
const iPadBorderRadius = {
  xs: borderRadius.xs * 1.2,
  sm: borderRadius.sm * 1.2,
  md: borderRadius.md * 1.2,
  lg: borderRadius.lg * 1.2,
  xl: borderRadius.xl * 1.2,
  xxl: borderRadius.xxl * 1.2,
  round: borderRadius.round,
};

// iPad layout configurations
export const iPadLayout = {
  // Content width constraints for better readability
  maxContentWidth: 800,
  sidebarWidth: 280,
  
  // Grid configurations for landscape/portrait
  gridColumns: {
    portrait: 2,
    landscape: 3,
  },
  
  // Card sizes
  cardMinWidth: 300,
  cardMaxWidth: 450,
  
  // Modal sizes
  modalWidth: {
    small: 400,
    medium: 600,
    large: 800,
  },
  
  // Form widths
  formMaxWidth: 700,
  inputHeight: 50,
  
  // Header/Footer heights
  headerHeight: 70,
  footerHeight: 60,
  tabBarHeight: 65,
};

// Create iPad-optimized theme
export const iPadTheme = createTheme({
  colors: {
    ...colors,
    // iPad can support richer colors on larger displays
  },
  spacing: iPadSpacing,
  typography: {
    fontSize: iPadFontSize,
    fontWeight,
  },
  borderRadius: iPadBorderRadius,
  shadows: {
    ...shadows,
    // Slightly more pronounced shadows on larger screens
    small: {
      ...shadows.small,
      shadowRadius: shadows.small.shadowRadius * 1.2,
    },
    medium: {
      ...shadows.medium,
      shadowRadius: shadows.medium.shadowRadius * 1.2,
    },
    large: {
      ...shadows.large,
      shadowRadius: shadows.large.shadowRadius * 1.2,
    },
  },
  layout: iPadLayout,
});

// Responsive style helper for iPad
export const getResponsiveStyle = (phoneStyle, iPadStyle) => {
  return isIPad() ? iPadStyle : phoneStyle;
};

// Get appropriate padding for device
export const getDevicePadding = (basePadding = 16) => {
  return isIPad() ? basePadding * 1.5 : basePadding;
};

// Get appropriate font size for device
export const getDeviceFontSize = (baseFontSize = 16) => {
  return isIPad() ? baseFontSize * 1.15 : baseFontSize;
};

// Layout utilities for iPad
export const iPadLayoutUtils = {
  // Check if device is in landscape mode
  isLandscape: () => {
    const { width, height } = Dimensions.get('window');
    return width > height;
  },
  
  // Get number of columns based on orientation
  getColumnCount: () => {
    const isLandscape = iPadLayoutUtils.isLandscape();
    return isIPad() 
      ? (isLandscape ? iPadLayout.gridColumns.landscape : iPadLayout.gridColumns.portrait)
      : 1;
  },
  
  // Get content width with max constraint
  getContentWidth: () => {
    const { width } = Dimensions.get('window');
    return isIPad() 
      ? Math.min(width - (iPadSpacing.xl * 2), iPadLayout.maxContentWidth)
      : width - (spacing.md * 2);
  },
  
  // Get modal width
  getModalWidth: (size = 'medium') => {
    const { width } = Dimensions.get('window');
    if (!isIPad()) return width * 0.9;
    
    const modalWidth = iPadLayout.modalWidth[size] || iPadLayout.modalWidth.medium;
    return Math.min(modalWidth, width * 0.9);
  },
  
  // Should use split view layout
  shouldUseSplitView: () => {
    const { width } = Dimensions.get('window');
    return isIPad() && iPadLayoutUtils.isLandscape() && width >= 1024;
  },
};

// Hook to get current device theme
export const useDeviceTheme = () => {
  const deviceType = getDeviceType();
  
  if (deviceType === 'ipad') {
    return iPadTheme;
  }
  
  // Return default theme for phone
  return createTheme();
};

// Orientation-aware styles helper
export const createOrientationStyles = (portraitStyles, landscapeStyles) => {
  const isLandscape = iPadLayoutUtils.isLandscape();
  
  if (isIPad()) {
    return isLandscape ? landscapeStyles : portraitStyles;
  }
  
  return portraitStyles;
};

// Export all utilities
export default {
  isIPad,
  getDeviceType,
  iPadTheme,
  iPadLayout,
  iPadLayoutUtils,
  getResponsiveStyle,
  getDevicePadding,
  getDeviceFontSize,
  useDeviceTheme,
  createOrientationStyles,
};
