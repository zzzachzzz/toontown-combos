const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = env => ({
  mode: env.prod ? 'production' : 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[contenthash].bundle.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000
  },
  devtool: 'inline-source-map',
  plugins: [new webpack.ProgressPlugin()],
  resolve: {
    extensions: ['.js', '.mjs']
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|svg)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      }
    ]
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      favicon: './assets/favicon.ico'
    })
  ]
});
