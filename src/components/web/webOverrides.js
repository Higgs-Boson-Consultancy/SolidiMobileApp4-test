// Web-specific override for critical AppState initialization functions
// This helps debug issues with mobile-specific APIs on web

console.log('🌐 Loading AppState web overrides...');

// Override console to track async operations  
const originalError = console.error;
console.error = function(...args) {
  originalError.apply(console, args);
  // Track keychain and other mobile API errors
  const message = args.join(' ');
  if (message.includes('Keychain') || message.includes('keychain')) {
    console.log('🔑 KEYCHAIN ERROR DETECTED:', message);
  }
  if (message.includes('DNS') || message.includes('dns')) {
    console.log('🌐 DNS ERROR DETECTED:', message);  
  }
  if (message.includes('PinCode') || message.includes('pincode')) {
    console.log('📱 PINCODE ERROR DETECTED:', message);
  }
};

// Track promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
  // Prevent the default handling (which might cause the app to hang)
  event.preventDefault();
});

console.log('✅ AppState web overrides loaded');