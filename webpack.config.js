/* eslint-disable global-require */
/**
* @Author: Zz
* @Date:   2016-09-10T10:35:08+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-09-11T22:46:25+08:00
*/
const path = require('path');
const os = require('os');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DllLinkPlugin = require('dll-link-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HappyPack = require('happypack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const createHappyPlugin = (id, loaders) => new HappyPack({
  id,
  loaders,
  threadPool: happyThreadPool,
  verbose: process.env.HAPPY_VERBOSE === '1', // make happy more verbose with HAPPY_VERBOSE=1
});
const DllConfig = require('./webpack.dll.config.js');

const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

const publicPath = '/public';

const entry = [
  // 'babel-polyfill',
  `${__dirname}/src/index.js`,
];
process.traceDeprecation = true;
process.noDeprecation = true;

const loaders = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    include: `${__dirname}/src`,
    query: {
      cacheDirectory: true,
    },
  },
  {
    test: /\.jsx$/,
    exclude: /node_modules/,
    loader: 'happypack/loader?id=happy-babel',
  },
  {
    test: /\.less$/,
    use: [{
      loader: 'style-loader', // creates style nodes from JS strings
    }, {
      loader: 'css-loader', // translates CSS into CommonJS
    }, {
      loader: 'less-loader', // compiles Less to CSS
      options: {
        javascriptEnabled: true,
      },
    }],
  },
  {
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: './dist',
          hmr: process.env.NODE_ENV === 'development',
        },
      },
      'css-loader',
    ],
  },
];

const plugins = [
  new HtmlWebpackPlugin({ template: 'src/index.html' }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.LoaderOptionsPlugin({
    options: {
      babel: {
        plugins: [['antd']],
      },
    },
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),

  new AddAssetHtmlPlugin({
    filepath: path.resolve(__dirname, './dist/*.dll.js'),
    hash: true,
    includeSourcemap: false,
  }),
  new MiniCssExtractPlugin({ // 提取css
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),
  // createHappyPlugin('happy-css', ['css-loader']),
  createHappyPlugin('happy-babel', [{
    loader: 'babel-loader',
    options: {
      babelrc: true,
      cacheDirectory: true, // 启用缓存
    },
    query: {
      cacheDirectory: true,
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
      ],
      presets: [['@babel/preset-env', { modules: 'commonjs' }], ['@babel/preset-react']],
    },
  }]),
];

let optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      test: /\.js(\?.*)?$/i,
      cache: true,
      parallel: true,
    }),
    new OptimizeCssAssetsPlugin(),
  ],
};

if (process.env.NODE_ENV === 'development') {
  entry.unshift(hotMiddlewareScript);

  optimization = {
    minimize: false,
  };

  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NoEmitOnErrorsPlugin());

  plugins.push(new webpack.DllReferencePlugin({
    context: path.join(__dirname),
    // eslint-disable-next-line import/no-unresolved
    manifest: require('./dist/antd-manifest.json'),
  }));
  plugins.push(new webpack.DllReferencePlugin({
    context: path.join(__dirname),
    manifest: require('./dist/vendor-manifest.json'),
  }));
  plugins.push(new webpack.DllReferencePlugin({
    context: path.join(__dirname),
    manifest: require('./dist/other-manifest.json'),
  }));
  plugins.push(new webpack.DllReferencePlugin({
    context: path.join(__dirname),
    manifest: require('./dist/common-manifest.json'),
  }));

  loaders.push({ test: /\.(png|jpg|gif|jpe?g)$/, loader: 'file-loader' });
  loaders.push({ test: /\.(eot|woff|woff2|svg|ttf)$/, loader: 'file-loader' });
} else if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }));
  plugins.push(new DllLinkPlugin({
    config: DllConfig,
  }));
  plugins.push(new CompressionPlugin({
    test: new RegExp('\\.(js|css)$'),
    filename: '[path].gz[query]',
    algorithm: 'gzip',
  }));
  loaders.push({
    test: /\.(scss|sass)$/,
    use: [
      'css-loader',
      {
        loader: 'fast-sass-loader',
      },
    ],
  });
  loaders.push({ test: /\.(png|jpg|gif|jpe?g)$/, loader: 'file-loader?limit=8192&name=/images/[hash].[ext]' });
  loaders.push({ test: /\.(eot|woff|woff2|svg|ttf)$/, loader: 'file-loader?name=/fonts/[hash].[ext]' });
}

module.exports = {
  devServer: {
    hot: true,
  },
  mode: process.env.NODE_ENV,
  entry,
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.json', '.css'],
    alias: {
      components: `${__dirname}/src/components`,
      stores: `${__dirname}/src/stores`,
      common: `${__dirname}/src/common`,
      config: `${__dirname}/src/config`,
      store: `${__dirname}/src/store`,
    },
  },
  // 文件导出的配置
  output: {
    path: `${__dirname}/dist/`,
    filename: '[hash].bundle.js',
    chunkFilename: '[hash].bundle.js',
    publicPath,
  },
  module: {
    rules: loaders,
  },
  plugins,
  optimization,
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
    'iconv-lite': 'empty',
  },

};
