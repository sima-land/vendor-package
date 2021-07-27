const path = require('path');
const webpack = require('webpack');
const { Env } = require('@humanwhocodes/env');
const packageInfo = require('./package.json');

const { VENDOR_PACKAGE_BUILD_VERSION: buildVersion } = new Env().required;

module.exports = {
  mode: 'production',
  target: 'web',
  entry: Object.keys(packageInfo.dependencies),
  performance: {
    maxAssetSize: 400000,
    maxEntrypointSize: 400000,
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'dependencies.js',
  },
  plugins: [
    new webpack.DllPlugin({
      name: `simaLandVendors@${buildVersion}`,
      path: path.resolve(__dirname, './dist/manifest.json'),
      format: true,
      entryOnly: true,
    }),
  ],
};
