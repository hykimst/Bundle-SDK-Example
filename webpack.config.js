const path = require('path');
const webpack = require('webpack')
const dotenv = require('dotenv')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const env = dotenv.config().parsed
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next])
  return prev
}, {})

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.ts',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts']
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Development',
      template: 'index.html',
      inject: true
    }),
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, "bundle"), to: "bundle" }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: [/node_modules/, /\.d\.ts$/],
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      },
      {
        test: /\.txt$/,
        type: "asset/source"
      }
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 8000
  }
};