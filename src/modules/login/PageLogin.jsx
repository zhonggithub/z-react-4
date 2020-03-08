/*
 * File: PageLogin.jsx
 * Project: z-react
 * FilePath: /src/modules/login/PageLogin.jsx
 * Created Date: 2019-12-23 23:32:45
 * Author: Zz
 * -----
 * Last Modified: 2020-01-04 19:38:18
 * Modified By: Zz
 * -----
 * Description:
 */

import React from 'react';
import { observer, inject } from 'mobx-react';
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Row, Button, Menu, message, Checkbox } from 'antd';
import config from 'config';

function noop() {
  return false;
}

@inject('stores') @observer
class PageLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorText: '',
      codeUrl: `${config.apiPrefix}/captcha`,
      current: 'account',
      isShowErrorText: false,
      num: 120, // 秒
    };
    this.intervalTimer = null;

    this.account = document.cookie.replace(/(?:(?:^|.*;\s*)yeConsoleAccount\s*\=\s*([^;]*).*$)|^.*$/, '$1'); // eslint-disable-line
    this.password = document.cookie.replace(/(?:(?:^|.*;\s*)yeConsolePassword\s*\=\s*([^;]*).*$)|^.*$/, '$1'); // eslint-disable-line
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      const { appStore } = this.props.stores;

      if (this.account && this.password && this.password.slice(-8) === values.password) {
        appStore.login({
          account: this.account,
          password: this.password,
          kind: 'AT',
        });
        return;
      }

      if (this.state.current === 'account') {
        if (!values.account) {
          this.setState({ errorText: '请输入账号嗯！', isShowErrorText: true });
          return;
        }
        if (!values.password) {
          this.setState({ errorText: '请输入密码哦！', isShowErrorText: true });
          return;
        }
        if (!values.verificationCode) {
          this.setState({ errorText: '请输入验证码啦！', isShowErrorText: true });
          return;
        }
        values.kind = 'AP';
        appStore.login(values);
      } else {
        if (!values.mobile) {
          this.setState({ errorText: '请输入手机号嗯！', isShowErrorText: true });
          return;
        }
        if (!values.code) {
          this.setState({ errorText: '请输入验证码啦！', isShowErrorText: true });
          return;
        }
        appStore.login({
          account: values.mobile,
          password: values.code,
          kind: 'TV',
        });
      }
    });
  }

  renderErrorTitle() {
    if (!this.state.errorText || !this.state.isShowErrorText) {
      return null;
    }
    const rowStyle = { marginLeft: '28px', marginTop: '50px' };
    return (
      <Form.Item>
        <Row style={rowStyle}>
          <div className="sl-error sl-error-display"><span className="sl-error-text">{this.state.errorText}</span></div>
        </Row>
      </Form.Item>
    );
  }

  changeCode = () => {
    this.setState({ codeUrl: `${this.state.codeUrl}?t=${Date.now()}` });
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
      isShowErrorText: false,
      errorText: '',
    });
  }

  handleKeyPress = (e) => {
    switch (e.key) {
      case 'Enter':
        this.handleSubmit(e);
        break;
      default: break;
    }
  }

  renderAccountLayout = () => {
    if (this.state.current !== 'account') {
      return null;
    }
    const { getFieldDecorator } = this.props.form;
    const rowStyle = { marginLeft: '28px', marginTop: '20px' };
    return <>
      <Form.Item>
        <Row style={ !this.state.errorText ? { ...rowStyle, marginTop: '50px' } : { ...rowStyle, marginTop: '-10px' }}>
          {
            getFieldDecorator('account', {
              initialValue: this.account,
            })(
              <Input
                size="large"
                style={{ width: 260 }}
                prefix={
                  <UserOutlined style={{ fontSize: 13 }} />
                }
                placeholder="手机号"
              />,
            )
          }
        </Row>
      </Form.Item>
      <Form.Item>
        <Row style={{ ...rowStyle, marginTop: '-10px' }}>
          {
            getFieldDecorator('password', { initialValue: this.password ? this.password.slice(-8) : '' })(
              <Input
                size="large"
                style={{ width: 260 }}
                prefix={<LockOutlined style={{ fontSize: 13 }} />}
                type="password"
                autoComplete="off"
                placeholder="密码"
                onContextMenu={noop}
                onPaste={noop}
                onCopy={noop}
                onCut={noop}
              />,
            )}
        </Row>
      </Form.Item>
      <Form.Item>
        <Row style={{ ...rowStyle, marginTop: '-10px' }}>
          {
            getFieldDecorator('verificationCode')(
              <Input size="large" style={{ width: '100px', float: 'left' }} prefix={<LockOutlined style={{ fontSize: 13 }} />} autoComplete="off" onKeyPress={this.handleKeyPress} placeholder="验证码"
                />,
            )}
          <span className='code-style'>
            <img className='image-code-style' src={this.state.codeUrl} />
          </span>
          <a className='a-style' onClick={this.changeCode}>换一张</a>
        </Row>
      </Form.Item>
    </>;
  }

  changeMobileCode = () => {
    if (!this.props.form.getFieldValue('mobile')) {
      message.warning('请输入手机号码!');
      return;
    }
    const _this = this;
    this.setState({ num: 120 });
    this.intervalTimer = setInterval(() => {
      if (_this.state.num <= 0) {
        clearInterval(_this.intervalTimer);
      }
      const num = _this.state.num - 1;
      _this.setState({ num });
    }, 1000);
    this.props.stores.appStore.retrieveMobileCode({
      tel: this.props.form.getFieldValue('mobile'),
    });
  }

  renderMobileLayout = () => {
    if (this.state.current !== 'mobile') {
      return null;
    }
    const { getFieldDecorator } = this.props.form;
    const rowStyle = { marginLeft: '28px', marginTop: '20px' };
    return <>
      <Form.Item>
        <Row style={ !this.state.errorText ? { ...rowStyle, marginTop: '50px' } : { ...rowStyle, marginTop: '-10px' }}>
          {
            getFieldDecorator('mobile')(
              <Input size="large" style={{ width: '260px' }} prefix={<MobileOutlined style={{ fontSize: 13 }} />} placeholder="手机号" />,
            )
          }
        </Row>
      </Form.Item>
      <Form.Item>
        <Row style={{ ...rowStyle, marginTop: '-10px' }}>
          {
            getFieldDecorator('code')(
              <Input
                size="large" style={{ width: '160px', float: 'left' }}
                prefix={<LockOutlined style={{ fontSize: 13 }} />}
                autoComplete="off"
                placeholder="验证码"
                onKeyPress={this.handleKeyPress}
              />,
            )}
          {
            this.state.num > 0 && this.state.num !== 120 ? <a className='a-style'>{this.state.num}</a> : <a className='a-style' onClick={this.changeMobileCode}>动态验证码</a>
          }
        </Row>
      </Form.Item>
    </>;
  }

  render() {
    let style = {};
    if (this.state.current === 'account') {
      style = this.state.errorText ? { height: 320 } : {};
    } else {
      style = this.state.errorText ? { height: 260 } : { height: 220 };
    }

    const { getFieldDecorator } = this.props.form;

    return (
      <div className='page-login'>
        <div className='page-login-layout' style={ style }>
          <Menu
            mode="horizontal"
            onClick={this.handleClick}
            selectedKeys={ [this.state.current] }
          >
            <Menu.Item key="account" style={{ zIndex: 1, fontSize: '16px' }}>
              <UserOutlined />账号登入
            </Menu.Item>

            <Menu.Item key="mobile" style={{ float: 'right', zIndex: 1, fontSize: '16px' }}>
              <MobileOutlined />手机登入
            </Menu.Item>
          </Menu>
          <Form style={{ marginTop: '-40px' }}>
            { this.renderErrorTitle() }
            { this.renderAccountLayout() }
            { this.renderMobileLayout() }
            <Form.Item style={{ marginTop: -10, marginLeft: 28 }}>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>七天免登录</Checkbox>)}
              <Button style={{ float: 'right', marginRight: 28 }} type="primary" onClick={this.handleSubmit}>登录</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

PageLogin.displayName = 'PageLogin';

export default Form.create()(PageLogin);
