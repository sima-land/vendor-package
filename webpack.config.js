const path = require('path');
const webpack = require('webpack');
const pacakge = require('./package.json');

const NAME = 'simaLandVendors';

module.exports = {
  mode: 'production',
  target: 'web',
  entry: Object.keys(pacakge.peerDependencies),
  performance: {
    maxAssetSize: 400000,
    maxEntrypointSize: 400000,
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    library: NAME,
    filename: 'dependencies.js',
  },
  plugins: [
    new webpack.DllPlugin({
      name: NAME,
      path: path.resolve(__dirname, './dist/manifest.json'),
      format: true,
      entryOnly: true,
    }),
  ],
};
