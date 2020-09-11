const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');

module.exports = {
  devtool: 'cheap-module-source-map',
  mode: 'production',
  entry: {
    popup: './src/popup.jsx',
    'content-script': './src/cs.jsx',
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
        contentScript: 'content-script', // Use the entry names, not the file name or the path
        background: 'background' // *REQUIRED
      }
    })
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
              "@babel/plugin-proposal-class-properties"
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
