// Stub for react-native-permissions

export const check = (permission) => {
  console.warn('Permissions.check: Using web stub - always returns GRANTED');
  return Promise.resolve(RESULTS.GRANTED);
};

export const request = (permission) => {
  console.warn('Permissions.request: Using web stub - always returns GRANTED');
  return Promise.resolve(RESULTS.GRANTED);
};

export const openSettings = () => {
  console.warn('Permissions.openSettings: Using web stub');
  return Promise.resolve();
};

export const PERMISSIONS = {
  IOS: {
    CAMERA: 'ios.permission.CAMERA',
    MICROPHONE: 'ios.permission.MICROPHONE',
    PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY',
  },
  ANDROID: {
    CAMERA: 'android.permission.CAMERA',
    RECORD_AUDIO: 'android.permission.RECORD_AUDIO',
    READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
    WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE',
  }
};

export const RESULTS = {
  UNAVAILABLE: 'unavailable',
  DENIED: 'denied',
  LIMITED: 'limited',
  GRANTED: 'granted',
  BLOCKED: 'blocked',
};

export default {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
};