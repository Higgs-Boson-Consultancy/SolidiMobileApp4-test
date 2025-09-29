// Stub for @haskkor/react-native-pincode library for web compatibility
import React from 'react';
import { View, Text } from 'react-native';

// Mock constants that the library expects
const APPLICATION_PASSWORD = 'APPLICATION_PASSWORD';
const DELETE_APPLICATION_PASSWORD = 'DELETE_APPLICATION_PASSWORD';

// Simple stub component that shows the PIN feature is not available on web
const PincodeStub = ({ children, ...props }) => {
  return (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        PIN Code feature is not available on web
      </Text>
      <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
        This feature is designed for mobile devices only. 
        Use the mobile app for PIN code functionality.
      </Text>
      {children}
    </View>
  );
};

// Export all the components that the PIN library would normally export
export default PincodeStub;
export const PinCodeComponent = PincodeStub;
export const ApplicationLocked = PincodeStub;
export const PinCodeEnter = PincodeStub;
export const PinCodeChoose = PincodeStub;

// Export utility functions as no-ops
export const hasUserSetPinCode = () => Promise.resolve(false);
export const deleteUserPinCode = () => Promise.resolve();
export const resetInternalStates = () => {};

// Export any constants the library might export
export { APPLICATION_PASSWORD, DELETE_APPLICATION_PASSWORD };