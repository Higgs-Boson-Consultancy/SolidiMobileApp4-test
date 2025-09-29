// Stub for react-native-image-picker

export const launchCamera = (options, callback) => {
  console.warn('launchCamera: Using web stub - use file input instead');
  const error = { message: 'Camera not available on web' };
  if (callback) callback(error);
  return Promise.reject(error);
};

export const launchImageLibrary = (options, callback) => {
  console.warn('launchImageLibrary: Using web stub - use file input instead');
  
  // Create a simple file input for basic functionality
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = options?.selectionLimit > 1;
  
  input.onchange = (event) => {
    const files = Array.from(event.target.files);
    const result = {
      assets: files.map(file => ({
        uri: URL.createObjectURL(file),
        type: file.type,
        fileName: file.name,
        fileSize: file.size,
      })),
      didCancel: false,
    };
    
    if (callback) callback(null, result);
  };
  
  input.onclick = () => {
    if (callback) callback({ message: 'User cancelled' });
  };
  
  input.click();
  
  return Promise.resolve();
};

export const MediaType = {
  photo: 'photo',
  video: 'video',
  mixed: 'mixed',
};

export default {
  launchCamera,
  launchImageLibrary,
  MediaType,
};