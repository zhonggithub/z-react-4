/*
 * @Author: Zz
 * @Date: 2017-02-28 10:34:19
 * @Last Modified by: Zz
 * @Last Modified time: 2019-09-18 10:47:03
 */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { ZSideNavigation, ZIcon } from 'components';
import config from 'config';

const defIconLargenSize = 16;

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
      const key = this.getSelectKey(item);
      if (key) {
        this.state.current = key.current;
        this.state.openKeys = key.openKeys;
        break;
      }
    }
  }

  getMenuImp = (items) => {
    if (!items || !items.length) return [];
    return items.map((item) => {
      const data = {
        text: item.name,
        icon: item.icon || 'appstore-o',
        inlineIcon: <ZIcon type={item.icon || 'appstore-o'} size={defIconLargenSize} />,
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

  getMenu = () => {
    const { payload } = this.appStore;
    const { roleModule } = payload;
    if (roleModule.length > 0) {
      return this.getMenuImp(roleModule[0].children);
    }
    return [];
  }

  getSelectKey(item) {
    if (!item) {
      return '';
    }
    const localHref = this.props.location.pathname;
    if (!localHref) { return ''; }

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
        const key = this.getSelectKey(subItem);
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
