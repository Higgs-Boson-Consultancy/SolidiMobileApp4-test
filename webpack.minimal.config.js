const path = require('path');

module.exports = {
  mode: 'development',
  entry: './web/minimal.js',
  
  output: {
    path: path.resolve(__dirname, 'web'),
    filename: 'minimal.bundle.js',
    publicPath: '/',
  },

  resolve: {
    alias: {
      'react-native$': 'react-native-web',
    },
    extensions: ['.web.js', '.js', '.jsx', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      }
    ]
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'web'),
    },
    port: 3001,
    open: false,
    hot: true,
  },

  stats: {
    errorDetails: true,
    warnings: true,
  }
};