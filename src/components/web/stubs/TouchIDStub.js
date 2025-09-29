// Stub for react-native-touch-id

export const isSupported = () => {
  console.warn('TouchID.isSupported: Using web stub - always returns false');
  return Promise.resolve(false);
};

export const authenticate = (reason, config = {}) => {
  console.warn('TouchID.authenticate: Using web stub - not supported on web');
  return Promise.reject(new Error('TouchID not supported on web'));
};

export default {
  isSupported,
  authenticate,
};