// const PreactRefreshPlugin = require('@prefresh/webpack');
const webpack = require('webpack');
const path = require("path")
const WebExtWebpackPlugin = require('@ianwalter/web-ext-webpack-plugin');
const HtmlPlugin = require("html-webpack-plugin")
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");


module.exports = function(configDirs) {
    // const smp = new SpeedMeasurePlugin({disable:false, outputFormat:'humanVerbose', granularLoaderData:true });

    const devConfig =  {...require('./common')(configDirs),
            devtool: "inline-source-map", // only these source maps work
            watch:true,
            watchOptions: {
                poll: true,
                ignored: /node_modules/
              },
        }
    devConfig.plugins = [...devConfig.plugins,
        new WebExtWebpackPlugin({ 
            sourceDir: configDirs.BUILD_DIR,
            firefox: 'firefox',
            // firefoxProfile:'/mnt/c/Users/frsc/Documents/Projects/th/devopsTh/web-ext/ffProfiles/th',
            startUrl: ['about:debugging#/runtime/this-firefox', 'www.twitter.com'], 
            // target:['firefox-desktop'],
            // keepProfileChanges: true,
            // profileCreateIfMissing:true,
        }),
    ]
    console.log('\x1b[36m%s\x1b[0m', 'Building for web-ext development...');
    // return smp.wrap(devConfig);
    return devConfig;
};

