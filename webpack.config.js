const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const autoprefixer = require('autoprefixer');

const script = process.env.npm_lifecycle_event; // see package.json scripts

var common = {

  context: path.resolve(__dirname, "src"),

  entry: {
    index: './js/index.js',
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
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{ loader: 'css-loader', options: { importLoaders: 1 } },
                'postcss-loader',
                'sass-loader']
        }),
      },
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.(css|scss)$/,
          /\.json$/,
          /\.svg$/
        ],
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'img/[name].[ext]'
          }
        }
      },
      {
        test: /\.svg$/,
        loader: 'file',
        query: {
          name: 'img/[name].[ext]'
        }
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin(
      {
        filename:  (getPath) => {
          return getPath('css/[name].css');
        },
        disable: script === 'dev',
      }
    ),
  ]
};

var config;

switch(script) {

  case 'build':
    config = merge(
      common,
      {
        devtool: 'source-map',
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
          new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src', '*.html')),
            minimize: true,
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
        plugins: (() => {
          const plugins = [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
          ];
          if (script === 'dev') {
            plugins.push(new HtmlWebpackPlugin({
              filename: "index.html",
              template: path.join(__dirname, 'src/index.html'),
            }));
          }
          return plugins;
        })(),
      }
    );

}

module.exports = config;