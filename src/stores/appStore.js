/**
 * File: appStore.js
 * Project: z-react
 * FilePath: /src/stores/appStore.js
 * Created Date: 2019-12-29 11:14:03
 * Author: Zz
 * -----
 * Last Modified: 2020-01-04 13:39:35
 * Modified By: Zz
 * -----
 * Description:
 * role 数据结构：[{
 *  categoryID: '', // 总模块id, 顶部一级菜单
 *  name: '', // 总模块名称
 *  children: [{ // 左侧菜单栏
 *    id: '',
 *    name: '',
 *    key: '',
 *    icon: '',
 *    index: '',
 *    children: [],
 *  }]
 * }]
 */
import React from 'react';
import { computed, observable } from 'mobx';
import { message } from 'antd';
import localforage from 'localforage';
import { request, util } from 'common';
import config from 'config';
import { ZIcon } from 'components';
import { Page403 } from '../modules/error';

/* eslint-disable */
class AppStore {
  @computed get token() {
    return sessionStorage.getItem('jwt:token');
  }

  set token(val) {
    sessionStorage.setItem('jwt:token', val);
  }

  @computed get payload() {
    return JSON.parse(sessionStorage.getItem('jwt:payload'));
  }

  set payload(val) {
    sessionStorage.setItem('jwt:payload', JSON.stringify(val));
  }

  @computed get isLogin() {
    if (this.token === 'undefined' || this.token === 'null') { return false; }
    return !!this.token;
  }

  @observable role = global.role || {
    modules: [],
    value: 0,
  }

  @observable menus = []

  constructor() {
    // 页面参数
    this.pageParams = new Map();
    this.historyUrl = [];
  }

  writePageParams(props = null, params = {}) {
    if (!props || !props.location) return;
    const { pathname } = props.location;
    this.pageParams.set(pathname, params);
    this.historyUrl.push(pathname);
  }

  writeUrl(props = null) {
    if (!props || !props.location) return;
    const { pathname } = props.location;
    this.historyUrl.push(pathname);
  }

  getLastUrl() {
    if (this.historyUrl.length === 0) {
      return '';
    }
    return this.historyUrl[this.historyUrl.length - 1];
  }

  getPageParams(props = null, strongAuth = false) {
    if (!props || !props.location) return null;
    const { pathname } = props.location;
    const params = this.pageParams.get(pathname);
    if (!params || !params.pageSize) return null;
    if (typeof strongAuth === 'function' && strongAuth()) {
      return params;
    }
    // 强认证：倒数第二个路由是当前路由
    if (strongAuth) {
      this.historyUrl.pop();
      const tmpPathname = this.historyUrl.pop();
      if (tmpPathname !== pathname) {
        return null;
      }
    }
    return params;
  }

  refreshPageParamsByEdit() {
    if (this.historyUrl.length === 0) {
      return;
    }
    const pathname = this.historyUrl[this.historyUrl.length - 1];
    this.pageParams.set(pathname, null);
  }

  refreshPageParams(props = null) {
    if (typeof props === 'string' && props) {
      this.pageParams.set(props, {});
      return;
    }
    if (!props || !props.location) return;
    const { pathname } = props.location;
    this.pageParams.set(pathname, null);
  }

  @computed get isModuleEmpty() {
    const { modules, value } = this.role;
    if (value === 666) {
      return false;
    }
    if (modules.length === 0) {
      return true;
    }
    return false;
  }

  getMenuImp = (items) => {
    if (!items || !items.length) return [];
    return items.map((item) => {
      const data = {
        text: item.name,
        icon: item.icon || 'appstore-o',
        inlineIcon: <ZIcon type={item.icon || 'appstore-o'} size={16} />,
      };
      if (item.children && item.children.length > 0) {
        data.key = item.key;
        data.items = this.getMenuImp(item.children);
      } else {
        data.to = item.key;
      }
      return data;
    });
  }

