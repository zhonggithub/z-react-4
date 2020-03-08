/* eslint-disable max-classes-per-file */
/*
 * File: ZButton.jsx
 * Project: z-react
 * FilePath: /src/components/ZButton.jsx
 * Created Date: 2019-12-29 11:14:03
 * Author: Zz
 * -----
 * Last Modified: 2020-01-04 10:34:33
 * Modified By: Zz
 * -----
 * Description:
 */

import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { DeleteOutlined, DownOutlined, FileExcelOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Dropdown, Modal, message, InputNumber, Popconfirm } from 'antd';
import querystring from 'querystring';
import moment from 'moment';
import ZDatePicker from './ZDatePicker';

class ZBtn extends React.Component {
  static propTypes = {
    href: PropTypes.string,
    type: PropTypes.oneOf(['create', 'retrieve', 'info', 'refresh', 'edit', 'status', 'batch', 'sync', 'def']),
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // 状态按钮为array
    size: PropTypes.oneOf(['large', 'small']),
    overlay: PropTypes.element, // 批量操作按钮
    status: PropTypes.bool, // 态态按钮设置false 样式不一样
    icon: PropTypes.oneOfType([PropTypes.array, PropTypes.string]), // 状态按钮为array
  }

  render() {
    let padding = '2px 10px 2px 6px';
    if (this.props.size === 'large') { padding = '4px 14px 4px 8px'; }
    const tmp = { padding };
    const tmpStyle = {
      margin: '5px',
      outline: '0 none',
      cursor: 'pointer',
      ...tmp,
      ...(this.props.style || {}),
    };
    let btnClassName = 'ant-create-btn';
    let btnIcon = 'plus';
    let text = this.props.text || '创建';
    switch (this.props.type) {
      case 'create': {
        btnClassName = 'ant-create-btn';
        btnIcon = this.props.icon || 'plus';
        text = this.props.text || '创建';
        break;
      }
      case 'edit': {
        btnClassName = 'ant-edit-btn';
        btnIcon = this.props.icon || 'edit';
        text = this.props.text || '编辑';
        break;
      }
      case 'retrieve': case 'info': {
        btnClassName = 'ant-retrieve-btn';
        btnIcon = this.props.icon || 'info-circle-o';
        text = this.props.text || '查看详情';
        break;
      }
      case 'refresh': {
        btnClassName = 'ant-refresh-btn';
        btnIcon = this.props.icon || 'reload';
        text = this.props.text || '刷新';
        break;
      }
      case 'batch': {
        btnClassName = 'ant-batch-btn';
        btnIcon = this.props.icon || 'check-square-o';
        text = this.props.text || '批量操作';
        break;
      }
      case 'sync': {
        btnClassName = 'ant-sync-btn';
        btnIcon = this.props.icon || 'retweet';
        text = this.props.text || '同步';
        break;
      }
      case 'status': {
        btnClassName = 'ant-status-btn';
        if (this.props.status === false) {
          btnClassName = 'ant-status-btn-false';
        }
        btnIcon = this.props.icon || ['unlock', 'lock'];
        text = this.props.text || ['有效', '无效'];
        break;
      }
      default: {
        break;
      }
    }

    switch (this.props.type) {
      case 'create': case 'edit': case 'retrieve': case 'info': {
        const icon = <LegacyIcon type={ btnIcon } className="icon-margin-btn"/>;
        if (this.props.disabled) {
          return (
            <button
              className={ btnClassName }
              style={{ ...tmpStyle, background: '#bcbcbc', borderColor: '#bcbcbc' }}
              onClick={this.props.onClick }
            >
               {icon}{text}
            </button>
          );
        }
        return (
          <button
            className={ btnClassName }
            style={tmpStyle}
            onClick={this.props.onClick }
          >
            <Link style={ { color: '#fff' } } to={this.props.href}>{icon}{text}</Link>
          </button>
        );
      }
      case 'refresh': case 'sync': {
        const icon = <LegacyIcon type={ btnIcon } className="icon-margin-btn"/>;
        if (this.props.disabled) {
          return (
            <button
              className={ btnClassName }
              style={{ ...tmpStyle, background: '#bcbcbc', borderColor: '#bcbcbc' }}
              onClick={this.props.onClick }
            >
              {icon}{text}
            </button>
          );
        }
        return (
          <button
            className={ btnClassName }
            style={tmpStyle}
            onClick={this.props.onClick }
          >
            {icon}{text}
          </button>
        );
      }
      case 'batch': {
        const icon = <LegacyIcon type={ btnIcon } className="icon-margin-btn"/>;
        const overlay = this.props.overlay || [];
        if (this.props.disabled) {
          return (
            <Dropdown overlay={overlay}>
              <button
                className={ btnClassName }
                style={{ ...tmpStyle, background: '#bcbcbc', borderColor: '#bcbcbc' }}
                onClick={this.props.onClick }
              >
                {icon}{text}<DownOutlined />
              </button>
            </Dropdown>
          );
        }
        return (
          <Dropdown overlay={ overlay }>
            <button
              className={ btnClassName }
              style={tmpStyle}
              onClick={this.props.onClick }
            >
              {icon}{text}<DownOutlined />
            </button>
          </Dropdown>
        );
      }
      case 'status': {
        const icon = <LegacyIcon type={this.props.status === false ? btnIcon[1] : btnIcon[0]} className="icon-margin-btn"/>;
        if (this.props.disabled) {
          return (
            <button
              className={ btnClassName }
              style={{ ...tmpStyle, background: '#bcbcbc', borderColor: '#bcbcbc' }}
              onClick={this.props.onClick }
            >
              {icon}{ this.props.status === false ? text[1] : text[0]}
            </button>
          );
        }
        return (
          <button
            className={ btnClassName }
            style={tmpStyle}
            onClick={this.props.onClick }
          >
            {icon}{ this.props.status === false ? text[1] : text[0]}
          </button>
        );
      }
      default: return '';
    }
  }
}

