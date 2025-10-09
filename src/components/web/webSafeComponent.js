// Systematic WeakMap error protection for React Native Web components
import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

console.log('🛡️ Loading WeakMap error protection system...');

// Generic fallback component factory
const createFallbackComponent = (componentName, description = 'This feature is optimized for mobile devices.') => {
  return () => (
    <View style={fallbackStyles.container}>
      <Text style={fallbackStyles.title}>{componentName}</Text>
      <Text style={fallbackStyles.description}>{description}</Text>
      <Text style={fallbackStyles.note}>
        For the full experience, please use the mobile app.
      </Text>
    </View>
  );
};

const fallbackStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    maxWidth: 400,
    lineHeight: 24,
  },
  note: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 350,
  },
});

// List of components known to cause WeakMap errors on web
const problematicComponents = [
  'Register',
  'AccountUpdate',
  'PersonalDetails',
  'Buy',
  'Sell',
  'Transfer',
  'Send',
  'Trade',
  'Wallet',
  'Login'
];

// Create a web-safe component wrapper
export const createWebSafeComponent = (componentName, importPath, description) => {
  // If on mobile, always use the original component
  if (Platform.OS !== 'web') {
    try {
      return require(importPath).default;
    } catch (error) {
      console.error(`Error loading ${componentName} on mobile:`, error);
      return createFallbackComponent(componentName, 'Component failed to load.');
    }
  }

  // On web, check if this component is known to be problematic
  if (problematicComponents.includes(componentName)) {
    console.log(`🌐 Using fallback for known problematic component: ${componentName}`);
    return createFallbackComponent(componentName, description);
  }

  // For other components, try to load with error protection
  try {
    const Component = require(importPath).default;
    
    // Wrap with error boundary
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }

      static getDerivedStateFromError(error) {
        console.error(`${componentName} error boundary caught:`, error);
        return { hasError: true };
      }

      componentDidCatch(error, errorInfo) {
        console.error(`${componentName} error details:`, { error, errorInfo });
      }

      render() {
        if (this.state.hasError) {
          const FallbackComponent = createFallbackComponent(componentName, 'Component encountered an error.');
          return <FallbackComponent />;
        }

        try {
          return <Component {...this.props} />;
        } catch (error) {
          console.error(`${componentName} render error:`, error);
          const FallbackComponent = createFallbackComponent(componentName, 'Component failed to render.');
          return <FallbackComponent />;
        }
      }
    };
    
  } catch (importError) {
    console.error(`Error importing ${componentName} on web:`, importError);
    return createFallbackComponent(componentName, 'Component failed to import.');
  }
};

// Export fallback creation for direct use
export { createFallbackComponent };

console.log('✅ WeakMap error protection system loaded');