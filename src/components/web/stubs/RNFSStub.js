// Stub for react-native-fs

export const DocumentDirectoryPath = '/documents';
export const CachesDirectoryPath = '/cache';
export const TemporaryDirectoryPath = '/tmp';

export const writeFile = (filepath, contents, encoding = 'utf8') => {
  console.warn('RNFS.writeFile: Using web stub - file will not be saved');
  return Promise.resolve();
};

export const readFile = (filepath, encoding = 'utf8') => {
  console.warn('RNFS.readFile: Using web stub - returning empty content');
  return Promise.resolve('');
};

export const exists = (filepath) => {
  console.warn('RNFS.exists: Using web stub - always returns false');
  return Promise.resolve(false);
};

export const mkdir = (filepath, options = {}) => {
  console.warn('RNFS.mkdir: Using web stub');
  return Promise.resolve();
};

export const copyFile = (from, to) => {
  console.warn('RNFS.copyFile: Using web stub');
  return Promise.resolve();
};

export const moveFile = (from, to) => {
  console.warn('RNFS.moveFile: Using web stub');
  return Promise.resolve();
};

export const unlink = (filepath) => {
  console.warn('RNFS.unlink: Using web stub');
  return Promise.resolve();
};

export const stat = (filepath) => {
  console.warn('RNFS.stat: Using web stub');
  return Promise.resolve({
    isFile: () => true,
    isDirectory: () => false,
    size: 0,
    mtime: new Date(),
    ctime: new Date(),
  });
};

export default {
  DocumentDirectoryPath,
  CachesDirectoryPath,
  TemporaryDirectoryPath,
  writeFile,
  readFile,
  exists,
  mkdir,
  copyFile,
  moveFile,
  unlink,
  stat,
};