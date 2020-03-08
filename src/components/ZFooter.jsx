/*
 * Project: view
 * File: ZFooter.jsx
 * Created Date: 2019-11-17 09:47:43
 * Author: Zz
 * Last Modified: 2019-12-23 23:54:19
 * Modified By: Zz
 * Description: 页脚
 */

import React from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import config from 'config';

const { Footer } = Layout;

export default class ZFooter extends React.Component {
  static propTypes = {
    collapse: PropTypes.bool,
  }

  render = () => (
    <Footer style={{
      marginLeft: this.props.collapse ? 64 : 0,
      textAlign: 'center',
      height: 50,
      padding: 0,
    }}>
      {config.copyright} &nbsp;v{config.version}
    </Footer>
  )
}

ZFooter.defaultProps = {
  collapse: false,
};
