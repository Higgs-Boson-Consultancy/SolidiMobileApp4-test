// Stub for react-native-dropdown-picker
import React from 'react';
import { View, Text } from 'react-native';

const DropDownPicker = ({ placeholder = 'Select option...', style, ...props }) => (
  <View style={[{
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    minHeight: 48,
    justifyContent: 'center'
  }, style]}>
    <Text style={{ color: '#666' }}>{placeholder}</Text>
  </View>
);

export default DropDownPicker;