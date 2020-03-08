/*
 * @Author: Zz
 * @Date: 2017-04-15 16:06:54
 * @Last Modified by: Zz
 * @Last Modified time: 2019-09-17 10:15:45
 */
import React from 'react';
import PropTypes from 'prop-types';
import { DownOutlined } from '@ant-design/icons';
import { Table, Menu, Checkbox, Dropdown, BackTop, Button, Input } from 'antd';

export default class ZTable extends React.Component {
  static propsType = {
    disableLeftTitle: PropTypes.bool,
    disableColumnMenu: PropTypes.bool,
    disableSearchInput: PropTypes.bool,
    searchInputPlaceholder: PropTypes.string,
    onSearch: PropTypes.func,
    onSearchChange: PropTypes.func,
    rowSelection: PropTypes.object,
    searchValue: PropTypes.string,
    searchWidth: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  menuItem() {
    const { columns } = this.props;
    if (!columns) { return null; }
    return columns.map((item) => (
        <Menu.Item key={item.title}>
          <Checkbox defaultChecked={item.className !== 'table-column-hidden'} onChange={this.checkboxOnChange.bind(this, item.title)}>
            {item.title}
          </Checkbox>
        </Menu.Item>
    ));
  }

  checkboxOnChange(item, e) {
    const { columns } = this.props;
    for (let i = 0; i < columns.length; i += 1) {
      if (columns[i].title === item) {
        if (e.target.checked) {
          if (columns[i].preClassName) { columns[i].className = columns[i].preClassName; } else {
            columns[i].className = columns[i].defaultClassName || 'table-column-center';
          }
        } else {
          columns[i].preClassName = null;
          columns[i].preClassName = `${columns[i].className}`;
          columns[i].className = 'table-column-hidden';
        }
        this.setState({ columns }); // 强制页面刷新
        return;
      }
    }
  }

  columnsDownMenu() {
    return (
      <Menu>
        {this.menuItem()}
      </Menu>
    );
  }

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }

  renderItemCountTitle() {
    if (!this.props.pagination || this.props.disableLeftTitle) {
      return null;
    }
    const { pagination } = this.props;
    const begin = (pagination.current - 1) * pagination.pageSize || 1;
    const end = ((pagination.current) * pagination.pageSize) > pagination.total
      ? pagination.total : (pagination.current) * pagination.pageSize || pagination.defaultPageSize;
    const { total } = pagination;
    return <span>显示第 {begin} 至 {end} 项结果，共 {total} 项</span>;
  }

  renderDownMenu() {
    if (!this.props.columns || (this.props.disableColumnMenu && this.props.disableSearchInput)) {
      return null;
    }
    return (
      <div className="hms-table-column-col-select-span-1">
        {
          this.props.disableSearchInput
            ? null
            : <Input.Search
              placeholder={ this.props.searchInputPlaceholder || ''}
              onSearch={this.props.onSearch}
              value={this.props.searchValue}
              onChange={this.props.onSearchChange}
              style={{ width: this.props.searchWidth || 200, marginTop: this.props.disableColumnMenu ? '0px' : '-1px' }}/>
        }
        {
          this.props.disableColumnMenu ? null : <Dropdown
            onVisibleChange={this.handleVisibleChange}
            visible={this.state.visible}
            overlay={this.columnsDownMenu()}
            trigger={['click']}
          >
            <Button type="ghost" style={{ marginLeft: 8, height: 32 }}>
              选择列 <DownOutlined />
            </Button>
          </Dropdown>
        }
      </div>
    );
  }

  render() {
    return (
      <>
        <div style={{ paddingTop: this.props.disableColumnMenu ? '0px' : '23px' }}>
          { this.renderItemCountTitle() }
          { this.renderDownMenu() }
          <div style={{ marginTop: this.props.disableLeftTitle && !this.props.disableColumnMenu ? '18px' : '0px' }}>
            <Table { ...this.props } />
          </div>
        </div>
        <BackTop/>
      </>
    );
  }
}
