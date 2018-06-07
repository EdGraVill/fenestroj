const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/Panels/index.tsx',
  externals: ['react'],
  mode: 'production',
  module: {
    rules: [{
      loader: 'awesome-typescript-loader',
      test: /\.tsx?$/,
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }, {
      test: /\.svg$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      }],
    }],
  },
  output: {
    filename: 'panels.js',
    library: 'fenestroj',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  target: 'web',
};
