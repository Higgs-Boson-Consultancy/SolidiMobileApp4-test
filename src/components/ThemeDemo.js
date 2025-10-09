// Example component showing how to use the universal theme system
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemedStyles, useTheme } from 'src/styles/ThemeProvider';

const ThemeDemo = () => {
  const { isDarkMode, toggleTheme, isWeb, currentPlatform } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Universal Theme Demo</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Platform: {currentPlatform}</Text>
        <Text style={styles.infoText}>Is Web: {isWeb ? 'Yes' : 'No'}</Text>
        <Text style={styles.infoText}>Dark Mode: {isDarkMode ? 'On' : 'Off'}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={toggleTheme}>
        <Text style={styles.buttonText}>
          Switch to {isDarkMode ? 'Light' : 'Dark'} Theme
        </Text>
      </TouchableOpacity>

      <View style={styles.featuresContainer}>
        <Text style={styles.subtitle}>Theme Features:</Text>
        <Text style={styles.feature}>✅ Cross-platform compatibility</Text>
        <Text style={styles.feature}>✅ Automatic light/dark mode</Text>
        <Text style={styles.feature}>✅ Platform-specific optimizations</Text>
        <Text style={styles.feature}>✅ Responsive design</Text>
      </View>
    </View>
  );
};

const createStyles = ({ theme, isWeb, platform }) => ({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...(isWeb && {
      maxWidth: 600,
      margin: '0 auto',
      minHeight: '100vh'
    })
  },
  
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily.bold
  },
  
  infoCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.layout.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    width: '100%',
    
    // Platform-specific shadows
    ...(platform === 'web' ? {
      boxShadow: `0 ${theme.layout.elevation.medium}px ${theme.layout.elevation.medium * 2}px rgba(0,0,0,0.1)`
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: theme.layout.elevation.medium },
      shadowOpacity: 0.1,
      shadowRadius: theme.layout.elevation.medium,
      elevation: theme.layout.elevation.medium
    })
  },
  
  infoText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.regular
  },
  
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.layout.borderRadius.md,
    marginBottom: theme.spacing.xl,
    
    // Web-specific enhancements
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        opacity: 0.9,
        transform: 'translateY(-2px)'
      }
    })
  },
  
  buttonText: {
    color: theme.colors.text.onPrimary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily.medium
  },
  
  featuresContainer: {
    width: '100%',
    alignItems: 'flex-start'
  },
  
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.fontFamily.medium
  },
  
  feature: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.regular
  }
});

export default ThemeDemo;