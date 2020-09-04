const path = require('path')

const webpack = require('webpack')
const htmlplugin = require('html-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    'react-hot-loader/patch',
    './{{frontendSource}}/index.js'
  ],
  plugins: [
    new htmlplugin({template: './{{frontendSource}}/index.html'}),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: ['react-hot-loader/webpack', 'babel-loader'],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    path: path.join(__dirname, '{{frontendBuildTarget}}'),
    filename: 'bundle.js'
  },
}
