/*
 * Project: view
 * File: ZAppTopNav.jsx
 * Created Date: 2019-11-17 09:47:43
 * Author: Zz
 * Last Modified: 2019-12-23 23:17:03
 * Modified By: Zz
 * Description: 头导航
 */

import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import NoticeIcon from 'ant-design-pro/lib/NoticeIcon';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
// import HeaderSearch from 'ant-design-pro/lib/HeaderSearch';
import { Layout, Menu, Row, Tag, Col, Dropdown, Avatar, Modal } from 'antd';
import config from 'config';

const { Header } = Layout;
const { confirm } = Modal;

function getNoticeData(notices) {
  if (notices.length === 0) {
    return {};
  }
  const newNotices = notices.map((notice) => {
    const newNotice = {
      ...notice,
    };
    // transform id to item key
    if (newNotice.id) {
      newNotice.key = newNotice.id;
    }
    if (newNotice.extra && newNotice.status) {
      const color = {
        todo: '',
        processing: 'blue',
        urgent: 'red',
        doing: 'gold',
      }[newNotice.status];
      newNotice.extra = (
        <Tag color={color} style={{ marginRight: 0 }}>
          {newNotice.extra}
        </Tag>
      );
    }
    return newNotice;
  });
  return newNotices.reduce((pre, data) => {
    if (!pre[data.type]) {
      pre[data.type] = [];
    }
    pre[data.type].push(data);
    return pre;
  }, {});
}

@inject('stores') @observer
export default class ZAppTopNavigation extends React.Component {
  static propTypes = {
    collapse: PropTypes.bool,
    onCollapseChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      notices: [],
    };

    this.appStore = props.stores.appStore;
  }

  componentDidMount = () => {
    this.appStore.getNoticationData((err, ret) => {
      if (err) return;
      this.setState({ notices: ret.data });
    });
    // 定时器，每5秒拉一次数据
    setInterval(() => {
      this.appStore.getNoticationData((err, ret) => {
        if (err) return;
        this.setState({ notices: ret.data });
      });
    }, 5000);
  }

  showConfirm = () => {
    const _this = this;
    confirm({
      title: '是否退出?',
      onOk() {
        _this.appStore.logout();
      },
      onCancel() { },
    });
  }

  handleMenuClick = (e) => {
    switch (e.key) {
      case '1': this.showConfirm(); break;
      default:
    }
  }

  render() {
    const { notices } = this.state;
    const { collapse } = this.props;
    const noticeData = getNoticeData(notices);
    return (
      <Header style={{
        background: '#fff',
        padding: 0,
        marginLeft: collapse ? 80 : 250,
        position: 'fixed',
        zIndex: 1,
        width: collapse ? 'calc(100vw - 64px)' : 'calc(100vw - 250px)',
      }}>
        <Row justify='space-between' style={{ marginRight: 24 }}>
          <Col span={4}>
            <LegacyIcon
              className="trigger"
              type={collapse ? 'menu-unfold' : 'menu-fold'}
              onClick={this.props.onCollapseChange}
            />
          </Col>
          <Col span={20}>
            <div className='ant-layout-header-right'>
              {/** <span className='ant-layout-header-right-item'>
                <HeaderSearch
                  placeholder="站内搜索"
                  dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
                  onSearch={value => {
                    console.log('input', value); // eslint-disable-line
                  }}
                  onPressEnter={value => {
                    console.log('enter', value); // eslint-disable-line
                  }}
                  defaultOpen={false}
                />
              </span>
              <span className='ant-layout-header-right-item'>
                <Tooltip title="使用文档ooo">
                  <Icon type="question-circle" />
                </Tooltip>
              </span>
               */}
              <div className='ant-layout-header-right-item'>
                <NoticeIcon
                  count={notices.length}
                  onClear={(e) => console.log('-----', e)}
                  locale={{ clear: '清除' }}
                  onItemClick={(e) => {
                    if (e.url) {
                      this.props.history.push(e.url);
                    }
                  }}
                 >
                  <NoticeIcon.Tab
                    showClear={false}
                    list={noticeData.notification}
                    title="通知"
                    emptyText="你已查看所有通知"
                    emptyImage="https://aius-public.aiusmart.com/notification.svg"
                  />
                  <NoticeIcon.Tab
                    showClear={false}
                    list={noticeData.message}
                    title="消息"
                    emptyText="您已读完所有消息"
                    emptyImage="https://aius-public.aiusmart.com/message.svg"
                  />
                  <NoticeIcon.Tab
                    showClear={false}
                    list={noticeData.event}
                    title="待办"
                    emptyText="你已完成所有待办事项"
                    emptyImage="https://aius-public.aiusmart.com/pedding.svg"
                  />
                </NoticeIcon>
              </div>

              <span className='ant-layout-header-right-item'>
                <Dropdown
                  overlay={
                    <Menu onClick={this.handleMenuClick} style={{ width: 160 }}>
                      <Menu.Item key='1'>
                        <span><LogoutOutlined />&nbsp;&nbsp;退出</span>
                      </Menu.Item>
                      <Menu.Item key='2'>
                        <Link to={`${config.pagePrefix}/system/mesetting?id=${this.appStore.payload.id}`}><SettingOutlined />&nbsp;&nbsp;账号设置</Link>
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomLeft"
                >
                  <span>
                    <Avatar size='small' src={this.appStore.payload.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'} />
                    &nbsp;
                    {this.appStore.payload.name}
                  </span>
                </Dropdown>
              </span>
              <span className='ant-layout-header-right-item'>
                {this.appStore.payload.hotelName || ''}
              </span>
            </div>
          </Col>
        </Row>
      </Header>
    );
  }
}

ZAppTopNavigation.defaultProps = {
  collapse: false,
};
