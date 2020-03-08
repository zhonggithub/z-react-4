/*
 * @Author: Zz
 * @Date: 2017-02-28 10:34:19
 * @Last Modified by: Zz
 * @Last Modified time: 2018-08-06 10:04:13
 */
import React from 'react';
import { ZSideNavigation, ZIcon } from 'components';

const g_prefix = '/zplatorm/sidenav/';
const g_defIconLargenSize = 24;
const g_pageMenuDef = [
  {
    to: `${g_prefix}accountservice`,
    text: '9999',
    icon: <ZIcon iconfont='&#xe629;' />,
    inlineIcon: <ZIcon iconfont='&#xe629;' size={g_defIconLargenSize} style={{ marginRight: '0px' }} />,

    items: [
      {
        to: '/group/dockingplatform/weixin/overview',
        text: '概况',
        icon: <ZIcon iconfont='&#xe61f;' />,
        inlineIcon: <ZIcon iconfont='&#xe61f;' />,
      },
    ],
  },
];

export default class TestSider1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: [g_pageMenuDef[0].items[0].to],
      defaultOpenKeys: [g_pageMenuDef[0].to], // g_pageMenuDef.map( item => {return item.to;}),
    };
  }

  UNSAFE_componentWillMount() {
    const localHref = window.location.href;
    if (!localHref) { return; }
    for (const item of g_pageMenuDef) {
      for (const subItem of item.items) {
        if (localHref.indexOf(subItem.to) !== -1) {
          this.setState({ current: [subItem.to] });
          return;
        }
      }
    }
  }

  componentDidMount = () => {}

  onSelect = (info) => {
    this.setState({ current: [info.key] });
  }

  render() {
    return <ZSideNavigation
      menus={g_pageMenuDef}
      collapse={this.props.collapse}
      defaultOpenKeys={this.state.defaultOpenKeys}
      defaultSelectedKeys={this.state.current}
      selectedKeys={this.state.current}
      onSelect={ this.onSelect }
    />;
  }
}
