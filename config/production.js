const webpack = require('webpack');
const path = require('path');
const baseManifest = require('../baseManifest.js');
const pkg = require('../package.json');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const commonConfig = require('./common');

module.exports = function (configDirs) {
  // Adds everything from "common.js" to a new object called prodConfig
  let prodConfig = { ...commonConfig(configDirs) };
  prodConfig.output.path = configDirs.DIST_DIR;
  prodConfig.plugins = [
    ...prodConfig.plugins,
    new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin(),
    new WebpackExtensionManifestPlugin({
      config: {
        base: baseManifest,
        extend: { version: pkg.version },
      },
    }),
    new ZipPlugin({ filename: 'threadhelper.zip' }),
  ];
  console.log('\x1b[36m%s\x1b[0m', 'Building for production ...');
  return prodConfig;
};
