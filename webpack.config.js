const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');


var common = {

  context: path.resolve(__dirname, "src"),

  entry: {
    app: './app/index.js',
    style: './styles/index.scss'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
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

  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(__dirname, 'src/index.html'),
    })
  ]

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
              test: /\.scss$/,
              use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader']
              }),
              include: path.join(__dirname, 'src', 'styles', 'index.scss'),
            },
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
            paths: glob.sync(path.join(__dirname, 'src', '*.html')),
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
              test: /\.scss$/,
              use: ["style-loader", "css-loader", 'sass-loader'],
              include: path.join(__dirname, 'src', 'styles', 'index.scss'),
            },
          ]
        },
        devServer: {
          historyApiFallback: true,
          contentBase: path.join(__dirname, 'src'),
          hot: true,
          inline: true,
          stats: 'errors-only',
          overlay: {
            errors: true,
            warnings: true,
          },
          host: process.env.HOST, // Defaults to `localhost`
          port: process.env.PORT // Defaults to 8080
        },
        plugins: [
          new webpack.HotModuleReplacementPlugin({
            multiStep: true
          }),
          new webpack.NamedModulesPlugin(),
        ]
      }
    );

}

module.exports = config;