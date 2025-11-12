/**
 * iPad Configuration Index
 * Central export point for all iPad-related utilities and themes
 */

// Device detection
export { 
  isIPad, 
  deviceIsIPad,
  getDevicePadding,
  getDeviceMargin,
} from '../util/dimensions';

// iPad theme
export {
  iPadTheme,
  iPadLayout,
  iPadLayoutUtils,
  getResponsiveStyle,
  getDeviceFontSize,
  useDeviceTheme,
  createOrientationStyles,
  getDeviceType,
} from './iPadTheme';

// iPad configuration and utilities
export {
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
} from '../util/iPadConfig';

// Responsive system
export {
  breakpoints,
  useResponsiveScreen,
  useBreakpointUp,
  useBreakpointDown,
  useOrientation,
  responsiveUtils,
} from './responsiveSystem';

// Re-export everything as default for convenience
import * as dimensions from '../util/dimensions';
import * as iPadTheme from './iPadTheme';
import * as iPadConfig from '../util/iPadConfig';
import * as responsiveSystem from './responsiveSystem';

export default {
  ...dimensions,
  ...iPadTheme,
  ...iPadConfig.default,
  ...responsiveSystem,
};
