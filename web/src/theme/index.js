// Web Theme - Mobile-responsive design system
// Based on mobile app theme but optimized for web

export const colors = {
  // Primary colors
  primary: '#1976d2',
  primaryLight: '#4791db',
  primaryDark: '#115293',
  
  // Secondary colors
  secondary: '#dc004e',
  secondaryLight: '#e33371',
  secondaryDark: '#9a0036',
  
  // Background
  background: '#f5f5f5',
  surface: '#ffffff',
  surfaceDark: '#fafafa',
  
  // Text
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  textInverted: '#ffffff',
  
  // Status colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  // Borders
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  // Font families
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontFamilyMono: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
  
  // Font sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  body: 16,
  bodySmall: 14,
  caption: 12,
  
  // Font weights
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Common component styles
export const commonStyles = {
  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  contentContainer: {
    padding: spacing.md,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  
  // Cards
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  
  cardHeader: {
    marginBottom: spacing.md,
  },
  
  cardTitle: {
    fontSize: typography.h5,
    fontWeight: typography.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  
  cardSubtitle: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  
  // Buttons
  button: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  
  buttonText: {
    fontSize: typography.body,
    fontWeight: typography.semiBold,
    color: colors.textInverted,
  },
  
  buttonTextOutline: {
    color: colors.primary,
  },
  
  // Forms
  formGroup: {
    marginBottom: spacing.md,
  },
  
  label: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.body,
    backgroundColor: colors.surface,
    minHeight: 48,
  },
  
  inputFocused: {
    borderColor: colors.primary,
  },
  
  inputError: {
    borderColor: colors.error,
  },
  
  // Text styles
  heading1: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  
  heading2: {
    fontSize: typography.h2,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  
  heading3: {
    fontSize: typography.h3,
    fontWeight: typography.semiBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  
  bodyText: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  
  caption: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  
  // Status indicators
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    alignSelf: 'flex-start',
  },
  
  badgeSuccess: {
    backgroundColor: colors.success,
  },
  
  badgeWarning: {
    backgroundColor: colors.warning,
  },
  
  badgeError: {
    backgroundColor: colors.error,
  },
  
  badgeText: {
    fontSize: typography.caption,
    fontWeight: typography.semiBold,
    color: colors.textInverted,
  },
  
  // Lists
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  listItemTitle: {
    fontSize: typography.body,
    fontWeight: typography.medium,
    color: colors.text,
  },
  
  listItemSubtitle: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
};

// Responsive breakpoints
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

// Media queries for responsive design
export const getResponsiveStyles = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  
  return {
    isMobile: width < breakpoints.mobile,
    isTablet: width >= breakpoints.mobile && width < breakpoints.desktop,
    isDesktop: width >= breakpoints.desktop,
    
    // Conditional styles
    container: {
      paddingHorizontal: width < breakpoints.mobile ? spacing.md : spacing.xl,
    },
    
    grid: {
      columns: width < breakpoints.mobile ? 1 : width < breakpoints.desktop ? 2 : 3,
    },
  };
};

const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  commonStyles,
  breakpoints,
  getResponsiveStyles,
};

export default theme;
