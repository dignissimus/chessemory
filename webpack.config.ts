const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/chessemory.ts',
  output: {
    filename: 'chessemory.js',
    path: path.resolve(__dirname, 'www'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/index.html" },
        { from: "src/chessemory.css" },
        { from: "src/chessground.css" },
        { from: "src/board.css" },
        { from: "src/pieces.css" },
        { from: "assets" },
        { from: "data" },
      ]
    })
  ],
    
  module: {
    rules: [
      {
          test: /\.tsx?/,
          use: 'ts-loader',
      }
    ]
  }
};
