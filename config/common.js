const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const baseManifest = require('../baseManifest.js');
const pkg = require('../package.json');
const { WebWorkerPlugin } = require('@shopify/web-worker/webpack');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = function (configDirs) {
  return {
    entry: {
      // popup: configDirs.APP_DIR + '/popup.tsx',
      'content-script': configDirs.APP_DIR + '/content-script.tsx',
      background: configDirs.APP_DIR + '/background.tsx',
    },
    output: {
      filename: '[name].bundle.js',
      path: configDirs.BUILD_DIR,
      globalObject: 'self',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
      alias: {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx|mjs)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                ],
                plugins: [
                  require.resolve('@shopify/web-worker/babel'),
                  // '@shopify/web-worker/babel',
                  [
                    '@babel/plugin-transform-react-jsx',
                    {
                      throwIfNamespace: false, // defaults to true
                      runtime: 'automatic', // defaults to classic
                      importSource: 'preact', // defaults to react
                    },
                  ],
                  // isDevelopment && require.resolve("@prefresh/babel-plugin"),
                ].filter(Boolean),
              },
            },
          ],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
            },
          ],
        },
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          // include: configDirs.IMG_DIR,
          use: ['preact-svg-loader'],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        // {
        //     test: /\.css$/i,
        //     use: ['style-loader', "css-loader"]
        // },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader',
          ],
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },

    plugins: [
      new WebWorkerPlugin({ globalObject: 'self' }),
      isDevelopment && new MiniCssExtractPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          DEV_MODE: JSON.stringify(process.env.DEV_MODE),
          VERSION: JSON.stringify(pkg.version),
        },
      }),
      // new HtmlPlugin({
      //   filename: 'popup.html',
      //   template: configDirs.HTML_DIR + '/popup.html',
      //   chunks: ['popup'],
      // }),
      new CopyWebpackPlugin({
        patterns: [
          // { from: 'manifest.json', to: '[name].[ext]' },
          { from: 'public', to: 'public' },
          // { from: 'styles', to: 'styles' },
        ],
      }),
    ].filter(Boolean),
  };
};
