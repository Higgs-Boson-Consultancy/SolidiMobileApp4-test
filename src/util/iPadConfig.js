/**
 * iPad Setup and Configuration Guide
 * 
 * This file provides utilities and documentation for iPad-specific features
 * and optimal usage patterns throughout the app.
 */

import { Dimensions, Platform, StatusBar } from 'react-native';
import { isIPad, deviceIsIPad } from '../util/dimensions';

/**
 * iPad Configuration Object
 * Contains all iPad-specific settings and constants
 */
export const iPadConfig = {
  // Device detection
  isIPad: deviceIsIPad,
  
  // Layout constants
  layout: {
    // Preferred content widths for different layouts
    contentWidth: {
      narrow: 500,   // For single-column forms
      medium: 700,   // For standard content
      wide: 1000,    // For wide content layouts
      full: Dimensions.get('window').width,
    },
    
    // Sidebar dimensions
    sidebar: {
      collapsed: 80,
      expanded: 280,
    },
    
    // Navigation
    tabBar: {
      height: 65,
      iconSize: 28,
      labelSize: 13,
    },
    
    // Cards and containers
    card: {
      minWidth: 300,
      maxWidth: 450,
      padding: 24,
    },
    
    // Modals
    modal: {
      small: 400,
      medium: 600,
      large: 800,
      padding: 32,
    },
    
    // Forms
    form: {
      maxWidth: 700,
      inputHeight: 52,
      labelSpacing: 12,
    },
  },
  
  // Typography scaling for iPad
  typography: {
    scale: 1.15,
    lineHeightMultiplier: 1.2,
    letterSpacing: 0.2,
  },
  
  // Spacing multiplier
  spacingMultiplier: 1.4,
  
  // Grid configurations
  grid: {
    portrait: {
      columns: 2,
      gap: 24,
    },
    landscape: {
      columns: 3,
      gap: 32,
    },
  },
  
  // Touch target sizes (Apple HIG recommendations)
  touchTarget: {
    minimum: 44,
    comfortable: 48,
    large: 56,
  },
};

/**
 * Get safe layout dimensions for iPad
 * Accounts for notches, rounded corners, and home indicator
 */
export const getIPadSafeDimensions = () => {
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;
  
  return {
    width,
    height,
    safeWidth: width - (isLandscape ? 88 : 0), // Safe area for landscape
    safeHeight: height - 20, // Status bar consideration
    contentWidth: Math.min(width * 0.9, iPadConfig.layout.contentWidth.wide),
    isLandscape,
  };
};

/**
 * Determine optimal layout mode for current orientation
 */
export const getIPadLayoutMode = () => {
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;
  
  if (!deviceIsIPad) {
    return 'mobile';
  }
  
  if (width >= 1024 && isLandscape) {
    return 'split'; // Side-by-side layout
  }
  
  if (isLandscape) {
    return 'landscape'; // Wide layout
  }
  
  return 'portrait'; // Standard layout
};

/**
 * Calculate optimal grid columns based on width and orientation
 */
export const getIPadGridColumns = (minCardWidth = 300) => {
  if (!deviceIsIPad) return 1;
  
  const { width } = Dimensions.get('window');
  const isLandscape = width > Dimensions.get('window').height;
  
  // Calculate how many columns can fit
  const availableWidth = width - (iPadConfig.spacingMultiplier * 32);
  const possibleColumns = Math.floor(availableWidth / minCardWidth);
  
  // Return sensible defaults based on orientation
  if (isLandscape) {
    return Math.min(possibleColumns, 3);
  }
  
  return Math.min(possibleColumns, 2);
};

/**
 * Get responsive padding based on device and orientation
 */
export const getIPadPadding = (basePadding = 16) => {
  if (!deviceIsIPad) return basePadding;
  
  const { width } = Dimensions.get('window');
  const isLandscape = width > Dimensions.get('window').height;
  
  return {
    horizontal: basePadding * (isLandscape ? 2 : 1.5),
    vertical: basePadding * 1.5,
    card: basePadding * 1.5,
    modal: basePadding * 2,
  };
};

/**
 * Optimize image sizes for iPad displays
 */
export const getIPadImageSize = (baseWidth, baseHeight, maxWidth = null) => {
  if (!deviceIsIPad) {
    return { width: baseWidth, height: baseHeight };
  }
  
  const scale = 1.5; // iPad scale factor
  const { width: screenWidth } = Dimensions.get('window');
  
  let width = baseWidth * scale;
  let height = baseHeight * scale;
  
  // Apply max width constraint if provided
  if (maxWidth) {
    const constrainedWidth = Math.min(maxWidth, screenWidth * 0.9);
    if (width > constrainedWidth) {
      const ratio = height / width;
      width = constrainedWidth;
      height = width * ratio;
    }
  }
  
  return { width, height };
};

