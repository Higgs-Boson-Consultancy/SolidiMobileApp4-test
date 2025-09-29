import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

// Stub for react-native-payments
export class PaymentRequest {
  constructor(methodData, details, options = {}) {
    this.methodData = methodData;
    this.details = details;
    this.options = options;
  }

  async canMakePayment() {
    console.log('PaymentRequest.canMakePayment() - Web stub');
    return false; // Always return false on web
  }

  async show() {
    console.log('PaymentRequest.show() - Web stub');
    Alert.alert('Payment Not Available', 'Payment features are only available in the mobile app');
    throw new Error('Payment not supported on web platform');
  }

  addEventListener(event, handler) {
    console.log(`PaymentRequest.addEventListener(${event}) - Web stub`);
  }

  removeEventListener(event, handler) {
    console.log(`PaymentRequest.removeEventListener(${event}) - Web stub`);
  }

  abort() {
    console.log('PaymentRequest.abort() - Web stub');
    return Promise.resolve();
  }
}

// Payment method constants
export const SUPPORTED_METHOD_NAMES = {
  APPLE_PAY: 'https://apple.com/apple-pay',
  ANDROID_PAY: 'https://android.com/pay',
  BASIC_CARD: 'basic-card'
};

// Helper functions
export function canMakePayments() {
  console.log('canMakePayments() - Web stub');
  return Promise.resolve(false);
}

// Component for payment button
export function PaymentButton({ onPress, children, ...props }) {
  const handlePress = () => {
    Alert.alert('Payment Not Available', 'Payment features are only available in the mobile app');
  };

  return (
    <TouchableOpacity onPress={handlePress} {...props}>
      <View style={{ padding: 15, backgroundColor: '#ccc', borderRadius: 8 }}>
        <Text style={{ textAlign: 'center', color: '#666' }}>
          {children || 'Payment (Mobile Only)'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default PaymentRequest;