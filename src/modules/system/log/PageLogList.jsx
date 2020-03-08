/*
 * Project: view
 * File: PageLogList.jsx
 * Created Date: 2019-11-17 14:19:02
 * Author: Zz
 * Last Modified: 2020-01-04 15:18:33
 * Modified By: Zz
 * Description: 操作日志列表
 */

import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';
import ReactJson from 'react-json-view';
import {
  ZTable, ZPageHeader, ZButton,
} from 'components';

import { util } from 'common';
import { indexPage } from 'config';
import * as moduleConfig from '../config';

const { moduleName, resources } = moduleConfig;

const { ZBtn } = ZButton;

@inject('stores') @observer
export default class PageLogList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: 'id',
        dataIndex: 'id',
        className: 'table-column-hidden',
        key: 'id',
      }, {
        title: '操作人',
        dataIndex: 'name',
        className: 'table-column-center',
        key: 'name',
      }, {
        title: 'url',
        dataIndex: 'url',
        className: 'table-column-center',
        key: 'url',
      }, {
        title: '方法',
        dataIndex: 'method',
        className: 'table-column-center',
        key: 'method',
      }, {
        title: '参数',
        dataIndex: 'params',
        className: 'table-column-left',
        key: 'params',
        render: (value) => (<ReactJson
          src={value}
          displayObjectSize={false}
          displayDataTypes={false}/>),
      }, {
        title: 'ip',
        dataIndex: 'ip',
        className: 'table-column-center',
        key: 'ip',
      }, {
        title: 'code',
        dataIndex: 'code',
        className: 'table-column-center',
        key: 'code',
      }, {
        title: '描述',
        dataIndex: 'message',
        className: 'table-column-center',
        key: 'message',
      }, {
        title: '返回值',
        dataIndex: 'body',
        className: 'table-column-left',
        key: 'body',
        render: (value) => (<ReactJson
          style={{ width: 400 }}
          src={value}
          displayObjectSize={false}
          displayDataTypes={false}
          />),
      }, {
        title: '创建时间',
        className: 'table-column-hidden',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value) => util.formatDate(value),
      }, {
        title: '更新时间',
        className: 'table-column-hidden',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (value) => util.formatDate(value),
      }],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        defaultCurrent: 1,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '20', '40', '70', '100'],
        showTotal(total) {
          return `共 ${total} 条`;
        },
      },
      breadcrumbItems: [
        {
          content: '主页',
          to: indexPage,
          icon: 'home',
        }, {
          content: '系统管理',
          to: util.getPageUrl(moduleName, resources.account),
        }, {
          content: '操作日志',
        },
      ],
    };

    this.params = {
      page: 1,
      pageSize: 10,
      sort: '-createdAt',
    };
    this.baseParams = {
      page: 1,
      pageSize: 10,
      sort: '-createdAt',
    };
    this.resourceStore = props.stores.logStore;
  }

  componentDidMount() {
    this.resourceStore.list();
  }

  onSearch = (value) => {
    this.params.search = value;
    this.resourceStore.list(this.params);
  }

  onRefreshBtn = () => {
    this.params = { ...this.baseParams };
    this.resourceStore.list(this.params);
  }

  handleTabeChange = (pagination, filters, sorter) => {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;

    this.setState({ pagination: pager });
    const params = {
      ...this.params,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sort: (!sorter || !sorter.order) ? '-createdAt' : `${sorter.order === 'descend' ? '-' : ''}${sorter.field}`,
    };
    if (this.state.search) {
      params.search = this.state.search;
    }
    this.params = params;
    this.resourceStore.list(params);
  }

  render() {
    const {
      pagination, columns, search, breadcrumbItems,
    } = this.state;
    const { total, items, loading } = this.resourceStore;
    return (
      <>
        <ZPageHeader
          items={breadcrumbItems}
          separator="*"
          content="日志列表"
          switchDisabled
        />
        <div className="page-content">
          <Card>
            <ZBtn type="refresh" onClick={this.onRefreshBtn} style={{ margin: 0 }}/>
            <ZTable
              bordered
              size="small"
              searchInputPlaceholder="操作人，应用名称"
              rowKey={ (record) => record.id }
              columns={ columns }
              loading={ loading }
              dataSource={ items.slice() }
              pagination={ {
                ...pagination,
                total,
              } }
              onSearch={this.onSearch}
              onChange={this.handleTabeChange}
              onSearchChange={(e) => {
                this.setState({ search: e.target.value });
              }}
              searchValue={search}
            />
          </Card>
        </div>
      </>);
  }
}
