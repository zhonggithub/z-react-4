/*
 * Project: view
 * File: PageAccountEdit.jsx
 * Created Date: 2019-11-17 14:19:02
 * Author: Zz
 * Last Modified: 2020-01-04 21:50:50
 * Modified By: Zz
 * Description: 账号创建/编辑
 */

import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import queryString from 'query-string';
import { inject, observer } from 'mobx-react';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Input, Button, Select, AutoComplete, Card } from 'antd';
import validator from 'validator';
import { indexPage } from 'config';
import { ZPageHeader } from 'components';
import { util } from 'common';
import * as moduleConfig from '../config';

const { moduleName, resources } = moduleConfig;

@inject('stores') @withRouter @observer
class PageAccountEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
    this.id = null;
    this.resourceStore = props.stores.accountStore;
    this.roleStore = props.stores.roleStore;
  }

  componentDidMount() {
    this.resourceStore.init();
    this.getID();
    this.roleStore.listAll();
  }

  getID = () => {
    if (this.props.location.search) {
      const params = queryString.parse(this.props.location.search);
      if (!params.id) {
        return;
      }
      this.id = params.id;
      this.resourceStore.retrieve(this.id, {}, (err, data) => {
        if (err) {
          return;
        }
        this.setState({ modules: data.role.modules.map((item) => item.id) || [] });
      });
    } else {
      this.id = null;
    }
  }

  onFormSubmin = (e) => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }

      if (this.id) {
        this.resourceStore.update(this.id, values, () => {
          this.props.history.goBack();
        });
        return;
      }
      this.resourceStore.create(values, this.props.form, () => {
        global.store.refreshPageParamsByEdit();
        this.props.history.goBack();
      });
    });
  }

  renderGroupOption() {
    if (this.roleStore.allItems.length === 0) { return null; }
    return this.roleStore.allItems.map((item) => (
      <Select.Option
        value={ item.id }
        key={item.id}>{ item.name }</Select.Option>
    ));
  }

  onRoleChange = (value) => {
    this.roleStore.retrieve(value, {}, (err, data) => {
      if (err) {
        return;
      }
      this.setState({ modules: data.modules });
    });
  }

  handleEmailChange = (value) => {
    this.setState({
      dataSource: !value || value.indexOf('@') >= 0 ? [] : [
        `${value}@qq.com`,
        `${value}@gmail.com`,
        `${value}@163.com`,
      ],
    });
  }

  onSwitchChecked = (is) => {
    this.resourceStore.isSwitchChecked = is;
  }

  render() {
    const content = `帐号${this.id ? '编辑' : '创建'}`;
    const breadcrumbItems = [
      {
        content: '主页',
        to: indexPage,
        icon: 'home',
      }, {
        content: '系统管理',
        to: util.getPageUrl(moduleName, resources.account),
      }, {
        content: '帐号管理',
        to: util.getPageUrl(moduleName, resources.account),
      }, {
        content,
      },
    ];
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    return (
      <>
        <ZPageHeader
          items={breadcrumbItems}
          separator="*"
          content={content}
          switchDisabled
        />
        <div className="page-content">
          <Card>
            <Form layout="horizontal" onSubmit={this.onFormSubmin}>
              <Form.Item label="角色" { ...formItemLayout } help={<span>没有合适的角色，前往<Link to={util.getPageUrl(moduleName, resources.role, true)}>创建</Link></span>}>
                {
                  getFieldDecorator('roleID', {
                    rules: [{
                      required: true, message: '请选择角色！',
                    }],
                    initialValue: this.resourceStore.item.roleID,
                  })(<Select placeholder="请选择" onChange={this.onRoleChange}>{this.renderGroupOption()}</Select>)
                }
              </Form.Item>
              <Form.Item label="名称" { ...formItemLayout } help='请填写账号名称'>
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, min: 1, message: '请填写名称！',
                    }],
                    initialValue: this.resourceStore.item.name,
                  })(<Input placeholder=""/>)
                }
              </Form.Item>
              <Form.Item label="手机号" { ...formItemLayout } help='请填写手机号'>
                {
                  getFieldDecorator('tel', {
                    rules: [{
                      required: true,
                      min: 1,
                      max: 11,
                      message: '请填写手机号！',
                      validator: (rule, value, callback) => {
                        if (!value) {
                          callback();
                          return;
                        }
                        if (!validator.isMobilePhone(value, 'zh-CN')) {
                          callback(new Error('请填写正确的手机号码'));
                          return;
                        }
                        callback();
                      },
                    }],
                    initialValue: this.resourceStore.item.tel,
                  })(<Input placeholder=""/>)
                }
              </Form.Item>
              <Form.Item label="密码" { ...formItemLayout } help='请填写密码'>
                {
                  getFieldDecorator('password', {
                    rules: [{
                      required: !this.id,
                      min: 6,
                      message: '请填写密码！',
                    }],
                    initialValue: this.resourceStore.item.value,
                    validator: (rule, value, callback) => {
                      if (!value) {
                        callback();
                        return;
                      }

                      callback();
                    },
                  })(<Input placeholder="" type="password"/>)
                }
              </Form.Item>
              <Form.Item label="邮箱" { ...formItemLayout } help='请填写账号邮箱地址'>
                {
                  getFieldDecorator('email', {
                    rules: [{
                      required: true,
                      min: 1,
                      message: '请填写邮箱！',
                      validator: (rule, value, callback) => {
                        if (!value) {
                          callback();
                          return;
                        }
                        if (!validator.isEmail(value)) {
                          callback(new Error('请填写正确的邮箱地址'));
                          return;
                        }
                        callback();
                      },
                    }],
                    initialValue: this.resourceStore.item.email,
                  })(<AutoComplete
                    dataSource={this.state.dataSource}
                    onChange={this.handleEmailChange}
                  />)
                }
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 10 }} >
                <Button type="primary" htmlType="submit" loading={this.resourceStore.loading}>保存</Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </>
    );
  }
}
export default Form.create()(PageAccountEdit);
