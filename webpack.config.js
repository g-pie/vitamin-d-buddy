const path = require('path');

module.exports = {
  mode: 'development',
  entry: './vitamindbuddy/js/main.jsx',
  output: {
    path: path.join(__dirname, '/vitamindbuddy/static/js/'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        // Test for js or jsx files
        test: /\.jsx?$/,
        // Exclude external modules from loader tests
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: "source-map"
};
