const helpers = require('./config/helpers');
const paths = require('./config/paths');
const autoprefixer = require('autoprefixer');
const chalk = require('chalk');
const AggressiveMergingPlugin = require('webpack/lib/optimize/AggressiveMergingPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

const FILENAME = (helpers.IS_PROD && '[name].[hash]') || '[name]';

const webpackConfig = {
  devtool: (!helpers.IS_PROD && 'source-map') || false,
  entry: {
    vendor: paths.vendor,
    main: paths.indexJs
  },
  output: {
    filename: `js/${FILENAME}.js`,
    chunkFilename: `js/${FILENAME}.js`,
    path: paths.dist,
    publicPath: paths.root
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [paths.src],
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        include: [paths.src],
        use: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              sourceMap: !helpers.IS_PROD
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !helpers.IS_PROD,
              includePaths: [paths.styles],
              data: '$static: "/static";'
            }
          }
        ])
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        include: [paths.src],
        use: ['file-loader?name=fonts/[name].[ext]']
      }
    ]
  },
  plugins: [
    // https://webpack.js.org/guides/code-splitting-libraries/
    new CommonsChunkPlugin({ names: ['vendor', 'manifest'] }),
    new ExtractTextPlugin({
      filename: `css/${FILENAME}.css`,
      allChunks: true
    }),
    new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: paths.indexHtml,
      inject: 'body',
      chunksSortMode: 'dependency'
    }),
    new LoaderOptionsPlugin({
      options: {
        context: paths.root,
        postcss: () => [autoprefixer]
      }
    }),
    new ProgressBarPlugin({
      format: `${chalk.cyan.bold('build')} [${chalk.green(':bar')}] ${chalk.green.bold(':percent')} ${chalk.yellow.bold(':elapsed seconds')} ${chalk.white(':msg')}`,
      clear: false
    })
  ],
  devServer: {
    contentBase: paths.dist,
    port: 4000,
    https: false,
    open: true,
    inline: true,
    hot: true,
    historyApiFallback: true,
    noInfo: false,
    quiet: false,
    stats: {
      assets: false,
      children: false,
      chunks: false,
      chunkModules: false,
      hash: false,
      timings: false,
      version: false
    }
  }
};

if (helpers.IS_PROD) {
  // production
  webpackConfig.plugins = webpackConfig.plugins.concat([
    new AggressiveMergingPlugin(),
    new HashedModuleIdsPlugin(),
    new OptimizeCssAssetsPlugin(),
    new UglifyJsPlugin()
  ]);
} else {
  // development
  webpackConfig.plugins = webpackConfig.plugins.concat([
    new NamedModulesPlugin()
  ]);
}

module.exports = webpackConfig;
