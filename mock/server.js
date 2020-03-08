/* eslint-disable import/no-extraneous-dependencies */
/**
* @Author: Zz
* @Date:   2016-09-09 10:09:20
* @Email:  quitjie@gmail.com
* @Project: z-react
* @Last modified by:   Zz
* @Last modified time: 2016-10-09T20:23:25+08:00
*/
import childProcess from 'child_process';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import { resolve } from 'path';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import webpackConfig, { output } from '../webpack.config';
import { fileDisplay } from './util';

const app = express();
const port = 3000;

function openUrl(url = '') {
  if (!url) return;
  let cmd = '';
  if (process.platform === 'wind32') {
    // cmd = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"';
    cmd = 'start';
  } else if (process.platform === 'linux') {
    cmd = 'xdg-open';
  } else if (process.platform === 'darwin') {
    cmd = 'open';
  }
  childProcess.exec(`${cmd} "${url}"`);
}

const compiler = webpack(webpackConfig);
const instance = webpackDevMiddleware(compiler, {
  publicPath: output.publicPath,
  status: {
    colors: true,
  },
});
app.use(require('webpack-hot-middleware')(compiler));
app.use(instance);

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(morgan('combined'));

const filePath = resolve(`${__dirname}/routes`);
fileDisplay(app, filePath);

app.use('*', (req, res, next) => {
  compiler.outputFileSystem.readFile(`${compiler.outputPath}index.html`,
    // eslint-disable-next-line consistent-return
    (err, rst) => {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.end(rst);
    });
});

instance.waitUntilValid(() => {
  const url = `http://localhost:${port}`;
  console.log('\r\n');
  console.log('-----------------------------');
  console.log(url);
  console.log('-----------------------------');

  // openUrl(url);

  app.listen(port);
});
