/**
 * Project: view
 * File: Controller.js
 * Created Date: 2019-10-31 22:45:31
 * Author: Zz
 * Last Modified: 2019-11-19 23:03:44
 * Modified By: Zz (quitjie@gmail.com)
 * Description:
 */

import BaseController from './BaseController';
import {
  resFun, resListFun, randomNum, mockItems,
} from './util';

export default class Controller extends BaseController {
  constructor(resourceName = '', mockItem = (index = 0) => ({
    id: index,
  }), mockTreeItems = (index = 0) => ({
    id: index,
    children: [],
  })) {
    super(resourceName);
    this.mockItem = mockItem;
    this.mockTreeItems = mockTreeItems;
  }

  create = async (req, res) => {
    resFun(res, req.body, 201);
  }

  update = async (req, res) => {
    resFun(res, req.body);
  }

  updateStatus = async (req, res) => {
    resFun(res, req.body);
  }

  retrieve = async (req, res) => {
    resFun(res, this.mockItem());
  }

  list = async (req, res) => {
    resListFun(req, res, this.mockItem);
  }

  treeList = async (req, res) => {
    resFun(res, this.mockTreeItems());
  }

  count = async (req, res) => {
    resFun(res, randomNum());
  }

  listAll = async (req, res) => {
    resFun(res, mockItems(req, this.mockItem));
  }
}
