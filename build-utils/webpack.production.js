const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const postcssPresetEnv = require('postcss-preset-env')

module.exports = () => ({
  devtool: 'source-map',
  output: {
    filename: '[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                postcssPresetEnv({ browsers: 'last 2 versions' }),
              ],
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: '[hash].bundle.css' })],
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
})
