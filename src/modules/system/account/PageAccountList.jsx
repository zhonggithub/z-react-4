/*
 * Project: view
 * File: PageAccountList.jsx
 * Created Date: 2019-11-17 14:19:02
 * Author: Zz
 * Last Modified: 2020-01-04 11:18:29
 * Modified By: Zz
 * Description: 账号列表
 */

import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Tag, Card,
} from 'antd';
import {
  ZTable, ZPageHeader, ZIcon, ZButton,
} from 'components';
import { util } from 'common';
import { indexPage } from 'config';
import * as moduleConfig from '../config';

const { moduleName, resources } = moduleConfig;
const { ZBtn, ZDelBtn } = ZButton;

@inject('stores') @observer
export default class PageAccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: 'id',
        dataIndex: 'id',
        className: 'table-column-hidden',
      }, {
        title: '用户名',
        dataIndex: 'name',
        className: 'table-column-center',
      }, {
        title: '手机号',
        dataIndex: 'tel',
        className: 'table-column-center',
      }, {
        title: '角色',
        className: 'table-column-center',
        dataIndex: 'role',
        render: (value) => {
          if (!value) {
            return '';
          }
          return value.name;
        },
      }, {
        title: '状态',
        className: 'table-column-center',
        dataIndex: 'status',
        render: (value) => (<Tag color={value === 1 ? '#87d068' : '#bcbcbc'}> <ZIcon icon={value === 1 ? 'check-circle-o' : 'close-circle-o' } size="12" /> { value === 1 ? '有效' : '无效'}</Tag>),
      }, {
        title: '创建时间',
        className: 'table-column-hidden',
        dataIndex: 'createdAt',
        render: (value) => util.formatDate(value),
      }, {
        title: '更新时间',
        className: 'table-column-hidden',
        dataIndex: 'updatedAt',
        render: (value) => util.formatDate(value),
      }, {
        title: '操作',
        className: 'table-column-left',
        key: 'action',
        render: (value, record, index) => (
          <span>
            <ZBtn type='edit' href={`${util.getPageUrl(moduleName, resources.account, true)}?id=${record.id}`} size="small"/>
            <ZBtn type='status' size="small" status={record.status !== 1 } onClick={this.onStatusBtn.bind(this, record, index)}/>
            <ZDelBtn onClick={this.onDelBtn.bind(this, record, index)}/>
          </span>
        ),
      }],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        defaultCurrent: 1,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
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
          content: '帐号管理',
        },
      ],
    };

    this.params = {
      page: 1,
      pageSize: 10,
    };
    this.baseParams = {
      page: 1,
      pageSize: 10,
    };
    this.resourceStore = props.stores.accountStore;
  }

  componentDidMount() {
    const params = global.store.getPageParams(this.props);
    if (params) {
      const { pagination } = this.state;
      pagination.current = params.page;
      pagination.pageSize = params.pageSize;

      this.params = params;
      this.setState({ pagination, search: params.search || '' });
    }
    this.resourceStore.list(this.params);
  }

  componentWillUnmount() {
    global.store.writePageParams(this.props, this.params);
  }

  onStatusBtn = (record) => {
    this.resourceStore.updateStatus(record.id, record.status ? 0 : 1, () => {
      this.resourceStore.list(this.params);
    });
  }

  onDelBtn = (record) => {
    this.resourceStore.delete(record.id, () => {
      this.resourceStore.list(this.params);
    });
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
          content="帐号管理"
          switchDisabled
        />
        <div className="page-content">
          <Card>
            <ZBtn style={{ marginLeft: 0 }} type="create" href={util.getPageUrl(moduleName, resources.account, true)} />
            <ZBtn type="refresh" onClick={this.onRefreshBtn} />
            <ZTable
              bordered
              size="small"
              searchInputPlaceholder="用户名"
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
