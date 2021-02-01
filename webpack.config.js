const path = require('path');
const webpack = require('webpack');

const baseConfig = {
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
  target: 'web',
  performance: {
    maxAssetSize: 400000,
    maxEntrypointSize: 400000,
  },
  output: {
    path: path.resolve(__dirname, 'build/package'),
    library: 'simaLandVendors',
  },
  plugins: [
    new webpack.DllPlugin({
      name: 'simaLandVendors',
      path: path.resolve(__dirname, './build/package/vendor-manifest.json'),
    }),
  ],
};

module.exports = [
  {
    ...baseConfig,
    mode: 'production',
    output: {
      ...baseConfig.output,
      filename: 'production.dependencies.js',
    },
  }, {
    ...baseConfig,
    mode: 'development',
    output: {
      ...baseConfig.output,
      filename: 'development.dependencies.js',
    },
  },
];
