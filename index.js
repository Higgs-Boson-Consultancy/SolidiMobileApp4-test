import {AppRegistry} from 'react-native';
import ApplicationRoot from './src/application';
import {name as appName} from './app.json';

// Disable React Native Inspector to prevent FlatList getItem errors
if (__DEV__) {
  // Simple console disabling
  console.disableYellowBox = true;
  
  // Disable LogBox and NativeEventEmitter warnings
  try {
    const {LogBox} = require('react-native');
    if (LogBox) {
      LogBox.ignoreAllLogs(true);
      // Specifically ignore NativeEventEmitter warnings
      LogBox.ignoreLogs([
        'new NativeEventEmitter',
        'Invariant Violation: "new NativeEventEmitter()" requires a non-null argument',
        'NativeEventEmitter was called with a non-null argument'
      ]);
    }
  } catch (e) {
    // LogBox not available
  }
}

AppRegistry.registerComponent(appName, () => ApplicationRoot);
