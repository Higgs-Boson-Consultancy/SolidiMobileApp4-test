// Web-safe Register component wrapper with comprehensive error handling
import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

console.log('🔍 Loading Register component with error protection...');

// Create a fallback component for Register issues
const RegisterFallback = () => (
  <View style={styles.fallbackContainer}>
    <Text style={styles.fallbackTitle}>Registration</Text>
    <Text style={styles.fallbackText}>
      Registration is currently optimized for mobile devices.
    </Text>
    <Text style={styles.fallbackSubtext}>
      For the best experience, please use the mobile app to create your account.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  fallbackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  fallbackText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    maxWidth: 400,
  },
  fallbackSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    maxWidth: 350,
  },
});

// Main Register component with error boundaries
const RegisterWebSafe = (props) => {
  // On mobile, always try to use the actual Register component
  if (Platform.OS !== 'web') {
    try {
      const ActualRegister = require('./Register').default;
      return <ActualRegister {...props} />;
    } catch (error) {
      console.error('Error loading Register on mobile:', error);
      return <RegisterFallback />;
    }
  }

  // On web, use extra caution and error boundaries
  console.log('🌐 Loading Register component on web with error protection...');
  
  try {
    // Try to load the Register component with comprehensive error catching
    const ActualRegister = require('./Register').default;
    
    // Wrap in additional error boundary for runtime errors
    class RegisterErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        console.error('Register component error boundary caught:', error);
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        console.error('Register component error details:', { error, errorInfo });
      }

      render() {
        if (this.state.hasError) {
          return <RegisterFallback />;
        }

        try {
          return <ActualRegister {...this.props} />;
        } catch (error) {
          console.error('Register render error:', error);
          return <RegisterFallback />;
        }
      }
    }

    return <RegisterErrorBoundary {...props} />;
    
  } catch (importError) {
    console.error('Error importing Register component on web:', importError);
    return <RegisterFallback />;
  }
};

export default RegisterWebSafe;