import React from 'react';
import { withRouter } from 'react-router-dom';
import { ZSideNavigation } from 'components';

const gPrefix = '/zplatorm/sidenav/';
// const gDefIconLargenSize = 24;

@withRouter
export default class SideNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageMenuDef: [
        {
          to: `${gPrefix}accountservice`,
          text: '账号服务',
          // icon: <ZIcon iconfont='&#xe629;' />,
          // inlineIcon: <ZIcon iconfont='&#xe629;' size={gDefIconLargenSize} marginRight='0px' />,
          icon: 'team',
          items: [
            {
              to: `${gPrefix}accountservice/account`,
              text: '账号管理',
              icon: 'user',
            },
          ],
        },
      ],
      current: [`${gPrefix}/hotels/list`],
      defaultOpenKeys: [`${gPrefix}/hotels`], // g_pageMenuDef.map( item => {return item.to;}),
    };
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
      } else {
        // return { current: [ subItem.to ], openKeys: [ item.key || item.to ] };
      }
    }
    return '';
  }

  renderSelectKey(item) {
    if (!item) {
      return '';
    }

    const localHref = this.props.location.pathname;
    if (!localHref) { return ''; }

    if (item.to && localHref === item.to) {
      return item.to;
    }

    if (!item.items) {
      return '';
    }

    for (const subItem of item.items) {
      if (localHref.indexOf(item.key || item.to) === 0) {
        return { current: [`${item.key || item.to}/list`], openKeys: [item.key || item.to] };
      }

      if (subItem.items) {
        const key = this.renderSelectKey(subItem);
        if (key) {
          key.openKeys.push(`${item.key || item.to}/list`);
          return key;
        }
      } else {
        // console.log('----', subItem.to);
        // return { current: [ subItem.to ], openKeys: [ item.key || item.to ] };
      }
    }
    return '';
  }

  UNSAFE_componentWillMount() {
    let key = '';
    for (const item of this.state.pageMenuDef) {
      key = this.getSelectKey(item);
      if (key) {
        this.setState({ ...key });
        return;
      }
    }
    for (const item of this.state.pageMenuDef) {
      key = this.renderSelectKey(item);
      if (key) {
        this.setState({ ...key });
        return;
      }
    }
  }

  componentDidMount = () => { }

  onSelect = (info) => {
    this.setState({ current: [info.key] });
  }

  onOpenChange = (openKeys) => {
    this.setState({ openKeys });
  }

  render() {
    return <ZSideNavigation
      menus={this.state.pageMenuDef}
      collapse={this.props.collapse}
      defaultOpenKeys={this.state.openKeys}
      defaultSelectedKeys={this.state.current}
      selectedKeys={this.state.current}
      onSelect={this.onSelect}
      openKeys={this.state.openKeys}
      onOpenChange={this.onOpenChange}
    />;
  }
}
