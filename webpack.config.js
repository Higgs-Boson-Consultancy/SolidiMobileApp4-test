const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './web/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
    chunkFilename: isDevelopment ? '[name].chunk.js' : '[name].[contenthash].chunk.js',
    publicPath: '/',
    clean: true,
  },

  resolve: {
    // React Native Web configuration
    alias: {
      'react-native$': 'react-native-web',
      // Map source directory for easier imports
      'src': path.resolve(__dirname, 'src'),
      // React Native Paper web compatibility layer to prevent WeakMap errors
      'react-native-paper': path.resolve(__dirname, 'src/components/web/react-native-paper-web.js'),
      // Mobile-only library stubs for web compatibility
      'react-native-qrcode-scanner': path.resolve(__dirname, 'src/components/web/stubs/QRCodeScannerStub.js'),
      'react-native-image-picker': path.resolve(__dirname, 'src/components/web/stubs/ImagePickerStub.js'),
      'react-native-document-picker': path.resolve(__dirname, 'src/components/web/stubs/DocumentPickerStub.js'),
      'react-native-fs': path.resolve(__dirname, 'src/components/web/stubs/RNFSStub.js'),
      'react-native-splash-screen': path.resolve(__dirname, 'src/components/web/stubs/SplashScreenStub.js'),
      'react-native-permissions': path.resolve(__dirname, 'src/components/web/stubs/PermissionsStub.js'),
      'react-native-touch-id': path.resolve(__dirname, 'src/components/web/stubs/TouchIDStub.js'),
      'react-native-keychain': path.resolve(__dirname, 'src/components/web/stubs/KeychainStub.js'),
      // Chart and UI component stubs
      'react-native-chart-kit': path.resolve(__dirname, 'src/components/web/stubs/ChartKitStub.js'),
      'react-native-progress': path.resolve(__dirname, 'src/components/web/stubs/ProgressStub.js'),
      'react-native-dropdown-picker': path.resolve(__dirname, 'src/components/web/stubs/DropDownPickerStub.js'),
      'react-native-easy-grid': path.resolve(__dirname, 'src/components/web/stubs/GridStub.js'),
      'react-native-keyboard-aware-scroll-view': path.resolve(__dirname, 'src/components/web/stubs/KeyboardAwareStub.js'),
      'react-native-qrcode-svg': path.resolve(__dirname, 'src/components/web/stubs/QRCodeSvgStub.js'),
      // React Native core module stubs
      'react-native/Libraries/Animated/Easing': path.resolve(__dirname, 'src/components/web/stubs/EasingStub.js'),
      
      // Vector icons aliases - comprehensive approach
      'react-native-vector-icons$': path.resolve(__dirname, 'src/components/web/stubs/VectorIconsStub.js'),
      'react-native-vector-icons/FontAwesome$': path.resolve(__dirname, 'src/components/web/stubs/VectorIconsStub.js'),
      'react-native-vector-icons/MaterialIcons$': path.resolve(__dirname, 'src/components/web/stubs/VectorIconsStub.js'),
      'react-native-vector-icons/MaterialCommunityIcons$': path.resolve(__dirname, 'src/components/web/stubs/VectorIconsStub.js'),
      'react-native-vector-icons/Ionicons$': path.resolve(__dirname, 'src/components/web/stubs/VectorIconsStub.js'),
      'react-native-vector-icons/Feather$': path.resolve(__dirname, 'src/components/web/stubs/VectorIconsStub.js'),
      'react-native-vector-icons/AntDesign$': path.resolve(__dirname, 'src/components/web/stubs/VectorIconsStub.js'),
      
      // Payments stub
      'react-native-payments': path.resolve(__dirname, 'src/components/web/stubs/PaymentsStub.js'),
      
      // AsyncStorage stub
      '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/components/web/stubs/AsyncStorageStub.js'),
      
      // DNS lookup stub
      'react-native-dns-lookup': path.resolve(__dirname, 'src/components/web/stubs/DNSLookupStub.js'),
      
      // PIN code library stub
      '@haskkor/react-native-pincode': path.resolve(__dirname, 'src/components/web/stubs/ReactNativePincode.js'),
    },
    extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.jsx', '.jsx', '.web.tsx', '.tsx', '.json'],
    fallback: {
      // Node.js polyfills for browser
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer"),
      "stream": require.resolve("stream-browserify"),
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "process": require.resolve("process/browser"),
    },
  },

  module: {
    rules: [
      // JavaScript and TypeScript
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: [
          /node_modules\/(?!(react-native-web|@react-native\/|react-native-paper)\/).*/,
          /node_modules\/@haskkor\/react-native-pincode/,
          /node_modules\/react-native-chart-kit/,
          /node_modules\/react-native-progress/,
          /node_modules\/react-native-dropdown-picker/,
          /node_modules\/react-native-easy-grid/,
          /node_modules\/react-native-keyboard-aware-scroll-view/,
          /node_modules\/react-native-qrcode-svg/,
          /node_modules\/react-native-payments/,
          /node_modules\/react-native-vector-icons/,
          /node_modules\/@react-native-async-storage/,
          /node_modules\/react-native\/Libraries\/Animated\/Easing\.js/
        ],
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            envName: 'web',
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['last 2 versions', 'ie >= 11']
                },
                modules: false,
              }],
              '@babel/preset-react',
              ['@babel/preset-typescript', { allowNamespaces: true }],
            ],
            plugins: [
              ['@babel/plugin-transform-class-properties', { loose: true }],
              ['@babel/plugin-transform-private-methods', { loose: true }],
              ['@babel/plugin-transform-private-property-in-object', { loose: true }],
              '@babel/plugin-proposal-object-rest-spread',
              ['@babel/plugin-transform-runtime', {
                helpers: true,
                regenerator: true,
              }],
            ],
          },
        },
      },
      
      // Images
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash][ext]'
        }
      },
      
      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]'
        }
      },
      
      // CSS
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './web/index.html',
      minify: !isDevelopment,
    }),
    
    // Define global variables
    new (require('webpack').DefinePlugin)({
      __DEV__: JSON.stringify(isDevelopment),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    
    // Provide Node.js globals to browser
    new (require('webpack').ProvidePlugin)({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    
    // Copy static files
    new (require('copy-webpack-plugin'))({
      patterns: [
        { from: 'web/manifest.json', to: 'manifest.json' },
        { from: 'web/sw.js', to: 'sw.js' },
        { from: 'web/public', to: '.', noErrorOnMissing: true },
      ],
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-native-web)[\\/]/,
          name: 'react',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: 'single',
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    host: '0.0.0.0',
    historyApiFallback: true,
    hot: true,
    open: true,
    compress: true,
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    // Proxy API calls to avoid CORS issues
    proxy: [
      {
        context: ['/api2', '/v1'],
        target: 'https://t2.solidi.co',
        secure: true,
        changeOrigin: true,
        logLevel: 'debug',
        onProxyReq: (proxyReq, req, res) => {
          console.log('🔄 Proxying:', req.method, req.url, '→', proxyReq.path);
        },
        onError: (err, req, res) => {
          console.error('❌ Proxy error:', err);
        }
      }
    ],
  },

  // Source maps for debugging
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',

  // Performance hints
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },

  // Stats configuration
  stats: {
    errorDetails: true,
    children: false,
    modules: false,
  },
};