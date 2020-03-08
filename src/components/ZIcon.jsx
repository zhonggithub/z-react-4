/*
 * @Author: Zz
 * @Date: 2017-04-10 21:17:12
 * @Last Modified by: Zz
 * @Last Modified time: 2019-09-17 15:12:02
 */
import React from 'react';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import { Icon as LegacyIcon } from '@ant-design/compatible';

require('../style/iconfont.css');

export default class ZIcon extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    icon: PropTypes.string,
    iconfont: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.object,
  }

  @computed get style() {
    const tmpStyle = this.props.style || {};
    if (this.props.icon) {
      return { fontSize: `${this.props.size || 16}px`, ...tmpStyle };
    }
    return {
      fontSize: `${this.props.size || 16}px`, marginRight: '8px', display: 'inline-block', ...tmpStyle,
    };
  }

  render() {
    const { type } = this.props;

    const tmpProps = { ...this.props };
    for (const item in this.props) {
      if ({}.hasOwnProperty.call(this.props, item)) {
        switch (item) {
          case 'icon': case 'iconfont': case 'size': case 'className': {
            delete tmpProps[item];
            break;
          }
          default:
        }
      }
    }

    if (type) {
      if (type.startsWith('&#')) {
        return (<i className="iconfont" { ...tmpProps } style={this.style}>{ type}</i>);
      }
      return <LegacyIcon { ...tmpProps } type={type} style={this.style} />;
    }

    if (this.props.icon) {
      return <LegacyIcon { ...tmpProps } type={this.props.icon} style={this.style} />;
    }
    return (<i className="iconfont" { ...tmpProps } style={this.style}>{ this.props.iconfont}</i>);
  }
}
