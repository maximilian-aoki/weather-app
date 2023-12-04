const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    // if using html-webpack-plugin, use './src' otherwise use './dist'
    static: './src',
  },
});
