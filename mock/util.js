/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import { readdirSync } from 'fs';
import { join } from 'path';
import { Router } from 'express';
import config from '../src/config';

const { apiPrefix } = config;

function fileDisplay(app, filePath) {
  // 根据文件路径读取文件，返回文件列表
  const files = readdirSync(filePath);
  files.forEach((filename) => {
    // 获取当前文件的绝对路径
    const filedir = join(filePath, filename);
    if (filename.endsWith('.js')) {
      // eslint-disable-next-line import/no-dynamic-require
      app.use(apiPrefix, require(filedir));
    }
  });
}

function randomStr(places = 16) {
  return Math.random().toString().slice(parseInt(places, 10) * -1);
}

function randomNum(places = 2) {
  return parseFloat(randomStr(places));
}

function itemMock(index = 0) {
  return {
    id: randomStr(),
    status: index / 2,
  };
}

function mockItems(req, itemFunc = itemMock) {
  if (!req) return [];
  const items = [];
  for (let i = 0; i < (req.query.pageSize || 10); i += 1) {
    items.push(itemFunc(i));
  }
  return items;
}

function mockRet(data) {
  return {
    code: 0,
    message: 'success',
    data,
  };
}

function mockListRet(req, itemFunc = mockItems) {
  if (!req) return {};
  const data = {
    items: mockItems(req, itemFunc),
    total: randomNum(3),
    page: req.query.page || 1,
    pageSize: req.query.pageSize || 10,
  };
  return mockRet(data);
}

function resFun(res, data, status = 200) {
  const ret = mockRet(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
  });
  res.write(JSON.stringify(ret));
  res.end();
}
function resListFun(req, res, itemFunc = mockItems) {
  const ret = mockListRet(req, itemFunc);
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.write(JSON.stringify(ret));
  res.end();
}

function newRouter() {
  return Router();
}

export {
  resFun,
  randomNum,
  randomStr,
  fileDisplay,
  mockListRet,
  resListFun,
  mockItems,
  newRouter,
};
