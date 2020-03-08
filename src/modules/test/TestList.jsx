import React from 'react';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import i18n from 'i18next';
import { Card } from 'antd';
import {
  ZTable, ZIcon, ZButton,
  ZPageHeader, ZUpload,
} from 'components';

const {
  ZBtn, ZExportExcelBtn, ZDelBtn, ZDefBtn,
} = ZButton;

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
        dataIndex: 'code',
        className: 'table-column-center',
      }, {
        title: '账号',
        dataIndex: 'account',
        className: 'table-column-center',
      }, {
        title: 'email',
        dataIndex: 'email',
        className: 'table-column-center',
      }, {
        title: '手机号',
        className: 'table-column-center',
        dataIndex: 'tel',
      }, {
        title: '创建时间',
        className: 'table-column-left',
        dataIndex: 'createdAt',
        render: (value) => moment(value * 1000).format('YYYY-MM-DD HH:mm:ss'),
      }, {
        title: '更新时间',
        className: 'table-column-left',
        dataIndex: 'updatedAt',
        render: (value) => moment(value * 1000).format('YYYY-MM-DD HH:mm:ss'),
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
    };

    this.params = {
      page: 1,
      pageSize: 10,
    };
    this.resourceStore = props.stores.testStore;
  }

  componentDidMount = () => {
    this.resourceStore.list();
  }

  onSearch = (value) => {
    const params = {
      ...this.params,
    };
    if (value) {
      params.value = value;
    }
    this.resourceStore.list(params);
  }

  onRefreshBtn = () => {
    this.resourceStore.list();
  }

  handleTabeChange = (pagination) => {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({ pagination: pager });
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.params = params;
    this.resourceStore.list(params);
  }

  iconClick = () => {
  }

  render() {
    const breadcrumbItems = [
      {
        content: '主页',
        to: '/group/dockingplatform',
        icon: 'home',
      }, {
        content: '账号服务',
        to: '/group/dockingplatform/crs',
      }, {
        content: '用户列表',
      }, {
        icon: <ZIcon iconfont='&#xe629;' style={{ marginRight: '4px' }}/>,
        content: 'sfsf',
      },
    ];

    return (
      <>
        <ZPageHeader
          items={breadcrumbItems}
          separator="*"
          content='楼宇/房型列表'
          switchDisabled
        />
        <div className="page-content">
          <Card>
            <ZIcon type='&#xe629;' onClick={this.iconClick}/>
            <ZBtn type="create" disabled href="/zplatorm/sidenav/accountservice/accountedit" />
            <ZBtn type="create" href="/zplatorm/sidenav/accountservice/accountedit" />

            <ZBtn type="edit" href="/zplatorm/sidenav/accountservice/accountedit" />

            <ZBtn type="batch" onClick={this.onRefreshBtn}/>
            <ZBtn type="refresh" onClick={this.onRefreshBtn}/>
            <ZBtn type="sync" onClick={this.onRefreshBtn}/>
            <ZBtn type="retrieve" href="/zplatorm/sidenav/accountservice/accountedit" onClick={this.onRefreshBtn}/>
            <ZExportExcelBtn href={`/group/api/groups/${'ll'}/exportexcel/orders`} params={this.params} fileName='集团管理-订单管理-无效订单' />
            <ZExportExcelBtn type='date' href={`/group/api/groups/${'ll'}/exportexcel/orders`} params={this.params} fileName='集团管理-订单管理-无效订单' />
            <ZBtn type="status"/>
            <ZBtn type="status" status={false}/>
            <ZDelBtn/>
            <ZDefBtn icon='apple'/>
            <ZUpload/>

            <ZTable
              bordered
              // disableLeftTitle
              // disableColumnMenu
              // disableSearchInput
              size="small"
              searchInputPlaceholder={i18n.t('searchInputPlaceholder')}
              rowKey={ (record) => record.id }
              columns={ this.state.columns }
              loading={ this.resourceStore.loading }
              dataSource={ this.resourceStore.items.slice() }
              pagination={ {
                ...this.state.pagination,
                total: this.resourceStore ? this.resourceStore.total : 10,
              } }
              onSearch={this.onSearch}
              onChange={this.handleTabeChange}
              onSearchChange={(e) => {
                this.setState({ search: e.target.value });
              }}
              searchValue={this.state.search}
            />
          </Card>
        </div>
      </>);
  }
}
