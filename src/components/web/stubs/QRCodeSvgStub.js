// Stub for react-native-qrcode-svg
import React from 'react';
import { View, Text } from 'react-native';

const QRCode = ({ value, size = 100, style, ...props }) => (
  <View style={[{
    width: size,
    height: size,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  }, style]}>
    <Text style={{ fontSize: 20 }}>📱</Text>
    <Text style={{ fontSize: 10, color: '#666', marginTop: 4 }}>QR Code</Text>
  </View>
);

export default QRCode;