class ZDelBtn extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    size: PropTypes.oneOf(['large', 'small']),
    text: PropTypes.string,
    disabled: PropTypes.bool,
  }

  render() {
    let padding = '2px 10px 2px 6px';
    if (this.props.size === 'large') { padding = '4px 14px 4px 8px'; }
    const tmp = { padding };
    const tmpStyle = {
      margin: '5px',
      outline: '0 none',
      cursor: 'pointer',
      ...tmp,
      ...(this.props.style || {}),
    };
    if (this.props.disabled) {
      return (
        <button
          className="ant-delete-btn"
          style={{ ...tmpStyle, background: '#bcbcbc' }}
        >
          <DeleteOutlined className="icon-margin-btn" />{this.props.text || '删除'}
        </button>
      );
    }
    return (
      <Popconfirm title="确定删除吗？" okText="是" cancelText="否" onConfirm={this.props.onClick}>
        <button
          className="ant-delete-btn"
          style={tmpStyle}
        >
          <DeleteOutlined className="icon-margin-btn" />{this.props.text || '删除'}
        </button>
      </Popconfirm>
    );
  }
}

class ZDefBtn extends React.Component {
  static propTypes = {
    href: PropTypes.string,
    text: PropTypes.string,
    icon: PropTypes.string,
    iconfont: PropTypes.element,
    onClick: PropTypes.func,
    size: PropTypes.oneOf(['large', 'small']),
    disabled: PropTypes.bool,
    className: PropTypes.string,
  }

  render() {
    let className = 'ant-def-btn';
    if (this.props.size === 'lagre') {
      className = 'ant-def-btn-lagre';
    }
    let content = (<span><LegacyIcon type={this.props.icon} className="icon-margin-btn"/>{this.props.text || '自定义'}</span>);
    if (this.props.iconfont) {
      content = (<span>{this.props.iconfont}{this.props.text || '自定义'}</span>);
    }
    let padding = '2px 10px 2px 6px';
    if (this.props.size === 'large') { padding = '4px 14px 4px 8px'; }

    const tmpStyle = { background: '#bcbcbc', padding, ...(this.props.style || {}) };
    if (this.props.disabled) {
      return (<button
        className={this.props.className || className} style={tmpStyle}
      >
        {content}
      </button>);
    }

    const style = this.props.style || {};
    style.padding = padding;
    if (this.props.href) {
      return (
        <Link to={this.props.href || 'javascript:;'} style={style} className={this.props.className || className} onClick={this.props.onClick}>
          {content}
        </Link>
      );
    }

    return (<button
      style={style}
      onClick={this.props.onClick}
      className="ant-def-btn"
    >
      {content}
    </button>);
  }
}

class ZExportExcelBtn extends React.Component {
  static propTypes = {
    href: PropTypes.string.isRequired,
    text: PropTypes.string,
    onClick: PropTypes.func,
    size: PropTypes.oneOf(['large', 'small']),
    params: PropTypes.object,
    fileName: PropTypes.string,
    type: PropTypes.oneOf(['number', 'date']),
  }

  constructor(props) {
    super(props);
    this.state = {
      unit: 2000,
      begin: 1,
      end: 2000,
      visible: false,

      date: [moment().subtract(7, 'days').startOf('day'), moment()],
    };
  }

