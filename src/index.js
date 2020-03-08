/**
* @Author: Zz
* @Date:   2016-09-10T10:35:08+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-12T21:40:21+08:00
*/
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import {
  BrowserRouter, Route, Redirect, Switch,
} from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'moment/locale/zh-cn';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './i18n';
import { ZAppLayout } from 'components';
import { Login } from './modules';
import stores from './stores';
import 'antd/dist/antd.less';
import 'ant-design-pro/dist/ant-design-pro.css';
import './style/iconfont.css';
import routers from './routers';

const mountNode = document.getElementById('root');

function auth() {
  return stores.appStore.isLogin;
}

ReactDOM.render((
  <ConfigProvider locale={zhCN}>
    <Provider stores={stores}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact render={() => <Login.PageLogin/>}/>
          <Route path="/:page" render={ () => (auth() ? <ZAppLayout routes={routers}/> : <Redirect to="/"/>)}/>
        </Switch>
      </BrowserRouter>
    </Provider>
  </ConfigProvider>
), mountNode);
