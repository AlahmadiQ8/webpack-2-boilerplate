const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const modeConfig = env => require(`./build-utils/webpack.${env}`)(env)
const loadPresets = require('./build-utils/loadPresets')

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) => {
  mode = mode || 'production'
  presets = presets || []
  return webpackMerge(
    {
      mode,
      entry: './src/js/index.js',
      output: {
        filename: 'bundle.js',
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader'],
          },
          {
            test: /\.jpe?g$/,
            use: [
              {
                loader: 'url-loader',
                options: { limit: 5000 },
              },
            ],
          },
        ],
      },
      plugins: [
        new CleanWebpackPlugin('dist', {
          root: process.cwd(),
        }),
        new HtmlWebpackPlugin({ template: './index.html' }),
        new CopyWebpackPlugin([
          {
            from: './src/assets',
            to: path.resolve(__dirname, 'dist/assets'),
          },
        ]),
        new webpack.ProgressPlugin(),
      ],
    },
    modeConfig(mode),
    loadPresets({ mode, presets })
  )
}
