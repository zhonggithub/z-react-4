/*
 * @Author: Zz
 * @Date: 2017-04-10 21:16:40
 * @Last Modified by: Zz
 * @Last Modified time: 2018-07-29 22:15:55
 */
import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Switch } from 'antd';
import PropTypes from 'prop-types';
import { computed } from 'mobx';

export default class ZContentHeader extends React.Component {
  static propTypes = {
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    color: PropTypes.string,
    icon: PropTypes.string,
    iconfont: PropTypes.string,
    type: PropTypes.oneOf(['edit', 'list', 'update']),
    fontSize: PropTypes.string,
    defaultSwitchChecked: PropTypes.bool,
    onSwitchChange: PropTypes.func,
    switchDisabled: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  @computed get style() {
    const style = { fontSize: this.props.fontSize || '16px' };
    if (this.props.color) { style.color = this.props.color; } else if (this.props.type && (this.props.type === 'edit' || this.props.type === 'update')) { style.color = '#e26a6a'; }
    return style;
  }

  @computed get titleStyle() {
    const tmpStyle = { marginRight: '10px' };
    if (this.props.iconfont) {
      return <i className="iconfont" style={ tmpStyle }>{this.props.iconfont}</i>;
    }
    return tmpStyle;
  }

  @computed get icon() {
    let tmpType = 'appstore';
    switch (this.props.type) {
      case 'edit': case 'update': {
        tmpType = 'edit';
        break;
      }
      case 'list': {
        tmpType = 'appstore';
        break;
      }
      default: break;
    }
    return tmpType;
  }

  renderTitle() {
    return <LegacyIcon type={ this.props.icon || this.icon } style={ this.titleStyle }/>;
  }

  onChange = (is) => {
    if (!this.props.onSwitchChange) { return; }
    this.props.onSwitchChange(is);
  }

  renderSwitch() {
    if (this.props.switchDisabled) {
      return null;
    }
    if (this.props.type !== 'edit') {
      return null;
    }
    return (<label style={{ float: 'right', color: '#108ee9', fontSize: 14 }}>连续录入：<Switch checkedChildren="是" unCheckedChildren="否" onChange={ this.onChange } style={{ marginTop: -5 }} defaultChecked={this.props.defaultSwitchChecked}/> </label>);
  }

  render() {
    return (
      <div style={ this.style }>
        <div className="hms-content-header">
          { this.renderTitle() }{ this.props.content }
          { this.renderSwitch() }
        </div>
        <div className="ant-content-layout-header"></div>
      </div>
    );
  }
}

ZContentHeader.defaultProps = {
  defaultSwitchChecked: false,
  onSwitchChange: null,
  switchDisabled: false,
};
