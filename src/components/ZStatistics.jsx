/**
* @Author: Zz
* @Date:   2016-09-14T19:25:42+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-08T23:33:17+08:00
* @Description: 统计组件
*/
import React from 'react';
import ReactHighcharts from 'react-highcharts';
import { AreaChartOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import ZDatePicker from './ZDatePicker';

const { Option } = Select;

export default class ZStatistics extends React.Component {
static propTypes = {
  config: PropTypes.object,
  title: PropTypes.string,
  onChange: PropTypes.func, // 时间选择器回调函数,接受两个参数: dates, dateStrings
  datePicker: PropTypes.bool, // 是否显示时间选择器
  lineSelect: PropTypes.bool, // 是否显示图形选择器
}

constructor(props) {
  super(props);
  this.state = {
    config: {
      title: {
        text: '统计',
      },
    },
    selected: '',
    select: ['全部'],
  };
}

handleChange = (value) => this.setState({ selected: value })

renderOption() {
  const { config } = this.props;
  if (!config || !config.series || config.series.length === 0) { return null; }
  const tmpOptions = config.series.map(
    (item) => <Option value={item.name} key={item.name}>{item.name}</Option>,
  );
  const options = [];
  options.push(<Option value="全部" key="全部">全部</Option>);
  options.push(tmpOptions);
  return options;
}

renderSelect() {
  let tmpStyle = { width: 150, marginRight: '10px' };
  if (this.props.datePicker === false) { tmpStyle = { width: 150 }; }

  return <Select size="large" defaultValue="全部" style={tmpStyle} onChange={this.handleChange}>
              {this.renderOption()}
          </Select>;
}

render() {
  const config = { ...(this.props.config || this.state.config) };

  const tmp = config.series;
  if (this.state.selected !== '全部') {
    for (let i = 0; i < tmp.length; i += 1) {
      const item = tmp[i];
      if (item.name === this.state.selected) {
        config.series = [item];
        break;
      }
    }
  }

  return (
    <div className="hms-group-layout-border" >
      <div className="hms-statistics-title">
        <span style={{ fontSize: '16px', margin: '8px 0 -17px 10px' }}><AreaChartOutlined style={{ marginLeft: '10px', marginRight: '5px' }} />{this.props.title}</span>
        <div className="hms-statistics-title-right">
          { this.props.lineSelect === false ? null : this.renderSelect() }
          { this.props.datePicker === false ? null : <ZDatePicker size='large' onChange={this.props.onChange}/>}
        </div>
      </div>
      <div className="hms-statistics-title-header"></div>
      <ReactHighcharts config={config}></ReactHighcharts>
    </div>
  );
}
}
