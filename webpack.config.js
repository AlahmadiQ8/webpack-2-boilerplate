const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');


var common = {

  context: path.resolve(__dirname, "src"),

  entry: {
    app: './app/index.js'
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  devServer: {
    contentBase: __dirname,
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ]    
  },

};

var config; 

switch(process.env.npm_lifecycle_event) {

  case 'build': 
    config = merge(
      common, 
      {
        devtool: 'source-map',
        module: {
          rules: [
            {
              test: /\.css$/,
              use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
              })
            }
          ]
        },
        plugins: [
          new CleanWebpackPlugin('dist', {
            root: process.cwd()
          }),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
              drop_console: false,
            }
          }),
          new ExtractTextPlugin("styles.css"),
          new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'index.html')),
          })
        ]
      }
    );
    break;

  default: 
    config = merge(
      common, 
      {
        devtool: 'eval-source-map',
        module: {
          rules: [
            {
              test: /\.css$/,
              use: "css-loader"
            }
          ]
        },
        devServer: {
          // Enable history API fallback so HTML5 History API based
          // routing works. This is a good default that will come
          // in handy in more complicated setups.
          historyApiFallback: true,

          // Unlike the cli flag, this doesn't set
          // HotModuleReplacementPlugin!
          hot: true,
          inline: true,

          // Display only errors to reduce the amount of output.
          stats: 'errors-only',

          // Parse host and port from env to allow customization.
          //
          // If you use Vagrant or Cloud9, set
          // host: options.host || '0.0.0.0';
          //
          // 0.0.0.0 is available to all network devices
          // unlike default `localhost`.
          host: process.env.HOST, // Defaults to `localhost`
          port: process.env.PORT // Defaults to 8080
        },
        plugins: [
          // Enable multi-pass compilation for enhanced performance
          // in larger projects. Good default.
          new webpack.HotModuleReplacementPlugin({
            multiStep: true
          })
        ]
      }
    );

}

module.exports = config;