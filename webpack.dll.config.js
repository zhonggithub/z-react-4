/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const publicPath = '/public';

let optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      test: /\.js(\?.*)?$/i,
      cache: true,
      parallel: true,
    }),
  ],
};
if (process.env.NODE_ENV === 'development') {
  optimization = {
    minimize: false,
  }
}

module.exports = {
  mode: process.env.NODE_ENV,
  optimization,
  entry: {
    antd: ['antd'],
    vendor: [
      'mobx',
      'mobx-react',
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'prop-types',
      // 'braft-editor',
      // 'react-bmap',
    ],
    other: [
      // 'echarts',
      // 'echarts-for-react',
      'react-highcharts',
      // 'react-json-view',
      // 'react-infinite-scroller',
      // 'immutability-helper',
    ],
    common: [
      'lodash',
      // 'validator',
      'moment',
      // 'numeral',
      // 'nzh',
      'node-fetch',
      'enquire.js',
      'classnames',
      'isomorphic-fetch',
      // 'file-saver',
      // 'xlsx',
      // 'jszip',
      // 'qrcode',
      // 'html2canvas',
    ]
  },
  output: {
    library: '[name]_[chunkhash]',
    path: path.join(__dirname, 'dist/'),
    filename: '[name]_[hash].dll.js',
    publicPath,
  },
  plugins: [
    new webpack.DllPlugin({
      path: 'manifest.json',
      context: __dirname,
      path: path.join(__dirname, '.', 'dist/[name]-manifest.json'),
      name: '[name]_[chunkhash]',
    }),
  ],
};
