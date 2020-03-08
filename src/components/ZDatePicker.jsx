/**
* @Author: Zz
* @Date:   2016-10-07T20:15:31+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-07T20:30:47+08:00
*/
import { DatePicker } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const { RangePicker } = DatePicker;

export default class ZDatePicker extends React.Component {
  static propTypes = {
    onChange: PropTypes.func, // 接受两个参数: dates, dateStrings
    showTime: PropTypes.object,
    placeholder: PropTypes.array,
    format: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <RangePicker
        ranges={{
          前30天: [moment().subtract(30, 'days'), moment()],
          前15天: [moment().subtract(15, 'days'), moment()],
          前7天: [moment().subtract(7, 'days'), moment()],
          前2天: [moment().subtract(2, 'days'), moment()],
          上月: [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
          今天: [moment().startOf('day'), moment()],
          本月: [moment().startOf('month'), moment()],
        }}
        showTime={ this.props.showTime || { format: 'HH:mm' } }
        placeholder={ this.props.placeholder || ['起始时间', '截止时间'] }
        format={ this.props.format || 'YYYY-MM-DD HH:mm' }
        onChange={ this.props.onChange }
        {...this.props}
      />);
  }
}
