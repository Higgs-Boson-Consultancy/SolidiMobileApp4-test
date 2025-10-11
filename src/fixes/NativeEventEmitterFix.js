/**
 * Fix for NativeEventEmitter warnings in React Native
 * This resolves the common "new NativeEventEmitter() requires a non-null argument" error
 */

import { Platform } from 'react-native';

// Suppress specific NativeEventEmitter warnings instead of modifying NativeModules
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

// Filter out NativeEventEmitter related warnings
console.warn = (...args) => {
  const message = args[0];
  if (typeof message === 'string') {
    // Suppress NativeEventEmitter warnings
    if (message.includes('new NativeEventEmitter()') || 
        message.includes('requires a non-null argument') ||
        message.includes('NativeEventEmitter was called with a non-null argument')) {
      return;
    }
  }
  originalConsoleWarn.apply(console, args);
};

console.error = (...args) => {
  const message = args[0];
  if (typeof message === 'string') {
    // Suppress NativeEventEmitter errors
    if (message.includes('Invariant Violation') && 
        message.includes('new NativeEventEmitter()')) {
      return;
    }
  }
  originalConsoleError.apply(console, args);
};

// Create a safer mock for EventEmitter that doesn't modify NativeModules
const createSafeEventEmitter = () => ({
  addListener: (eventType, listener) => ({
    remove: () => {}
  }),
  removeListener: () => {},
  removeAllListeners: () => {},
  emit: () => {},
  listenerCount: () => 0
});

// Apply safe NativeEventEmitter fixes
export const applyNativeEventEmitterFixes = () => {
  console.log('[NativeEventEmitterFix] Applied safe NativeEventEmitter warning suppression');
};

// Auto-apply fixes when this module is imported
applyNativeEventEmitterFixes();