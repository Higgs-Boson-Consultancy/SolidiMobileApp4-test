// Stub for react-native-easy-grid
import React from 'react';
import { View } from 'react-native';

export const Grid = ({ children, style, ...props }) => (
  <View style={[{ flexDirection: 'column' }, style]} {...props}>
    {children}
  </View>
);

export const Row = ({ children, style, ...props }) => (
  <View style={[{ flexDirection: 'row' }, style]} {...props}>
    {children}
  </View>
);

export const Col = ({ children, style, size, ...props }) => (
  <View style={[{ 
    flex: size ? size / 12 : 1,
    flexDirection: 'column' 
  }, style]} {...props}>
    {children}
  </View>
);

export default { Grid, Row, Col };