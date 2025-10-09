// Web-compatible wrappers for react-native-paper components
// This prevents WeakMap errors on web by providing safe fallbacks

import React from 'react';
import { Platform, View, Text as RNText, TouchableOpacity, TextInput as RNTextInput } from 'react-native';

console.log('🌐 Loading react-native-paper web compatibility layer...');

// Safe wrapper function that prevents WeakMap errors
const createWebSafeComponent = (ComponentName, fallbackComponent) => {
  if (Platform.OS !== 'web') {
    // On mobile, try to use the original component
    try {
      const originalPaper = require('react-native-paper');
      return originalPaper[ComponentName] || fallbackComponent;
    } catch (error) {
      console.warn(`Failed to load react-native-paper.${ComponentName}, using fallback:`, error);
      return fallbackComponent;
    }
  } else {
    // On web, always use the fallback to avoid WeakMap errors
    console.log(`🌐 Using web fallback for react-native-paper.${ComponentName}`);
    return fallbackComponent;
  }
};

// Create web-safe fallback components
const WebText = ({ children, style, ...props }) => (
  <RNText style={[{ fontSize: 16, color: '#000' }, style]} {...props}>
    {children}
  </RNText>
);

const WebTextInput = ({ label, value, onChangeText, style, mode, ...props }) => (
    <View style={[{ marginBottom: 8 }, style]} {...props}>
    {label && <RNText style={{ fontSize: 14, marginBottom: 4, color: '#666' }}>{label}</RNText>}
    <RNTextInput
      value={value}
      onChangeText={onChangeText}
      style={[{
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff'
      }, style]}
      {...props}
    />
  </View>
);

const WebButton = ({ children, onPress, mode = 'contained', style, ...props }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[{
      backgroundColor: mode === 'contained' ? '#6200ea' : 'transparent',
      borderWidth: mode === 'outlined' ? 1 : 0,
      borderColor: '#6200ea',
      borderRadius: 4,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      marginVertical: 4
    }, style]}
    {...props}
  >
    <RNText style={{ 
      color: mode === 'contained' ? '#fff' : '#6200ea',
      fontSize: 16,
      fontWeight: '500'
    }}>
      {children}
    </RNText>
  </TouchableOpacity>
);

const WebCheckbox = ({ status, onPress, ...props }) => (
  <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View style={{
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: '#6200ea',
      borderRadius: 3,
      marginRight: 8,
      backgroundColor: status === 'checked' ? '#6200ea' : 'transparent',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {status === 'checked' && <RNText style={{ color: '#fff', fontSize: 12 }}>✓</RNText>}
    </View>
  </TouchableOpacity>
);

const WebRadioButton = ({ value, status, onPress, ...props }) => (
  <TouchableOpacity onPress={() => onPress(value)} style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View style={{
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: '#6200ea',
      borderRadius: 10,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {status === 'checked' && (
        <View style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: '#6200ea'
        }} />
      )}
    </View>
  </TouchableOpacity>
);

const WebCard = ({ children, style, ...props }) => (
  <View style={[{
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  }, style]} {...props}>
    {children}
  </View>
);

// Add Card.Content support
const WebCardContent = ({ children, style, ...props }) => (
  <View style={[{ padding: 8 }, style]} {...props}>
    {children}
  </View>
);

// Attach Content as a property to WebCard
WebCard.Content = WebCardContent;

const WebTitle = ({ children, style, ...props }) => (
  <RNText style={[{ fontSize: 20, fontWeight: 'bold', marginVertical: 8 }, style]} {...props}>
    {children}
  </RNText>
);

const WebHelperText = ({ children, type = 'info', style, ...props }) => (
  <RNText style={[{
    fontSize: 12,
    color: type === 'error' ? '#f44336' : '#666',
    marginTop: 4
  }, style]} {...props}>
    {children}
  </RNText>
);

// Create web-safe exports
export const Text = createWebSafeComponent('Text', WebText);
export const TextInput = createWebSafeComponent('TextInput', WebTextInput);
export const Button = createWebSafeComponent('Button', WebButton);
export const Checkbox = createWebSafeComponent('Checkbox', WebCheckbox);
export const RadioButton = createWebSafeComponent('RadioButton', { Item: WebRadioButton });

// Special handling for Card to preserve Card.Content
export const Card = createWebSafeComponent('Card', WebCard);
// Ensure Card.Content is available
if (!Card.Content) {
  Card.Content = WebCardContent;
}

export const Title = createWebSafeComponent('Title', WebTitle);
export const HelperText = createWebSafeComponent('HelperText', WebHelperText);

// Mock theme hook
export const useTheme = () => ({
  colors: {
    primary: '#6200ea',
    background: '#fff',
    surface: '#fff',
    error: '#f44336',
    text: '#000',
    onSurface: '#000',
    placeholder: '#666'
  }
});

// Web-compatible PaperProvider
const WebPaperProvider = ({ children, theme, ...props }) => {
  console.log('🌐 Using web PaperProvider fallback');
  return React.createElement(View, { style: { flex: 1 }, ...props }, children);
};

export const PaperProvider = createWebSafeComponent('PaperProvider', WebPaperProvider);

console.log('✅ react-native-paper web compatibility layer loaded');