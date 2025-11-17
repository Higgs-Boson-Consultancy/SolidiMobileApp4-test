const { override, addBabelPlugins, addWebpackAlias, babelInclude } = require('customize-cra');
const path = require('path');

module.exports = override(
  // Add babel plugin for react-native-web
  ...addBabelPlugins('react-native-web'),
  
  // Include parent src directory in Babel processing
  babelInclude([
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, '../src'),
  ]),
  
  // Add webpack aliases
  addWebpackAlias({
    'react-native': 'react-native-web',
    'react-native-linear-gradient': 'react-native-web-linear-gradient',
    // Alias to shared src folder
    'src': path.resolve(__dirname, '../src'),
  }),
  
  // Custom webpack config
  (config) => {
    // Allow importing from parent directory
    config.resolve.plugins = config.resolve.plugins.filter(
      plugin => plugin.constructor.name !== 'ModuleScopePlugin'
    );
    
    // Add .web.js extension resolution
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    
    // Fix for AsyncStorage module resolution with React 19
    // This fixes the "BREAKING CHANGE: The request './AsyncStorage' failed to resolve" error
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });
    
    // Add fallbacks for Node.js core modules (webpack 5)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      path: require.resolve('path-browserify'),
      fs: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
    };
    
    // Exclude react-native-fs from web build
    config.module.rules.push({
      test: /react-native-fs/,
      use: 'null-loader'
    });
    
    return config;
  }
);
