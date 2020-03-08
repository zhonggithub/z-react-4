/*
 * Project: view
 * File: PageRoleEdit.jsx
 * Created Date: 2019-11-17 14:19:02
 * Author: Zz
 * Last Modified: 2020-01-04 21:41:04
 * Modified By: Zz
 * Description: 角色创建/编辑
 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import lodash from 'lodash';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, Tabs, Tooltip, Col, Switch, Tree, message } from 'antd';
import queryString from 'query-string';
import { ZPageHeader } from 'components';
import { indexPage } from 'config';
import { util } from 'common';
import * as moduleConfig from '../config';

const { moduleName, resources } = moduleConfig;
const { TabPane } = Tabs;
const { TreeNode } = Tree;

@inject('stores') @withRouter @observer
class PageRoleEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      moduleValue: 0,
      halfCheckedKeys: [],
    };

    this.id = null;
    this.resourceStore = props.stores.roleStore;

    this.moduleStore = props.stores.moduleStore;
  }

  componentDidMount() {
    this.resourceStore.init();
    // 获取id
    this.getID();

    this.moduleStore.treeList();
  }

  getID = () => {
    if (this.props.location.search) {
      const params = queryString.parse(this.props.location.search);
      if (!params.id) {
        return;
      }
      this.id = params.id;
      this.resourceStore.retrieve(this.id, {}, (err, ret) => {
        if (err) {
          return;
        }

        // 过滤根节点
        const keys = [];
        function getChildrenKeys(modulesParams = []) {
          for (const item of modulesParams) {
            if (item.children.length > 0) {
              getChildrenKeys(item.children.slice());
            } else {
              keys.push(item.id);
            }
          }
        }

        ret.modules.forEach((item) => {
          getChildrenKeys(item.children);
        });

        this.setState({ selectedKeys: keys });
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

      const { moduleValue, selectedKeys, halfCheckedKeys } = this.state;

      if (moduleValue !== 666 && selectedKeys.length === 0) {
        message.error('请选择角色模块权限');
        return;
      }

      const keyData = selectedKeys.filter((item) => item !== 'all');
      const tmpKeys = keyData.concat(halfCheckedKeys);

      const data = {
        name: values.name,
        value: moduleValue,
        moduleIDs: moduleValue === 666 ? [] : lodash.uniq(tmpKeys),
      };

      if (this.id) {
        this.resourceStore.update(this.id, data, () => {
          this.props.history.goBack();
        });
        return;
      }

      this.resourceStore.create(data, this.props.form, () => {
        global.store.refreshPageParamsByEdit();
        this.props.history.goBack();
      });
    });
  }

  onSwitchChecked = (is) => {
    this.resourceStore.isSwitchChecked = is;
  }

  renderSubTree = (children = []) => {
    if (!children || children.length === 0) return null;

    return children.map((item) => (
      <TreeNode
        title={<span><LegacyIcon type={item.icon || 'appstore'} />&nbsp;&nbsp;{item.name}</span>}
        key={item.id}
        value={item.id}
      >
        {
          this.renderSubTree(item.children)
        }
      </TreeNode>
    ));
  }

  renderTabCategoryTree(tab) {
    const { selectedKeys } = this.state;
    if (!tab) {
      return (
        <Tree
          showLine
          defaultExpandAll
          checkable
        >
          <TreeNode
            title='全部分类'
            key="all"
          />
        </Tree>
      );
    }
    const { children } = tab;
    return (
      <Tree
        showLine
        defaultExpandAll
        checkable
        checkedKeys={selectedKeys}
        onCheck={(keys, e) => {
          if (e.halfCheckedKeys) {
            const halfCheckedKeys = e.halfCheckedKeys.filter((item) => item !== 'all');
            this.setState({ halfCheckedKeys });
          }
          this.setState({ selectedKeys: keys });
        }}
      >
        <TreeNode
          title='全部分类'
          key="all"
        >
          {
            !children || children.length === 0
              ? null
              : this.renderSubTree(children)
          }
        </TreeNode>
      </Tree>
    );
  }

  renderTree = () => {
    const { moduleValue } = this.state;
    const { treeItems } = this.moduleStore;
    return (
      <Tabs
        tabBarExtraContent={<Tooltip
          title={<span>开启超级管理员权限<br />超级管理员拥有所有模块查看权限</span>}>
            <Switch
              checked={moduleValue === 666}
              onChange={(checked) => this.setState({ moduleValue: checked ? 666 : 0 })} />
            </Tooltip>
          }
      >
        {
          treeItems.map((item) => (
            <TabPane tab={item.name} key={item.categoryID}>
              <Col span={4} />
              <Col span={20}>
                {
                  this.renderTabCategoryTree(item)
                }
              </Col>
            </TabPane>
          ))
        }
      </Tabs>
    );
  }

  render() {
    const content = `角色${this.id ? '编辑' : '创建'}`;
    const breadcrumbItems = [
      {
        content: '主页',
        to: indexPage,
        icon: 'home',
      }, {
        content: '系统管理',
        to: util.getPageUrl(moduleName, resources.account),
      }, {
        content: '角色管理',
        to: util.getPageUrl(moduleName, resources.role),
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
            <Form layout="horizontal" {...formItemLayout} onSubmit={this.onFormSubmin}>
              <Form.Item label="角色名称" help='请填写角色名称'>
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, min: 1, message: '请填写角色名称！',
                    }],
                    initialValue: this.resourceStore.item.name,
                  })(<Input placeholder=""/>)
                }
              </Form.Item>

              <Form.Item label='权限' required help='请选择角色拥有权限'>
                {
                  this.renderTree()
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

export default Form.create()(PageRoleEdit);
