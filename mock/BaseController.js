/**
 * Project: view
 * File: Controller.js
 * Created Date: 2019-10-31 22:39:31
 * Author: Zz
 * Last Modified: 2020-02-12 18:40:56
 * Modified By: Zz
 * Description:
 */

const { newRouter } = require('./util');

export default class BaseController {
  constructor(resourceName = '') {
    this.resourceName = resourceName;
    this.apiPrefix = `/${resourceName}`;

    this.router = newRouter();
  }

  resource() {
    const {
      create, update, updateStatus, retrieve, list, treeList, listAll,
      exportExcel, logicDel, count, didResource,
    } = this;

    // 创建
    if (create && typeof create === 'function') {
      this.router.post(this.apiPrefix, create);
    }

    const idUrl = `${this.apiPrefix}/:id`;
    // 更新
    if (update && typeof update === 'function') {
      this.router.post(idUrl, update);
    }

    // 更新状态
    if (updateStatus && typeof updateStatus === 'function') {
      this.router.post(`${idUrl}/:id/status`, updateStatus);
    }

    // 获取信息
    if (retrieve && typeof retrieve === 'function') {
      this.router.get(idUrl, retrieve);
    }

    // 列表
    if (list && typeof list === 'function') {
      this.router.get(this.apiPrefix, list);
    }

    // 树形列表
    if (treeList && typeof treeList === 'function') {
      this.router.get(`/treeList${this.apiPrefix}`, treeList);
    }

    // listAll
    if (listAll && typeof listAll === 'function') {
      this.router.get(`/listAll${this.apiPrefix}`, listAll);
    }

    // 导出到excel
    if (exportExcel && typeof exportExcel === 'function') {
      this.router.get(`/exportExcel${this.apiPrefix}`, exportExcel);
    }

    // 删除
    if (logicDel && typeof logicDel === 'function') {
      this.router.del(idUrl, logicDel);
    }

    // 计算
    if (count && typeof count === 'function') {
      this.router.get(`/count${this.apiPrefix}`, count);
    }

    // 加载自定义路由
    if (didResource && typeof didResource === 'function') {
      didResource();
    }

    return this.router;
  }
}
