const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    app: './src/index.js',
    // add more entry names if needed:
  },
  output: {
    // allows for multiple outputs:
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // refresh /dist folder every time:
    clean: true,
  },
  module: {
    rules: [
      // BABEL:
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },

      // BUNDLING CSS
      {
        // bundles imported css from index.js file and creates a /dist css file:
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },

      // BUNDLING IMAGES
      {
        // bundles static image assets, this is built-in:
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },

      // BUNDLING FONTS
      {
        // bundles fonts, this is built-in:
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // if not using "template", can use property "title" to set title:
      template: './src/index.html',
      filename: 'index.html',
      inject: 'head',
      scriptLoading: 'defer',
    }),
    new MiniCssExtractPlugin(),
  ],
  // if multiple entry points are used, include the below:
  // optimization: {
  //   runtimeChunk: 'single',
  // },
};
