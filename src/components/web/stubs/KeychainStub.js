// Stub for react-native-keychain

export const setInternetCredentials = (server, username, password, options = {}) => {
  console.warn('Keychain.setInternetCredentials: Using web stub - saving to localStorage');
  try {
    localStorage.setItem(`keychain_${server}`, JSON.stringify({ username, password }));
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getInternetCredentials = (server) => {
  console.warn('Keychain.getInternetCredentials: Using web stub - reading from localStorage');
  try {
    const stored = localStorage.getItem(`keychain_${server}`);
    if (stored) {
      const { username, password } = JSON.parse(stored);
      return Promise.resolve({ username, password });
    }
    return Promise.resolve(false);
  } catch (error) {
    return Promise.resolve(false);
  }
};

export const resetInternetCredentials = (server) => {
  console.warn('Keychain.resetInternetCredentials: Using web stub - removing from localStorage');
  try {
    localStorage.removeItem(`keychain_${server}`);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const setGenericPassword = (username, password, options = {}) => {
  console.warn('Keychain.setGenericPassword: Using web stub - saving to localStorage');
  try {
    localStorage.setItem('keychain_generic', JSON.stringify({ username, password }));
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getGenericPassword = (options = {}) => {
  console.warn('Keychain.getGenericPassword: Using web stub - reading from localStorage');
  try {
    const stored = localStorage.getItem('keychain_generic');
    if (stored) {
      const { username, password } = JSON.parse(stored);
      return Promise.resolve({ username, password });
    }
    return Promise.resolve(false);
  } catch (error) {
    return Promise.resolve(false);
  }
};

export const resetGenericPassword = (options = {}) => {
  console.warn('Keychain.resetGenericPassword: Using web stub - removing from localStorage');
  try {
    localStorage.removeItem('keychain_generic');
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export default {
  setInternetCredentials,
  getInternetCredentials,
  resetInternetCredentials,
  setGenericPassword,
  getGenericPassword,
  resetGenericPassword,
};