/**
 * Determine if split-view layout should be used
 * Split-view shows sidebar + main content side-by-side
 */
export const shouldUseSplitView = () => {
  if (!deviceIsIPad) return false;
  
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;
  
  // Use split view on larger iPads in landscape
  return isLandscape && width >= 1024;
};

/**
 * Get appropriate modal size for iPad
 */
export const getIPadModalSize = (size = 'medium') => {
  const { width, height } = Dimensions.get('window');
  
  if (!deviceIsIPad) {
    return {
      width: width * 0.95,
      height: height * 0.9,
    };
  }
  
  const modalWidth = iPadConfig.layout.modal[size] || iPadConfig.layout.modal.medium;
  
  return {
    width: Math.min(modalWidth, width * 0.85),
    height: Math.min(height * 0.85, 800),
  };
};

/**
 * Style helpers for common iPad patterns
 */
export const iPadStyleHelpers = {
  // Container with max width
  container: (maxWidth = iPadConfig.layout.contentWidth.medium) => {
    if (!deviceIsIPad) {
      return {
        width: '100%',
        paddingHorizontal: 16,
      };
    }
    
    return {
      width: '100%',
      maxWidth,
      alignSelf: 'center',
      paddingHorizontal: 24,
    };
  },
  
  // Card with iPad-optimized spacing
  card: () => {
    return {
      padding: deviceIsIPad ? 24 : 16,
      borderRadius: deviceIsIPad ? 16 : 12,
      marginBottom: deviceIsIPad ? 20 : 12,
    };
  },
  
  // Form input with iPad sizing
  input: () => {
    return {
      height: deviceIsIPad ? 52 : 44,
      fontSize: deviceIsIPad ? 17 : 16,
      paddingHorizontal: deviceIsIPad ? 20 : 16,
    };
  },
  
  // Button with touch-friendly sizing
  button: () => {
    return {
      height: deviceIsIPad ? 52 : 44,
      paddingHorizontal: deviceIsIPad ? 32 : 24,
      borderRadius: deviceIsIPad ? 12 : 8,
    };
  },
  
  // Grid layout
  grid: (columns = null) => {
    const cols = columns || getIPadGridColumns();
    const gap = deviceIsIPad ? 24 : 16;
    
    return {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap,
      columnGap: gap,
    };
  },
  
  // Grid item
  gridItem: (columns = null) => {
    const cols = columns || getIPadGridColumns();
    const gap = deviceIsIPad ? 24 : 16;
    
    return {
      width: `${(100 / cols) - (gap / cols)}%`,
      marginBottom: gap,
    };
  },
};

/**
 * Keyboard handling for iPad
 * iPad keyboards can be floating or split
 */
export const iPadKeyboardConfig = {
  // Keyboard avoid behavior
  behavior: Platform.OS === 'ios' ? 'padding' : 'height',
  
  // Offset for floating keyboard
  keyboardVerticalOffset: deviceIsIPad ? 80 : 0,
  
  // Whether to enable keyboard avoiding
  enabled: true,
};

/**
 * Multitasking support detection
 * Check if app is running in Split View or Slide Over
 */
export const getIPadMultitaskingMode = () => {
  const { width, height } = Dimensions.get('window');
  const screenWidth = Dimensions.get('screen').width;
  
  if (!deviceIsIPad) return 'fullscreen';
  
  // If window width is less than screen width, we're in multitasking
  if (width < screenWidth * 0.95) {
    // Determine if it's split view or slide over
    const widthRatio = width / screenWidth;
    
    if (widthRatio < 0.35) {
      return 'slideover'; // Slide Over (1/3 of screen)
    }
    
    return 'splitview'; // Split View (1/2 or 2/3 of screen)
  }
  
  return 'fullscreen';
};

/**
 * Check if app needs to adapt layout for multitasking
 */
export const shouldAdaptForMultitasking = () => {
  const mode = getIPadMultitaskingMode();
  return mode === 'splitview' || mode === 'slideover';
};

// Export configuration and utilities
export default {
  iPadConfig,
  getIPadSafeDimensions,
  getIPadLayoutMode,
  getIPadGridColumns,
  getIPadPadding,
  getIPadImageSize,
  shouldUseSplitView,
  getIPadModalSize,
  iPadStyleHelpers,
  iPadKeyboardConfig,
  getIPadMultitaskingMode,
  shouldAdaptForMultitasking,
};
