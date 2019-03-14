const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = () => ({
  devtool: 'source-map',
  output: {
    filename: '[chunkhash].js'
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
              plugins: () => [postcssPresetEnv({ browsers: 'last 2 versions' })]
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin({ filename: '[hash].bundle.css' })],
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true // Must be set to true if using source-maps in production
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
});
