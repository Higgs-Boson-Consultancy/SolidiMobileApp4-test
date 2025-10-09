// Web-specific AppState initialization override
// This bypasses mobile-specific operations that can hang the web app

import { Platform } from 'react-native';

console.log('🌐 Loading web AppState initialization override...');

// Only apply overrides on web platform
if (Platform.OS === 'web') {
  
  // Store original functions before they're overridden
  let originalSetTimeout = window.setTimeout;
  let originalSetInterval = window.setInterval;
  
  // Enhanced console logging for debugging
  const webLog = (message, ...args) => {
    console.log(`[WEB-APPSTATE] ${message}`, ...args);
  };
  
  webLog('Applying web-specific AppState overrides...');
  
  // Override setTimeout and setInterval to track what's being set
  window.setTimeout = function(callback, delay, ...args) {
    webLog(`Setting timeout: ${delay}ms`);
    return originalSetTimeout.call(this, callback, delay, ...args);
  };
  
  window.setInterval = function(callback, delay, ...args) {
    webLog(`Setting interval: ${delay}ms`);
    return originalSetInterval.call(this, callback, delay, ...args);
  };
  
  // Global promise rejection handler to prevent hanging
  window.addEventListener('unhandledrejection', event => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    webLog('Promise rejection details:', {
      reason: event.reason,
      promise: event.promise
    });
    
    // Prevent the default handling that might cause hanging
    event.preventDefault();
    
    // Try to continue execution
    console.log('🔄 Continuing execution despite promise rejection...');
  });
  
  // Global error handler
  window.addEventListener('error', event => {
    console.error('🚨 Global error:', event.error);
    webLog('Error details:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });
  
  webLog('Web overrides applied successfully');
  
} else {
  console.log('Not web platform, skipping web overrides');
}

export default {};