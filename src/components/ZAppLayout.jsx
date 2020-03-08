/*
 * Project: view
 * File: ZAppLayout.jsx
 * Created Date: 2019-11-17 09:47:43
 * Author: Zz
 * Last Modified: 2020-01-04 13:41:11
 * Modified By: Zz
 * Description: 页面基本布局
 */

import React from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Layout, Spin } from 'antd';
import localforage from 'localforage';
import ZFooter from './ZFooter';
import ZAppTopNav from './ZAppTopNav';

const logo = require('../images/logo.png');

const {
  Content, Sider,
} = Layout;

@withRouter
export default class ZAppLayout extends React.Component {
  static propTypes = {
    routes: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string.isRequired,
      sidebar: PropTypes.func.isRequired,
      main: PropTypes.func.isRequired,
    })).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    };
  }

  componentDidMount() {
    if (!global.role) {
      localforage.getItem('role', (err, value) => {
        if (value) {
          global.role = value;
          this.setState({});
          this.forceUpdate();
        }
      });
    }
  }

  onCollapseChange = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  renderSideImp = (component) => React.cloneElement(component, { collapse: true })

  renderSideNav = () => this.props.routes.map((route, index) => (
    <Route
      key={index}
      path={route.path}
      exact={route.exact}
      component={
        !this.state.collapse ? route.sidebar : this.renderSideImp.bind(this, route.sidebar())}
    />
  ))

  renderMain = () => this.props.routes.map((route, index) => (
    <Route
      key={index}
      path={route.path}
      exact={route.exact}
      component={route.main}
    />
  ))

  render() {
    const { collapse } = this.state;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout>
          <Sider
            // collapsible
            collapsed={this.state.collapse}
            onCollapse={this.onCollapseChange}
            width={250}
            style={{
              height: 'calc(100vh)',
              position: 'fixed',
              left: 0,
              background: 'rgb(41, 53, 66)',
              zIndex: 1,
              overflow: 'auto',
            }}
          >
            <div style={{ width: 100, height: 64 }}>
              {collapse ? <img style={{
                marginLeft: 10, width: 54, height: 50,
              }} src={logo} /> : <img style={{
                width: 54, height: 50, marginLeft: 80,
              }} src={logo} />}
            </div>
            <Switch>
              { this.renderSideNav() }
            </Switch>
          </Sider>
          <Layout>
            <ZAppTopNav onCollapseChange={this.onCollapseChange} collapse={this.state.collapse}/>
            <Content
              style={{
                marginLeft: this.state.collapse ? 84 : 250,
                overflow: 'auto',
                marginTop: 64 + 6,
              }}
            >
              <React.Suspense fallback={<Spin size="large" />}>
                <Switch>
                  { this.renderMain() }
                </Switch>
              </React.Suspense>
              <ZFooter collapse={this.state.collapse} />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
