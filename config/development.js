const webpack = require('webpack');
const path = require('path');
const PreactRefreshPlugin = require('@prefresh/webpack');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const ExtensionReloader = require('webpack-extension-reloader');
const commonConfig = require('./common');

module.exports = function (configDirs) {
  // const smp = new SpeedMeasurePlugin({disable:false,
  //   // outputFormat:'humanVerbose',
  //   granularLoaderData:true });

  var devConfig = {
    ...commonConfig(configDirs),
    devtool: 'inline-source-map', // only these source maps work
    watch: true,
    watchOptions: {
      poll: true,
      ignored: /node_modules/,
    },
  };
  devConfig.plugins = [
    ...devConfig.plugins,
    // new CleanWebpackPlugin(),
    new ExtensionReloader({
      // manifest: configDirs.PROJ_DIR + '/manifest.json',
      entries: {
        // The entries used for the content/background scripts or extension pages
        'content-script': 'content-script',
        background: 'background',
        worker: 'worker',
        popup: 'popup',
      },
      port: 9080,
    }),
  ];

  devConfig.module.rules[0].use[0].options.plugins = [
    ...devConfig.module.rules[0].use[0].options.plugins,
    require.resolve('@babel/plugin-transform-react-jsx-source'),
  ];
  console.log('\x1b[36m%s\x1b[0m', 'Building for development...');
  // return smp.wrap(devConfig);
  return devConfig;
};
