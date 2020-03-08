/*
 * Project: view
 * File: PageModuleList.jsx
 * Created Date: 2019-11-17 14:19:02
 * Author: Zz
 * Last Modified: 2020-01-10 22:33:19
 * Modified By: Zz
 * Description: 模块管理
 */
// eslint-disable-next-line max-classes-per-file
import React from 'react';
import { inject, observer } from 'mobx-react';
import validator from 'validator';
import { withRouter } from 'react-router-dom';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Button,
  Tabs,
  Popconfirm,
  Modal,
  Divider,
  Tree,
  Card,
  Tooltip,
  Input,
  message,
  InputNumber,
  Switch,
} from 'antd';
import { ZPageHeader, ZIcon } from 'components';
import config from 'config';
import { util } from 'common';
import * as moduleConfig from '../config';

const { moduleName, resources } = moduleConfig;
const { TreeNode } = Tree;
const { TabPane } = Tabs;

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        iconType: '',
      };
    }

    render() {
      const {
        visible, onCancel, onCreate, form, inputData,
        index, status,
      } = this.props;
      const { getFieldDecorator } = form;
      const { name, key, icon } = inputData;
      const { iconType } = this.state;

      return (
        <Modal
          visible={visible}
          title="创建或编辑"
          okText="确定"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入名称' }],
                initialValue: name || '',
              })(<Input />)}
            </Form.Item>
            <Form.Item label="url">
              {getFieldDecorator('key', {
                rules: [{ required: true, message: '请输入URL!' }],
                initialValue: key || '',
              })(<Input />)}
            </Form.Item>
            <Form.Item label="icon">
              {getFieldDecorator('icon', {
                initialValue: icon || '',
              })(<Input
                  addonBefore={<ZIcon type={ iconType || icon}/>}
                  onChange={({ target: { value } }) => this.setState({ iconType: value })}
                  />)}

            </Form.Item>
            <Form.Item label="序号">
              {getFieldDecorator('index', {
                initialValue: index || 0,
              })(<InputNumber />)}
            </Form.Item>
            <Form.Item label="开启/关闭">
              {getFieldDecorator('status', {
                valuePropName: 'checked',
                initialValue: status || 1,
              })(<Switch checkedChildren="开" unCheckedChildren="关"/>)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

@inject('stores') @withRouter @observer
export default class PageModuleList extends React.Component {
  constructor(props) {
    super(props);
    const panes = [
      {
        title: 'mpt管理',
        key: '1',
        closable: false,
      },
    ];
    this.state = {
      breadcrumbItems: [
        {
          content: '主页',
          to: `${config.pagePrefix}/index`,
          icon: 'home',
        }, {
          content: '系统管理',
          to: util.getPageUrl(moduleName, resources.account),
        }, {
          content: '模块管理',
          to: util.getPageUrl(moduleName, resources.module),
        }, {
          content: '模块编辑',
        },
      ],

      modules: [],
      selectedKeys: [],

      panes,
      activeKey: panes[0].key,
      selectTab: panes[0].key,
      selectTabID: '',

      editAble: false,

      id: '',
      name: '',
      key: '',

      // 当前正在编辑tab
      editTab: {},
    };

    this.resourceStore = props.stores.moduleStore;
    this.moduleCategoryStore = props.stores.moduleCategoryStore;

    this.newTabIndex = 1;
    this.parentID = '';
  }

  componentDidMount() {
    this.resourceStore.init();
    // 先获取所有moduleTab
    this.moduleCategoryStore.listAll({}, (err, data) => {
      if (err) {
        return;
      }
      if (data && data.length > 0) {
        // 默认激活第一个tab
        this.setState({
          panes: data.map((item, index) => ({
            ...item,
            closable: index !== 0,
          })),
          activeKey: data[0].id,
          selectTab: data[0].id,
          selectTabID: data[0].id,
        });
        // 获取第一个tab的模块
        this.resourceStore.treeList({ categoryID: data[0].id });
      }
    });
  }

  editBtnClick = (item) => {
    const data = {
      id: item.id,
      name: item.name,
      key: item.key || 'aaa',
      icon: item.icon,
      editAble: true,
    };
    this.parentID = item.parentID;
    this.setState(data);
  }

  addBtnClick = (value) => {
    this.parentID = value;
    this.setState({
      editAble: true,
      id: '',
      name: '',
      key: '',
      icon: '',
    });
  }

  onDeleteClick = (value) => {
    this.resourceStore.delete(value.id, () => {
      this.resourceStore.treeList({ categoryID: value.categoryID });
    });
  }

  renderSubTree = (children = []) => {
    if (!children || children.length === 0) return null;

    return children.map((item, index) => (
      <TreeNode
        title={
          <span>
            <LegacyIcon type={item.icon || 'appstore'} />&nbsp;&nbsp;
            {item.name}&nbsp;&nbsp;
            <Button type="primary" shape="circle" size='small' icon={<PlusOutlined />} onClick={this.addBtnClick.bind(this, item.id)}/>
            &nbsp;&nbsp;
            <Button type="primary" shape="circle" size='small' icon={<EditOutlined />} onClick={this.editBtnClick.bind(this, item)}/>
            &nbsp;&nbsp;
            <Tooltip title='删除'>
              <Popconfirm
                title="该操作会删除该类目下的子模块，确定删除吗?"
                onConfirm={() => this.onDeleteClick(item, index, true)}
              >
                <Button
                  type="danger"
                  shape="circle"
                  size='small'
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>

            &nbsp;&nbsp;
            <Tooltip title={item.status === 1 ? '关闭模块' : '开启模块'}>
              <Button
                type="primary"
                shape="circle"
                size='small'
                icon={<LegacyIcon type={item.status === 1 ? 'eye-invisible' : 'eye'} />}
              />
            </Tooltip>
          </span>
        }
        key={item.id}
        value={item.id}
      >
        {
          this.renderSubTree(item.children)
        }
      </TreeNode>
    ));
  }

  renderTabCategoryTree(id) {
    const { treeItems } = this.resourceStore;
    const tmp = treeItems.slice();

    const tmpTree = tmp.find((item) => item.categoryID === id);

    return (
      <Tree
        showLine
        defaultExpandAll
      >
        <TreeNode
          title={
            <span>
              全部模块&nbsp;&nbsp;
              <Button
                type="primary"
                shape="circle"
                size='small'
                icon={<PlusOutlined />}
                onClick={this.addBtnClick.bind(this, 'all')}
              />
            </span>
          }
          key="all"
        >
          {
            !tmpTree || !tmpTree.children || tmpTree.children.length === 0
              ? null
              : this.renderSubTree(tmpTree.children.slice())
          }
        </TreeNode>
      </Tree>
    );
  }

  addRoot(items, it, data) {
    if (!items || !it || !data) return false;
    for (const item of items) {
      if (item.id === it && item.parentID) {
        data.push(item.parentID);
        return true;
      }
      if (item.children && item.children.length > 0) {
        const bo = this.addRoot(item.children, it, data);
        if (bo && item.parentID) {
          data.push(item.parentID);
          return bo;
        }
      }
    }
    return false;
  }

  onFormSubmin = () => {
    const {
      selectedKeys, selectTab, modules,
    } = this.state;
    const keyData = selectedKeys.filter((item) => item !== 'all');

    const root = [];
    const { treeItems } = this.resourceStore;
    // 增加父节点
    const tree = treeItems.find((item) => item.tab === parseInt(selectTab, 10));
    if (tree) {
      const treeNode = tree.children;
      keyData.forEach((it) => {
        this.addRoot(treeNode, it, root);
      });
    }

    const keys = keyData.concat(root);

    const tmpTree = modules.find((item) => item.tab === selectTab);
    if (!tmpTree) {
      modules.push({
        tab: selectTab,
        children: keys,
      });
    } else {
      tmpTree.children = [];
      tmpTree.children = keys;
    }

    this.resourceStore.update(this.id, { modules }, () => {
      const url = `${config.pagePrefix}/hotels/list`;
      this.props.history.push(url);
    });
  }

  onTabChange = (activeKey) => {
    const { allItems } = this.moduleCategoryStore;
    const tmp = allItems.slice().find((item) => item.id === activeKey);
    if (!tmp || !tmp.id) {
      return;
    }
    this.resourceStore.treeList({ categoryID: tmp.id });
    this.setState({ selectTab: activeKey, selectTabID: tmp.id });
  }

  onTabEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  add = () => {
    const { panes } = this.state;
    this.newTabIndex += 1;
    const activeKey = this.newTabIndex;
    panes.push({
      title: 'New Tab',
      id: activeKey,
    });
    this.setState({ panes, selectTab: activeKey });
  };

  remove = (targetKey) => {
    const _this = this;
    Modal.confirm({
      title: '确定删除吗?',
      content: '该操作会删除该模块下的所有子模块',
      onOk() {
        let { activeKey } = _this.state;
        let lastIndex;
        _this.state.panes.forEach((pane, i) => {
          if (pane.id === targetKey) {
            lastIndex = i - 1;
          }
        });
        const panes = _this.state.panes.filter(
          (pane) => pane.id !== targetKey,
        );
        if (panes.length && activeKey === targetKey) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].id;
          } else {
            activeKey = panes[0].id;
          }
        }

        const delTab = _this.state.panes.find(
          (pane) => pane.id === targetKey,
        );
        if (delTab && delTab.id) {
          _this.moduleCategoryStore.delete(delTab.id, (err) => {
            if (err) return;
            _this.setState({ panes, selectTab: activeKey });
          });
        } else {
          _this.setState({ panes, selectTab: activeKey });
        }
      },
    });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { selectTabID, id } = this.state;
      const data = {
        parentID: this.parentID === 'all' ? '' : this.parentID,
        name: values.name,
        categoryID: selectTabID,
        key: values.key,
        icon: values.icon,
      };
      if (id) {
        this.resourceStore.update(id, data, () => {
          this.resourceStore.treeList({ categoryID: selectTabID });
          form.resetFields();
          this.setState({ editAble: false });
        });
        return;
      }
      this.resourceStore.create(data, null, () => {
        this.resourceStore.treeList({ categoryID: selectTabID });
        form.resetFields();
        this.setState({ editAble: false });
      });
    });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  onCancel = () => {
    // form.resetFields();
    this.setState({ editAble: false });
  }

  onTabNameClick = (tab) => {
    tab.preName = tab.name;
    this.setState({ editTab: tab });
  }

  handleSubmit = () => {
    const { editTab, panes } = this.state;
    const {
      name, id, preName,
    } = editTab;
    if (!name) {
      message.error('请填写模块名称');
      return;
    }
    // 名称没变直接返回
    if (name === preName) {
      this.setState({ editTab: {} });
      return;
    }

    const tabData = {
      name,
      index: panes.length,
    };
    // id 强制转换成字符串
    if (validator.isMongoId(`${id}`)) {
      this.moduleCategoryStore.update(id, tabData, (err) => {
        if (err) return;
        this.setState({ editTab: {} });
        this.resourceStore.treeList({ categoryID: id });
      });
      return;
    }
    this.moduleCategoryStore.create(tabData, null, (err, data) => {
      if (err) return;
      this.setState({ editTab: {} });
      this.resourceStore.treeList({ categoryID: data.id });
    });
  }

  handleKeyPress = (e) => {
    switch (e.key) {
      case 'Enter':
        this.handleSubmit(e);
        break;
      default:
    }
  }

  onNameChange = (e) => {
    const { value } = e.target;
    const { editTab } = this.state;
    editTab.preName = editTab.name;
    editTab.name = value;
    this.setState({ editTab });
  }

  render() {
    const {
      breadcrumbItems, panes, selectTab,
      editAble, name, key, icon, editTab,
    } = this.state;
    return <>
      <ZPageHeader
        items={breadcrumbItems}
        separator="*"
        content="模块管理"
        switchDisabled
      />
      <div className='page-content'>
        <Card>
          <Tabs
            onChange={this.onTabChange}
            activeKey={`${selectTab}`}
            type="editable-card"
            onEdit={this.onTabEdit}
          >
            {
              panes.map((item) => (
                <TabPane
                  tab={
                    editTab.id === item.id ? (
                      <Input
                        value={item.name}
                        autoFocus
                        onKeyPress={this.handleKeyPress}
                        onBlur={this.handleSubmit}
                        onChange={this.onNameChange}
                      />
                    ) : (<span><Tooltip title="单击可编辑"><Button size='small' type="link" icon={<EditOutlined />} onClick={this.onTabNameClick.bind(this, item)}/></Tooltip>{item.name}</span>)
                  }
                  key={item.id}
                  closable={item.closable}
                >
                  <Col span={4}/>
                  <Col span={20}>
                    {
                      this.renderTabCategoryTree(item.id)
                    }
                  </Col>
                </TabPane>
              ))
            }
          </Tabs>

          <Divider/>
          <Row style={{ marginTop: 20 }}>
            <Col span={6}></Col>
            <Col span={8}><Button type='primary' onClick={this.onFormSubmin}>确定</Button></Col>
          </Row>
        </Card>

        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={editAble}
          inputData={{ name, key, icon }}
          onCancel={this.onCancel}
          onCreate={this.handleCreate}
        />
      </div>
    </>;
  }
}
