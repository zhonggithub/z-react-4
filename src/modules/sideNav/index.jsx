/*
 * File: index.jsx
 * Project: z-react
 * FilePath: /src/modules/sideNav/index.jsx
 * Created Date: 2019-12-29 11:14:03
 * Author: Zz
 * -----
 * Last Modified: 2020-01-04 13:40:27
 * Modified By: Zz
 * -----
 * Description: 通过后端返回的角色模块动态显示模块菜单
 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { ZSideNavigation } from 'components';
import config from 'config';

@inject('stores') @withRouter @observer
export default class SideNav extends React.Component {
  constructor(props) {
    super(props);
    this.appStore = props.stores.appStore;

    this.state = {
      current: [config.indexPage],
      defaultOpenKeys: [config.indexPage],
      openKeys: [],
      pageMenuDef: this.getMenu(),
    };

    for (const item of this.state.pageMenuDef) {
      let key = this.getSelectKey(item, this.props.selectUrl || this.props.location.pathname);
      if (!key) {
        const tmp = this.appStore.getLastUrl();
        if (tmp) {
          const index = tmp.indexOf(config.pagePrefix);
          if (index !== -1) {
            const tmpUrl = tmp.substr(index);
            key = this.getSelectKey(item, tmpUrl);
          }
        }
      }
      if (key) {
        this.state.current = key.current;
        this.state.openKeys = key.openKeys;
        break;
      }
    }
  }

  componentDidMount() {
    if (this.appStore.isModuleEmpty) {
      this.appStore.afterLogin(() => {
        this.createMenu();
      });
    }
  }

  createMenu() {
    const menus = this.getMenu();
    for (const item of menus) {
      let key = this.getSelectKey(item, this.props.selectUrl || this.props.location.pathname);
      if (!key) {
        const tmp = this.appStore.getLastUrl();
        if (tmp) {
          const index = tmp.indexOf(config.pagePrefix);
          if (index !== -1) {
            const tmpUrl = tmp.substr(index);
            key = this.getSelectKey(item, tmpUrl);
          }
        }
      }
      if (key) {
        this.setState({
          pageMenuDef: menus,
          ...key,
        });
        return;
      }
    }
    this.setState({
      pageMenuDef: menus,
    });
  }

  getMenu = () => {
    const menus = this.appStore.getMenu();
    return menus ? menus.items : [];
  }

  getSelectKey(item, localHref) {
    if (!item) {
      return '';
    }
    if (!localHref) {
      return '';
    }

    if (item.to && (localHref === item.to || localHref.indexOf(item.to) === 0)) {
      return { current: [item.to], openKeys: [item.key || item.to] };
    }

    if (!item.items) {
      return '';
    }

    for (const subItem of item.items) {
      if (localHref.indexOf(subItem.to) === 0) {
        return { current: [subItem.to], openKeys: [item.key || item.to] };
      }
      if (subItem.items) {
        const key = this.getSelectKey(subItem, localHref);
        if (key) {
          key.openKeys.push(item.key || item.to);
          return key;
        }
      }
    }
    return '';
  }

  onSelect = (info) => {
    this.setState({ current: [info.key] });
  }

  onOpenChange = (openKeys) => {
    this.setState({ openKeys });
  }

  render() {
    return (
      <ZSideNavigation
        menus={this.state.pageMenuDef}
        collapse={this.props.collapse}
        defaultOpenKeys={this.state.openKeys}
        defaultSelectedKeys={this.state.current}
        selectedKeys={this.state.current}
        onSelect={this.onSelect}
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
      />
    );
  }
}
