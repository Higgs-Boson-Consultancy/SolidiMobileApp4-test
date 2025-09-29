// Stub for @react-native-async-storage/async-storage

const AsyncStorage = {
  getItem: (key) => {
    console.warn(`AsyncStorage.getItem: Using web stub for key: ${key}`);
    try {
      const value = localStorage.getItem(key);
      return Promise.resolve(value);
    } catch (error) {
      return Promise.resolve(null);
    }
  },

  setItem: (key, value) => {
    console.warn(`AsyncStorage.setItem: Using web stub for key: ${key}`);
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  removeItem: (key) => {
    console.warn(`AsyncStorage.removeItem: Using web stub for key: ${key}`);
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  multiGet: (keys) => {
    console.warn(`AsyncStorage.multiGet: Using web stub for keys: ${keys}`);
    try {
      const result = keys.map(key => [key, localStorage.getItem(key)]);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  multiSet: (keyValuePairs) => {
    console.warn(`AsyncStorage.multiSet: Using web stub`);
    try {
      keyValuePairs.forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  multiRemove: (keys) => {
    console.warn(`AsyncStorage.multiRemove: Using web stub for keys: ${keys}`);
    try {
      keys.forEach(key => {
        localStorage.removeItem(key);
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  clear: () => {
    console.warn(`AsyncStorage.clear: Using web stub`);
    try {
      localStorage.clear();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  getAllKeys: () => {
    console.warn(`AsyncStorage.getAllKeys: Using web stub`);
    try {
      const keys = Object.keys(localStorage);
      return Promise.resolve(keys);
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

export default AsyncStorage;