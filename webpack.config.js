const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: './lib/game.js',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devtool: 'source-maps'
};
