const path = require('path');
const webpack = require('webpack');

const config = {
  entry: [
    'axios',
    'classnames',
    'lodash',
    'react',
    'react-dom',
    'react-redux',
    'redux',
    'redux-saga',
    'reduxsauce',
    'reselect',
    './cqc/command',
    './cqc/execute',
    './cqc/respond',
    './cqc/request',
  ],
  performance: {
    maxAssetSize: 400000,
    maxEntrypointSize: 400000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new webpack.DllPlugin({
      name: 'simaLandVendors',
      path: path.resolve(__dirname, `./build/package/vendor-manifest.json`),
    }),
  ],
};

const commonOutput = {
  path: path.resolve(__dirname, `build/package`),
  library: 'simaLandVendors',
};

module.exports = [{
  mode: 'production',
  output: {
    ...commonOutput,
    filename: 'production.dependencies.js',
  },
  ...config
}, {
  mode: 'development',
  output: {
    ...commonOutput,
    filename: 'development.dependencies.js',
  },
  optimization: {
    minimize: true,
    removeAvailableModules: true,
    flagIncludedChunks: true,
    usedExports: true,
    concatenateModules: true,
  },
  ...config
}];
