// Example: Converting Login component to use Universal Theme System
// This shows the migration pattern you should follow for all components

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useThemedStyles, useTheme } from 'src/styles/ThemeProvider';

const ThemedLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { colors, spacing } = useTheme();
  const styles = useThemedStyles(createLoginStyles);

  const handleLogin = () => {
    console.log('Login attempt:', { email, password });
    // Your login logic here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={colors.text.disabled}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={colors.text.disabled}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const createLoginStyles = ({ theme, isWeb, platform }) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    
    // Web-specific centering
    ...(isWeb && {
      minHeight: '100vh',
      justifyContent: 'center',
      alignItems: 'center'
    })
  },

  form: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.borderRadius.lg,
    padding: theme.spacing.xl,
    
    // Platform-specific shadows and sizing
    ...(isWeb ? {
      maxWidth: 400,
      width: '100%',
      boxShadow: `0 ${theme.layout.elevation.high}px ${theme.layout.elevation.high * 2}px rgba(0,0,0,0.1)`
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: theme.layout.elevation.high },
      shadowOpacity: 0.1,
      shadowRadius: theme.layout.elevation.high,
      elevation: theme.layout.elevation.high
    })
  },

  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.bold
  },

  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily.regular
  },

  inputContainer: {
    marginBottom: theme.spacing.lg
  },

  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.medium
  },

  input: {
    borderWidth: theme.layout.borderWidth.thin,
    borderColor: theme.colors.text.disabled,
    borderRadius: theme.layout.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
    fontFamily: theme.typography.fontFamily.regular,
    
    // Web-specific styling
    ...(isWeb && {
      outline: 'none',
      transition: 'border-color 0.2s ease',
      '&:focus': {
        borderColor: theme.colors.primary
      }
    })
  },

  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.layout.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    
    // Web enhancements
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        opacity: 0.9,
        transform: 'translateY(-1px)'
      }
    })
  },

  loginButtonText: {
    color: theme.colors.text.onPrimary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.medium
  },

  forgotPassword: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    
    ...(isWeb && { cursor: 'pointer' })
  },

  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.text.disabled
  },

  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular
  },

  secondaryButton: {
    borderWidth: theme.layout.borderWidth.thin,
    borderColor: theme.colors.primary,
    borderRadius: theme.layout.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: 'transparent',
    
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: theme.colors.primary,
        '& $secondaryButtonText': {
          color: theme.colors.text.onPrimary
        }
      }
    })
  },

  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.medium
  }
});

export default ThemedLogin;