// Stub for react-native-document-picker

export const pick = (options = {}) => {
  console.warn('DocumentPicker.pick: Using web stub');
  
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = options.allowMultiSelection || false;
    
    if (options.type) {
      const typeMap = {
        allFiles: '*/*',
        images: 'image/*',
        pdf: 'application/pdf',
        plainText: 'text/plain',
        zip: 'application/zip',
      };
      input.accept = typeMap[options.type] || options.type;
    }

    input.onchange = (event) => {
      const files = Array.from(event.target.files);
      
      if (files.length === 0) {
        reject(new Error('User cancelled document picker'));
        return;
      }

      const results = files.map(file => ({
        uri: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
        size: file.size,
        fileCopyUri: URL.createObjectURL(file),
      }));

      resolve(options.allowMultiSelection ? results : results[0]);
    };

    input.click();
  });
};

export const pickSingle = (options = {}) => {
  return pick({ ...options, allowMultiSelection: false });
};

export const pickMultiple = (options = {}) => {
  return pick({ ...options, allowMultiSelection: true });
};

export const types = {
  allFiles: 'allFiles',
  images: 'images',
  pdf: 'pdf',
  plainText: 'plainText',
  zip: 'zip',
};

export default {
  pick,
  pickSingle,
  pickMultiple,
  types,
};