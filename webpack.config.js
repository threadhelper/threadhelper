const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
  // devtool: false,
  devtool: 'source-map',
  mode: 'production',
  // mode: 'development',
  entry: {
    popup: './src/popup.jsx',
    'content-script': './src/cs.jsx',
    'testcs': './src/testcs.jsx',
    background: './src/bg.jsx',
    worker: './src/worker/worker.jsx'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  plugins: [
    new ChromeExtensionReloader({
      port: 8080, // Which port use to create the server
      reloadPage: true, // Force the reload of the page also
      entries: { // The entries used for the content/background scripts
        contentScript: ['content-script', 'testcs'], // Use the entry names, not the file name or the path
        background: 'background' // *REQUIRED
      }
    }),
    // new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ["@babel/plugin-transform-react-jsx", {
                "pragma": "h",
                "pragmaFrag": "Fragment",
              }],
              "@babel/plugin-proposal-class-properties",
            ]
          }
        }
      },
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          'css-loader',
          'resolve-url-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.svg$/,
        use: ['preact-svg-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: { 
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
     // Must be below test-utils
    },
  }
};
