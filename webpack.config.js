const path = require('path');
const webpack = require('webpack');
const PROD = JSON.parse(!process.env.NODE_ENV || '0');

module.exports = {
  devtool: PROD ? '' : 'eval',
  entry: PROD ? './src/index' : [
    'webpack-dev-server/client?http://localhost:3000',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: PROD ? 'bundle.min.js' : 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx']
  },
  module: {
    loaders: [{
      test: /\.tsx?$/,
      loaders: ['awesome-typescript-loader'],
      include: path.join(__dirname, 'src')
    }]
  },
  plugins: PROD ? [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ] : []
};
