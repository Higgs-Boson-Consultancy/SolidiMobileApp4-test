// Universal Components Library
// Provides theme-aware components that work across mobile and web platforms

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useThemedStyles, useTheme, useResponsiveValue } from '../styles/themeHooks';

// Universal Container Component
export const UniversalContainer = ({ 
  children, 
  maxWidth = true, 
  padding = 'md', 
  safe = false,
  ...props 
}) => {
  const styles = useThemedStyles(({ theme }) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing[padding],
      ...(Platform.OS === 'web' && {
        maxWidth: maxWidth ? (theme.layout?.maxWidth || '1200px') : '100%',
        margin: '0 auto',
        minHeight: '100vh'
      })
    }
  }));

  const Container = Platform.OS === 'web' ? View : (safe ? ScrollView : View);
  
  return (
    <Container style={styles.container} {...props}>
      {children}
    </Container>
  );
};

// Universal Text Component
export const UniversalText = ({ 
  children, 
  variant = 'body', 
  color = 'primary',
  align = 'left',
  ...props 
}) => {
  const styles = useThemedStyles(({ theme }) => {
    const variants = {
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
    };

    const colors = {
      primary: theme.colors.text.primary,
      secondary: theme.colors.text.secondary,
      disabled: theme.colors.text.disabled,
      error: theme.colors.error,
      success: theme.colors.success,
      onPrimary: theme.colors.text.onPrimary,
    };

    return {
      text: {
        color: colors[color] || theme.colors.text.primary,
        fontFamily: theme.typography.fontFamily.regular,
        textAlign: align,
        ...variants[variant],
      }
    };
  });

  return (
    <Text style={styles.text} {...props}>
      {children}
    </Text>
  );
};

// Universal Button Component
export const UniversalButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  fullWidth = false,
  ...props 
}) => {
  const { isWeb } = useTheme();
  const buttonWidth = useResponsiveValue(
    fullWidth ? '100%' : 'auto',
    fullWidth ? '100%' : 'auto'
  );

  const styles = useThemedStyles(({ theme }) => {
    const variants = {
      primary: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
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

    const sizes = {
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
    };

    const textColors = {
      primary: theme.colors.text.onPrimary,
      secondary: theme.colors.primary,
      text: theme.colors.primary,
    };

    const textSizes = {
      small: theme.typography.fontSize.sm,
      medium: theme.typography.fontSize.md,
      large: theme.typography.fontSize.lg,
    };

    return {
      button: {
        borderRadius: theme.layout.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: buttonWidth,
        ...variants[variant],
        ...sizes[size],
        ...(disabled && { opacity: 0.5 }),
        ...(isWeb && {
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          border: 'none',
          outline: 'none',
          userSelect: 'none',
        }),
      },
      text: {
        color: textColors[variant],
        fontSize: textSizes[size],
        fontWeight: theme.typography.fontWeight.medium,
        fontFamily: theme.typography.fontFamily.medium,
      },
    };
  });

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

// Universal Card Component
export const UniversalCard = ({ 
  children, 
  elevation = 'medium', 
  onPress,
  padding = 'lg',
  ...props 
}) => {
  const styles = useThemedStyles(({ theme, platform }) => {
    const elevations = {
      none: 0,
      low: 2,
      medium: 4,
      high: 8,
    };

    const elevationValue = elevations[elevation];

    return {
      card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.layout.borderRadius.lg,
        padding: theme.spacing[padding],
        marginBottom: theme.spacing.md,
        
        // Platform-specific shadows
        ...(platform === 'web' ? {
          boxShadow: elevationValue > 0 
            ? `0 ${elevationValue}px ${elevationValue * 2}px rgba(0,0,0,0.1)`
            : 'none',
          ...(onPress && {
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 ${elevationValue + 2}px ${(elevationValue + 2) * 2}px rgba(0,0,0,0.15)`
            }
          })
        } : platform === 'ios' ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: elevationValue },
          shadowOpacity: 0.1,
          shadowRadius: elevationValue,
        } : {
          elevation: elevationValue,
        })
      }
    };
  });

  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component style={styles.card} onPress={onPress} {...props}>
      {children}
    </Component>
  );
};

// Universal Input Component
export const UniversalInput = ({ 
  value, 
  onChangeText, 
  placeholder,
  label,
  error,
  disabled = false,
  multiline = false,
  ...props 
}) => {
  const { TextInput } = require('react-native');
  const styles = useThemedStyles(({ theme, isWeb }) => ({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.primary,
      fontWeight: theme.typography.fontWeight.medium,
      marginBottom: theme.spacing.xs,
      fontFamily: theme.typography.fontFamily.medium,
    },
    input: {
      borderWidth: theme.layout.borderWidth.thin,
      borderColor: error ? theme.colors.error : theme.colors.border,
      borderRadius: theme.layout.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.primary,
      backgroundColor: disabled ? theme.colors.backgroundSecondary : theme.colors.background,
      fontFamily: theme.typography.fontFamily.regular,
      minHeight: multiline ? 80 : 44,
      ...(isWeb && {
        outline: 'none',
        transition: 'border-color 0.2s ease',
      }),
    },
    error: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
      fontFamily: theme.typography.fontFamily.regular,
    },
  }));

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={styles.input.borderColor}
        editable={!disabled}
        multiline={multiline}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

// Theme Demo Component
export const ThemeDemo = () => {
  const { isDarkMode, toggleTheme, isWeb, currentPlatform } = useTheme();
  
  return (
    <UniversalContainer>
      <UniversalText variant="h1" align="center">
        🎨 Universal Theme System
      </UniversalText>
      
      <UniversalCard elevation="medium">
        <UniversalText variant="h3">Platform Information</UniversalText>
        <UniversalText>Platform: {currentPlatform}</UniversalText>
        <UniversalText>Is Web: {isWeb ? 'Yes' : 'No'}</UniversalText>
        <UniversalText>Dark Mode: {isDarkMode ? 'On' : 'Off'}</UniversalText>
      </UniversalCard>

      <UniversalCard elevation="high">
        <UniversalText variant="h3">Theme Controls</UniversalText>
        <UniversalButton
          title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Theme`}
          onPress={toggleTheme}
          variant="primary"
          fullWidth
        />
      </UniversalCard>

      <UniversalCard>
        <UniversalText variant="h3">Component Examples</UniversalText>
        
        <UniversalButton
          title="Primary Button"
          variant="primary"
          size="medium"
          onPress={() => console.log('Primary button pressed')}
        />
        
        <View style={{ height: 8 }} />
        
        <UniversalButton
          title="Secondary Button"
          variant="secondary"
          size="medium"
          onPress={() => console.log('Secondary button pressed')}
        />
        
        <View style={{ height: 16 }} />
        
        <UniversalInput
          label="Sample Input"
          placeholder="Enter something..."
          value=""
          onChangeText={() => {}}
        />
      </UniversalCard>

      <UniversalCard>
        <UniversalText variant="h3">Typography Examples</UniversalText>
        <UniversalText variant="h1">Heading 1</UniversalText>
        <UniversalText variant="h2">Heading 2</UniversalText>
        <UniversalText variant="h3">Heading 3</UniversalText>
        <UniversalText variant="body">Body text with normal styling</UniversalText>
        <UniversalText variant="caption" color="secondary">Caption text in secondary color</UniversalText>
      </UniversalCard>
    </UniversalContainer>
  );
};