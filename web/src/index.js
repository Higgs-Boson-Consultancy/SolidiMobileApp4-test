import React from 'react';
import { AppRegistry } from 'react-native';
import SolidiWebApp from './SolidiWebApp';
import { AppStateProvider } from './context/AppState.web';

// Wrap app with AppStateProvider
const AppWithProvider = () => (
  <AppStateProvider>
    <SolidiWebApp />
  </AppStateProvider>
);

// Register the app for web
AppRegistry.registerComponent('SolidiMobileApp4', () => AppWithProvider);

// Run the app
AppRegistry.runApplication('SolidiMobileApp4', {
  rootTag: document.getElementById('root'),
});
