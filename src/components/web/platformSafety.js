// Web Platform Safety Wrapper for AppState
// This provides safe fallbacks for mobile-specific operations on web

import { Platform } from 'react-native';

console.log('🌐 Loading AppState platform safety wrapper...');

// Safe async wrapper that prevents hanging promises
export const safeAsyncOperation = async (operation, fallbackValue = null, operationName = 'unknown') => {
  if (Platform.OS !== 'web') {
    return operation();
  }

  // For web platform, wrap with timeout and better error handling
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      console.warn(`⚠️ Safe async timeout: ${operationName} took too long on web, using fallback`);
      resolve(fallbackValue);
    }, 5000); // 5 second timeout

    Promise.resolve(operation())
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.warn(`⚠️ Safe async error in ${operationName}:`, error);
        console.warn(`Using fallback value:`, fallbackValue);
        resolve(fallbackValue);
      });
  });
};

// Safe BackHandler for web
export const safeBackHandler = {
  addEventListener: (eventName, handler) => {
    if (Platform.OS === 'web') {
      console.warn('BackHandler.addEventListener: Not available on web, skipping');
      // Return a mock subscription object
      return {
        remove: () => console.warn('BackHandler.remove: Not available on web')
      };
    }
    const BackHandler = require('react-native').BackHandler;
    return BackHandler.addEventListener(eventName, handler);
  },
  
  exitApp: () => {
    if (Platform.OS === 'web') {
      console.warn('BackHandler.exitApp: Not available on web, will close window instead');
      window.close();
      return;
    }
    const BackHandler = require('react-native').BackHandler;
    return BackHandler.exitApp();
  }
};

// Safe keychain operations
export const safeKeychain = {
  getInternetCredentials: async (server) => {
    const operation = async () => {
      const Keychain = await import('react-native-keychain');
      return Keychain.getInternetCredentials(server);
    };
    return safeAsyncOperation(operation, false, `Keychain.getInternetCredentials(${server})`);
  },
  
  setInternetCredentials: async (server, username, password) => {
    const operation = async () => {
      const Keychain = await import('react-native-keychain');
      return Keychain.setInternetCredentials(server, username, password);
    };
    return safeAsyncOperation(operation, true, `Keychain.setInternetCredentials(${server})`);
  },
  
  resetInternetCredentials: async (server) => {
    const operation = async () => {
      const Keychain = await import('react-native-keychain');
      return Keychain.resetInternetCredentials(server);
    };
    return safeAsyncOperation(operation, true, `Keychain.resetInternetCredentials(${server})`);
  }
};

// Safe DNS lookup
export const safeDNSLookup = {
  getIpAddressesForHostname: async (hostname) => {
    const operation = async () => {
      const dns = await import('react-native-dns-lookup');
      return dns.getIpAddressesForHostname(hostname);
    };
    return safeAsyncOperation(operation, [], `DNS.getIpAddressesForHostname(${hostname})`);
  }
};

// Safe PIN code operations
export const safePinCode = {
  deleteUserPinCode: async (appName) => {
    const operation = async () => {
      const pincode = await import('@haskkor/react-native-pincode');
      return pincode.deleteUserPinCode(appName);
    };
    return safeAsyncOperation(operation, true, `PinCode.deleteUserPinCode(${appName})`);
  }
};

console.log('✅ AppState platform safety wrapper loaded');

export default {
  safeAsyncOperation,
  safeBackHandler,
  safeKeychain,
  safeDNSLookup,
  safePinCode
};