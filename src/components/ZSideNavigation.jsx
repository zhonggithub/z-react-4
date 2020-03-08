/**
* @Author: Zz
* @Date:   2016-10-08T21:43:45+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-09T23:26:08+08:00
*/
import React from 'react';
import PropTypes from 'prop-types';
import { Link, history } from 'react-router-dom';
import { Menu } from 'antd';
import ZIcon from './ZIcon';

const { SubMenu } = Menu;

export default class ZSideNavigation extends React.Component {
  static propTypes = {
    collapse: PropTypes.bool,
    defaultSelectedKeys: PropTypes.array,
    defaultOpenKeys: PropTypes.array,
    selectedKeys: PropTypes.array,
    onSelect: PropTypes.func,
    onClick: PropTypes.func,
    menus: PropTypes.arrayOf(PropTypes.shape({
      to: PropTypes.string,
      text: PropTypes.string,
      icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
      ]),
      inlineIcon: PropTypes.element, // icon 为PropTypes.element 需要定义
      item: PropTypes.arrayOf(PropTypes.shape({
        to: PropTypes.string,
        text: PropTypes.string,
        icon: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.element,
        ]),
        inlineIcon: PropTypes.element,
      })),
    })).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    };
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
    history.replace(e.key);
  }

  rendIcon(item) {
    if (!item) return null;

    if (item.inlineIcon && this.props.collapse) {
      return item.inlineIcon;
    }

    if (typeof item.icon !== 'string' && !this.props.collapse) {
      return item.icon;
    }

    if (typeof item.icon === 'string') { return (<ZIcon icon={item.icon} size={this.props.collapse ? 24 : 16 }/>); }

    return null;
  }

  renderMenuItem(items) {
    if (!items) { return null; }
    return items.map((item) => {
      if (item.items) {
        return this.renderSubMenu([item], false);
      }
      const iconTitle = this.rendIcon(item);
      return <Menu.Item key={ item.to } className="ant-menu-item">
              <Link to={{
                pathname: item.to,
              }}>
                <span className="hms-span-text" > { iconTitle } { item.text } </span>
              </Link>
            </Menu.Item>;
    });
  }

  renderSubMenu(menus, isFirstLevelMenus = true) {
    if (!menus) { return null; }
    const tmpStyle = isFirstLevelMenus ? 'hms-collapse-menu-submenu-title' : 'hms-collapse-menu-second-submenu-title';
    return menus.map((item) => {
      const iconTitle = this.rendIcon(item);
      if (!item.items) {
        return (<Menu.Item key={ item.key || item.to} className="ant-menu-submenu-title">
          <Link to={{
            pathname: item.to,
          }}>
            <span className='hms-span-text'>{iconTitle}{this.props.collapse && isFirstLevelMenus ? '' : <span>{ item.text }</span>}</span>
          </Link>
        </Menu.Item>);
      }
      return (
        <SubMenu
          key={ item.key || item.to }
          title={
            <span className={
              this.props.collapse
                ? tmpStyle
                : 'hms-span-text'}
            >{iconTitle}{this.props.collapse && isFirstLevelMenus ? '' : <span>{ item.text}</span>}</span>}>
          { this.renderMenuItem(item.items) }
        </SubMenu>
      );
    });
  }

  onCollapseChange = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  render() {
    return (
      <Menu mode={this.props.collapse ? 'vertical' : 'inline'}
        defaultSelectedKeys={ this.props.defaultSelectedKeys }
        defaultOpenKeys={ this.props.defaultOpenKeys }
        selectedKeys={ this.props.selectedKeys }
        onSelect={ this.props.onSelect }
        onClick={ this.props.onClick }
        // style={{background: '#293542'}}
        {...this.props}
      >
        {this.renderSubMenu(this.props.menus)}
      </Menu>
    );
  }
}
