import { AppRegistry, Platform } from 'react-native';
import ApplicationRoot from '../src/application';
import { name as appName } from '../app.json';

// Configure the app for web
console.log('🌐 Starting Solidi Web Application...');
console.log('Platform:', Platform.OS);
console.log('App Name:', appName);

// Register the app component
AppRegistry.registerComponent(appName, () => ApplicationRoot);

// Handle web-specific initialization
const initializeWebApp = () => {
  // Set up global error handling for web
  window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
    // You could send this to your error tracking service
  });

  // Set up web-specific console logging
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Development mode - enhanced logging enabled');
  }

  // Initialize web app
  const rootTag = document.getElementById('root');
  if (rootTag) {
    AppRegistry.runApplication(appName, {
      initialProps: {},
      rootTag: rootTag,
    });
    console.log('✅ Web app initialized successfully');
  } else {
    console.error('❌ Could not find root element');
  }
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWebApp);
} else {
  initializeWebApp();
}

// Hot module replacement for development
if (module.hot) {
  module.hot.accept();
}