  /**
   * @apiName getMenu
   * 
   * @apiGroup AppStore
   * 
   * @apiDescription 获得顶部一级菜单下的子菜单，默认返回第一个顶部菜单
   * 如果始终返回空数组，则需要调用afterLogin后在调用此函数。
   * 注意：调用该函数之前请使用isModuleEmpty判断后端是否已正确获取菜单栏，
   * 如果isModuleEmpty为true，则先调用afterLogin
   * 
   * @apiParam {String} [categoryID] 顶部一级菜单id。
   * 
   * @apiSuccess {Object} menu 返回一级菜单信息，包括子菜单
   * @apiSuccess {String} menu.categoryID 一级菜单id
   * @apiSuccess {String} menu.name 一级菜单名称
   * @apiSuccess {Object[]} menu.items 一级菜单下的子菜单
   */
  getMenu = (categoryID) => {
    if (this.menus.length === 0) {
      const { role } = this;
      const { modules } = role;
      if (modules.length > 0) {
        this.menus = modules.map(item => {
          item.items = this.getMenuImp(item.children);
          return item;
        });
      }
    }
    if (categoryID) {
      const menus = this.menus.find(item => item.categoryID === categoryID);
      return menus || [];
    }
    if (this.menus.length === 0) {
      return null;
    }
    return this.menus[0];
  }

  getModule = () => {
    if (this.menus.length === 0) {
      const { role } = this;
      const { modules } = role;
      if (modules.length > 0) {
        this.menus = modules.map(item => {
          item.children = this.getMenuImp(item.children);
          return item;
        });
        return this.menus;
      }
    }
    return [];
  }

  hasUrlImp(items, url) {
    if (!items || !items.length) return false;
    for (const item of items) {
      if (item.key === url || item.to === url) return true;
      if (item.children && item.children.length > 0) {
        return this.hasUrlImp(item.children);
      }
    }
    return false;
  }

  // 页面权限判断
  hasUrl(url = '') {
    // if (process.env.NODE_ENV === 'development') return true;

    const { modules, value } = this.role;
    // 超级管理员权限
    if (value === 666) {
      return true;
    }
    if (modules.length > 0) {
      return this.hasUrlImp(modules[0].children, url);
    }
    return false;
  }

  getIndexPageImp(items) {
    if (!items || !items.length) return config.indexPage;
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        return this.getIndexPageImp(item.children);
      }
      return item.key;
    }
    return config.indexPage;
  }

  getIndexPage(loginRet) {
    if (!loginRet) return '';
    let indexPage = config.indexPage;

    const { role } = loginRet;
    const { modules } = role;
    if (modules.length > 0) {
      indexPage = this.getIndexPageImp(modules[0].children);
    }
    return indexPage;
  }

  login(params) {
    const url = `${config.apiPrefix}/login`;
    request(url, params).then(util.package200).then((ret) => {
      this.payload = ret.data.user;
      this.token = ret.data.token;

      this.afterLogin((err, data) => {
        if (err) {
          return;
        }
        const indexPage = this.getIndexPage(data);
        config.indexPage = indexPage;
        location.href = config.indexPage;
      })
    }).catch((err) => {
      message.error(`登入失败! ${err}`);
    });
  }

  afterLogin(next) {
    const url = `${config.apiPrefix}/afterLogin`;
    request(url).then(util.package200).then((ret) => {
      const indexPage = this.getIndexPage(ret.data);
      config.indexPage = indexPage;

      this.role = ret.data.role;

      localforage.setItem('role', ret.data.role).then( (value) => {
        if (next) {
          next(null, ret.data);
        }
      }).catch((err) => {
        if (next) {
          next(null, ret.data);
        }
      });
      
    }).catch((err) => {
      message.error(`登入失败! ${err}`);
      if (next) {
        next(err);
      }
    });
  }

  logout() {
    const url = `${config.apiPrefix}/logout`;
    return request(url, {}).then(util.package200).then(() => {
      // this.payload = null;
      this.token = null;
      location.href = '/';
    }).catch((err) => {
      message.error(`登出失败! ${err}`);
    });
  }
  
  getNoticationData(callback) {
    const url = `${config.apiPrefix}/notices`;
    request(url).then(util.package200).then((ret) => {
      if (callback) {
        callback(null, ret);
      }
    }).catch(() => {
      // message.error(`${err.message}`);
    });
  }

  getPage(path, PageComponent, auth = true) {
    if (!path || !PageComponent) {
      return <Page403 />;
    }
    if (!auth) {
      return PageComponent;
    }
    if (typeof auth === 'function') {
      return auth(path) ? PageComponent : <Page403 />;
    }
    return (this.hasUrl(path) ? PageComponent : <Page403 />);
  }
}

export default new AppStore();
