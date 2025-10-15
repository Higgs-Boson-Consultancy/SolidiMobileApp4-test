
// Legacy colors - now integrated with Universal Theme System
// Import the universal theme for consistency
import { baseTheme } from '../styles/universalTheme';

export const colors = {
  // Primary brand colors (now theme-aware)
  primary: baseTheme.colors.primary,
  standardButton: baseTheme.colors.primary,
  buttonText: baseTheme.colors.primary,
  selectedIcon: baseTheme.colors.primary,
  linkText: baseTheme.colors.primary,
  
  // Background colors
  defaultBackground: baseTheme.colors.background,
  mainPanelBackground: baseTheme.colors.background,
  unavailableButton: baseTheme.colors.surface,
  footerPanelButton: baseTheme.colors.surface,
  
  // Text colors
  standardButtonText: baseTheme.colors.text.onPrimary,
  placeHolderTextColor: baseTheme.colors.text.secondary,
  
  // Status colors
  warning: baseTheme.colors.warning || '#ff6b35',
  red: baseTheme.colors.error,
  success: baseTheme.colors.success,
  successBackground: baseTheme.colors.successBackground || '#e8f5e8',
  
  // UI colors
  greyedOutIcon: baseTheme.colors.text.disabled,
  lightgrey: baseTheme.colors.border,
  border: baseTheme.colors.border,
  
  // Direct color values (for backward compatibility)
  white: '#ffffff',
  black: '#000000',
  lightBlue: '#e3f2fd',
  gray: '#9e9e9e',
  darkGray: '#424242',
  lightGray: '#f5f5f5',
  lightestGray: '#fafafa',
  mediumGray: '#757575',
  
  // Additional colors for AccountUpdate tabs
  lightBackground: '#f8f9fa',
  darkText: '#212529',
  primaryLight: '#e3f2fd',
}

export default colors;
