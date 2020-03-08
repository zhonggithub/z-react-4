/**
* @Author: Zz
* @Date:   2016-09-14T19:25:42+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-08T23:33:17+08:00
*/
import React from 'react';
import { computed } from 'mobx';
import {
  Breadcrumb, Row, Col, Switch,
} from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ZIcon from './ZIcon';

export default class ZPageHeader extends React.Component {
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

    return items.map((item, index) => (
        <Breadcrumb.Item key={`breadcrumb${index}`} style={{ fontSize: '14px' }}>
          {this.renderLink(item, index)}
        </Breadcrumb.Item>
    ));
  }

  renderSwitch() {
    if (this.props.switchDisabled) {
      return null;
    }
    return (<span style={{ color: '#108ee9', fontSize: 14, float: 'right' }}>连续录入：<Switch checkedChildren="是" unCheckedChildren="否" onChange={ this.onChange } defaultChecked={this.props.defaultSwitchChecked}/> </span>);
  }

  onChange = (is) => {
    if (!this.props.onSwitchChange) { return; }
    this.props.onSwitchChange(is);
  }

  render() {
    return (
      <div className="and-page-header">
        <Breadcrumb separator={this.separator}>
          {this.renderItem()}
        </Breadcrumb>

        <Row justify='space-between' style={{ marginTop: 8 }}>
          <Col span={12}>
            <span className='page-header-title'>{this.props.content}</span>
          </Col>
          <Col span={12}>
            {
              this.renderSwitch()
            }
          </Col>
        </Row>
      </div>
    );
  }
}
