import React from 'react';
import { AppRegistry, View, Text, StyleSheet, Platform } from 'react-native';

console.log('🚀 Starting minimal app...');
console.log('Platform:', Platform.OS);

const MinimalApp = () => {
  console.log('🎯 MinimalApp component rendering...');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 React Native Web Working!</Text>
      <Text style={styles.subtitle}>Platform: {Platform.OS}</Text>
      <Text style={styles.info}>
        If you can see this, React Native Web is working correctly.
      </Text>
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>Debug Info:</Text>
        <Text style={styles.debugText}>• React Native Web: ✅</Text>
        <Text style={styles.debugText}>• Platform Detection: ✅</Text>
        <Text style={styles.debugText}>• Component Rendering: ✅</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: 400,
    lineHeight: 24,
  },
  debugInfo: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  debugText: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 5,
  },
});

console.log('📱 Registering MinimalApp...');

AppRegistry.registerComponent('SolidiMobileApp4', () => MinimalApp);

if (Platform.OS === 'web') {
  console.log('🌐 Running on web platform');
  const appName = 'SolidiMobileApp4';
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('📄 DOM ready, running app...');
      AppRegistry.runApplication(appName, {
        rootTag: document.getElementById('react-app'),
      });
    });
  } else {
    console.log('📄 DOM already ready, running app...');
    AppRegistry.runApplication(appName, {
      rootTag: document.getElementById('react-app'),
    });
  }
}

console.log('✅ Minimal app setup complete');