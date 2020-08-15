const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   entry: './{{frontendSource}}/index.js',
   output: {
      path: path.join(__dirname, '{{frontendBuildTarget}}'),
      filename: 'index_bundle.js'
   },
   devServer: {
      inline: true,
      port: 8001
   },
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['@babel/env', '@babel/react']
            }
         },
         {
           test: /\.css$/,
           exclude: /node_modules/,
           use: ['style-loader', 'css-loader'],
         },
      ],
   },
   plugins:[
      new HtmlWebpackPlugin({
         template: './{{frontendSource}}/index.html'
      })
   ]
}
