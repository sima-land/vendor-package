const path = require('path');
const webpack = require('webpack');

module.exports = {
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
  output: {
    path: path.resolve(__dirname, `build/package`),
    filename: `dependencies.js`,
    library: 'simaLandVendors',
  },
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