  onClick = () => {
    if (!this.props.href) {
      message.error('错误的href!');
      return;
    }

    const { type } = this.props;
    if (type === 'number') {
      const params = {
        ...this.props.params,
        offset: this.state.begin - 1,
        limit: this.state.end - this.state.begin + 1,
      };
      if (this.props.fileName) {
        params.fileName = this.props.fileName;
      }

      location.href = `${this.props.href}?${querystring.stringify(params)}&token=${sessionStorage.getItem('jwt:token')}`;
      this.setState({
        unit: 2000,
        begin: 1,
        end: 2000,
      });
    } else {
      const { date } = this.state;
      if (date.length === 0) {
        message.error('未选择时间!');
        return;
      }

      const params = {
        ...this.props.params,
        date: `[${date[0].startOf('day').unix()},${date[1].endOf('day').unix()}]`,
      };
      location.href = `${this.props.href}?${querystring.stringify(params)}&token=${sessionStorage.getItem('jwt:token')}`;
    }
  }

  onInputNumberChange = (type, value) => {
    switch (type) {
      case 'begin': {
        this.setState({
          begin: value,
          end: this.state.begin + this.state.unit - 1,
        });
        break;
      }
      case 'end': {
        this.setState({
          end: value,
        });
        break;
      }
      default:
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    this.onClick();
    this.setState({
      visible: false,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      date: [moment().subtract(7, 'days').startOf('day'), moment()],
    });
  }

  showConfirm = () => {
    const _this = this;
    const content = <div>
      <InputNumber min={1} step={10} defaultValue={1} onChange={_this.onInputNumberChange.bind(_this, 'begin')}/>
      <span> 至 </span>
      <InputNumber step={10} min={1} max={this.state.begin + this.state.unit - 1} defaultValue={this.state.unit} onChange={_this.onInputNumberChange.bind(_this, 'end')}/>
    </div>;
    Modal.info({
      title: '一次最多只能导出2000条数据',
      content,
      onOk() {
        if (_this.props) { _this.onClick(); }
      },
      onCancel() {
      },
    });
  }

  renderNumberType = () => {
    let padding = '2px 10px 2px 6px';
    if (this.props.size === 'large') { padding = '4px 14px 4px 8px'; }
    const tmp = { padding };
    const tmpStyle = {
      outline: '0 none',
      cursor: 'pointer',
      margin: '5px',
      ...tmp,
      ...(this.props.style || {}),
    };

    const content = <div>
      <InputNumber min={1} step={10} defaultValue={1} onChange={this.onInputNumberChange.bind(this, 'begin')}/>
      <span> 至 </span>
      <InputNumber step={10} min={1} max={this.state.begin + this.state.unit - 1} defaultValue={this.state.unit} onChange={this.onInputNumberChange.bind(this, 'end')}/>
    </div>;
    return (
      <span>
        <button
          className="ant-export-excel-btn"
          style={tmpStyle}
          onClick={this.props.onClick || this.showModal}
        >
          <FileExcelOutlined className="icon-margin-btn" />{this.props.text || '导出Excel'}
        </button>

        <Modal title={<span><InfoCircleOutlined style={{ fontSize: '24px', color: '#108ee9' }} /> 一次最多只能导出 2000 条数据</span>} visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
        >
          {content}
        </Modal>
      </span>
    );
  }

  onDateChange = (value) => {
    if (value.length === 0) return;
    this.setState({ date: value });
  }

  renderDateType = () => {
    let padding = '2px 10px 2px 6px';
    if (this.props.size === 'large') { padding = '4px 14px 4px 8px'; }
    const tmp = { padding };
    const tmpStyle = {
      margin: '5px',
      outline: '0 none',
      cursor: 'pointer',
      ...tmp,
      ...(this.props.style || {}),
    };

    return <>
      <button
        onClick={this.props.onClick || this.showModal}
        className="ant-export-excel-btn"
        style={tmpStyle}
      >
        <FileExcelOutlined className="icon-margin-btn" />{this.props.text || '导出Excel'}
      </button>
      <Modal
        title={<span><InfoCircleOutlined style={{ fontSize: '24px', color: '#108ee9' }} /> 一次最多只能导出一个月的数据</span>} visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <ZDatePicker
          onChange={this.onDateChange}
          defaultValue={this.state.date}
        />
      </Modal>
    </>;
  }

  render() {
    const { type } = this.props;
    return type === 'number' ? this.renderNumberType() : this.renderDateType();
  }
}

ZExportExcelBtn.defaultProps = {
  type: 'number',
};

export default {
  ZBtn, ZDelBtn, ZExportExcelBtn, ZDefBtn,
};
