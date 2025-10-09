// Universal Component Example - Shows how to build components that work across platforms
// This demonstrates the recommended patterns for your Solidi app

import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useThemedStyles, useTheme, useResponsiveValue } from 'src/styles/ThemeProvider';

// Example: Universal Card Component
export const UniversalCard = ({ children, elevation = 'medium', onPress, ...props }) => {
  const styles = useThemedStyles(createCardStyles);
  const { theme } = useTheme();
  
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component 
      style={[styles.card, styles[`elevation${elevation}`]]} 
      onPress={onPress}
      {...props}
    >
      {children}
    </Component>
  );
};

const createCardStyles = ({ theme, isWeb, platform }) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    
    // Platform-specific shadows
    ...(platform === 'web' ? {
      boxShadow: `0 ${theme.layout.elevation.medium}px ${theme.layout.elevation.medium * 2}px rgba(0,0,0,0.1)`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 ${theme.layout.elevation.high}px ${theme.layout.elevation.high * 2}px rgba(0,0,0,0.15)`
      }
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: theme.layout.elevation.medium },
      shadowOpacity: 0.1,
      shadowRadius: theme.layout.elevation.medium,
      elevation: theme.layout.elevation.medium
    })
  },
  
  elevationlow: platform === 'android' ? { elevation: 2 } : {},
  elevationmedium: platform === 'android' ? { elevation: 4 } : {},
  elevationhigh: platform === 'android' ? { elevation: 8 } : {}
});

// Example: Universal Button Component  
export const UniversalButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  ...props 
}) => {
  const styles = useThemedStyles(createButtonStyles);
  const buttonWidth = useResponsiveValue('100%', 'auto');
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        { width: buttonWidth },
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const createButtonStyles = ({ theme, isWeb }) => ({
  button: {
    borderRadius: theme.layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    
    // Web-specific enhancements
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      outline: 'none',
      userSelect: 'none'
    })
  },
  
  // Variants
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
  
  // Sizes
  small: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minHeight: 32,
  },
  medium: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 56,
  },
  
  // Text styles
  text: {
    fontFamily: theme.typography.fontFamily.medium,
  },
  primaryText: {
    color: theme.colors.text.onPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  secondaryText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  textText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.normal,
  },
  
  // Size-specific text
  smallText: {
    fontSize: theme.typography.fontSize.sm,
  },
  mediumText: {
    fontSize: theme.typography.fontSize.md,
  },
  largeText: {
    fontSize: theme.typography.fontSize.lg,
  },
  
  // States
  disabled: {
    opacity: 0.5,
    ...(isWeb && { cursor: 'not-allowed' })
  }
});

// Example: Universal Layout Component
export const UniversalContainer = ({ children, maxWidth = true, ...props }) => {
  const styles = useThemedStyles(createContainerStyles);
  const containerMaxWidth = useResponsiveValue('100%', maxWidth ? '1200px' : '100%');
  
  return (
    <View style={[styles.container, { maxWidth: containerMaxWidth }]} {...props}>
      {children}
    </View>
  );
};

const createContainerStyles = ({ theme, isWeb }) => ({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    
    ...(isWeb && {
      margin: '0 auto',
      minHeight: '100vh',
      padding: theme.spacing.lg
    })
  }
});

// Example: Universal Typography Component
export const UniversalText = ({ 
  children, 
  variant = 'body', 
  color = 'primary',
  align = 'left',
  ...props 
}) => {
  const styles = useThemedStyles(createTextStyles);
  
  return (
    <Text 
      style={[
        styles.base,
        styles[variant],
        styles[`color${color}`],
        { textAlign: align }
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

const createTextStyles = ({ theme, isWeb }) => ({
  base: {
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    
    ...(isWeb && {
      userSelect: 'text'
    })
  },
  
  // Typography variants
  h1: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: theme.typography.lineHeight.tight,
    marginBottom: theme.spacing.lg,
  },
  h2: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: theme.typography.lineHeight.tight,
    marginBottom: theme.spacing.md,
  },
  h3: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    lineHeight: theme.typography.lineHeight.normal,
    marginBottom: theme.spacing.sm,
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
  
  // Color variants
  colorprimary: { color: theme.colors.text.primary },
  colorsecondary: { color: theme.colors.text.secondary },
  colordisabled: { color: theme.colors.text.disabled },
  colorerror: { color: theme.colors.error },
  colorsuccess: { color: theme.colors.success }
});

// Example usage in your existing components:
/*
// Instead of hardcoded styles:
const styles = {
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8
  }
};

// Use themed styles:
const MyComponent = () => {
  const styles = useThemedStyles(({ theme }) => ({
    card: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.layout.borderRadius.md
    }
  }));
  
  return <UniversalCard>...</UniversalCard>;
};
*/