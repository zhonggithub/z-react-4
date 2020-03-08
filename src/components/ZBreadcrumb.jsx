/**
* @Author: Zz
* @Date:   2016-09-14T19:25:42+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-08T23:33:17+08:00
*/
import React from 'react';
import { computed } from 'mobx';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ZIcon from './ZIcon';

export default class ZBreadcrumb extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      content: PropTypes.string,
      to: PropTypes.string,
      icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
      ]),
    })),
    separator: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderIcon = (item) => {
    if (!item.icon) {
      return null;
    }
    return typeof item.icon === 'string' ? <ZIcon icon={item.icon} style={{ marginRight: '5px' }}/> : item.icon;
  }

  @computed get separator() {
    return this.props.separator || '>';
  }

  renderLink(item) {
    if (item.to) {
      return <Link to={item.to}>
        {this.renderIcon(item)}
        {item.content}
      </Link>;
    }
    return (<span>{this.renderIcon(item)} {item.content}</span>);
  }

  renderItem() {
    const { items } = this.props;
    if (!items || items.length === 0) { return null; }

    let i = 0;
    return items.map((item) => {
      i += 1;
      return (
        <Breadcrumb.Item key={`breadcrumb${i}`} style={{ fontSize: '14px' }}>
          {this.renderLink(item)}
        </Breadcrumb.Item>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="hms-layout-breadcrumb">
          <Breadcrumb separator={this.separator}>
            {this.renderItem()}
          </Breadcrumb>
        </div>
        <div className="hms-breadcrumb-content-layout-header"></div>
      </div>
    );
  }
}
