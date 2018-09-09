const path = require('path')

const config = require('./src/config')

module.exports = {
  entry: './src/front/index.jsx',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'static/app')
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            require('@babel/preset-env'),
            require('@babel/preset-react')
          ],
          plugins: [
            '@babel/plugin-syntax-class-properties',
            'transform-class-properties'
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            query: {
              modules: true,
              camelCase: true,
              localIdentName: process.env.NODE_ENV === 'production' ?
                '[hash:base64:12]':
                '[path][name]__[local]--[hash:base64:5]'
            }
          },
          'postcss-loader'
        ]
      },
      {
        test:  /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: `${config.get('server.context')}/static/app/`
            }
          }
        ]
      }
    ]
  }
}
