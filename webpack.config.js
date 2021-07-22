const path = require('path');
const webpack = require('webpack');

const NAME = 'simaLandVendors';

// eslint-disable-next-line require-jsdoc
const createConfig = ({ mode }) => ({
  mode,
  target: 'web',
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
  output: {
    path: path.resolve(__dirname, `dist/${mode}/`),
    library: NAME,
    filename: 'dependencies.js',
  },
  plugins: [
    new webpack.DllPlugin({
      name: NAME,
      path: path.resolve(__dirname, `./dist/${mode}/manifest.json`),
    }),
  ],
});

module.exports = [
  createConfig({ mode: 'production' }),
  createConfig({ mode: 'development' }),
];
