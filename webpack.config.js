var webpack = require('webpack');
var path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

var BUILD_DIR = path.resolve(__dirname, './build');
var DIST_DIR = path.resolve(__dirname, './dist');
var SERVE_DIR = path.resolve(__dirname, './buildServe');
var PROJ_DIR = __dirname;
var HTML_DIR = path.resolve(__dirname, './src');
var APP_DIR = path.resolve(__dirname, './src/ts');
var IMG_DIR = path.resolve(__dirname, './src/images');
var STYLE_DIR = path.resolve(__dirname, './src/styles');
const configDirs = {
  BUILD_DIR,
  DIST_DIR,
  SERVE_DIR,
  PROJ_DIR,
  HTML_DIR,
  STYLE_DIR,
  IMG_DIR,
  APP_DIR,
};

function buildConfig(env, argv) {
  if (argv.mode === 'production') {
    return require('./config/production.js')(configDirs);
  } else if (argv.mode === 'development') {
    if (['serve', 'webext', 'development'].includes(env.devMode)) {
      return require('./config/' + env.devMode + '.js')(configDirs);
    } else {
      console.log(
        `Wrong webpack build parameter env.devMode="${env.devMode}". Possible choices: 'serve', 'webext', or 'development'.`
      );
    }
  }
}

module.exports = buildConfig;
