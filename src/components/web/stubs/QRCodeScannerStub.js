// Stub for react-native-qrcode-scanner
import React from 'react';
import { View, Text } from 'react-native';

export default function QRCodeScanner({ onRead, style, ...props }) {
  console.warn('QRCodeScanner: Using web stub - real functionality not available');
  
  return (
    <View style={[{ padding: 20, alignItems: 'center', backgroundColor: '#f0f0f0' }, style]}>
      <Text>📱 QR Scanner (Web Stub)</Text>
      <Text style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
        Use mobile app for QR scanning
      </Text>
    </View>
  );
}

// Export other common QRCodeScanner exports
export const RNCamera = () => null;
export { QRCodeScanner };