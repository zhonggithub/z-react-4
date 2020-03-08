/*
 * Project: view
 * File: moduleTabs.js'
 * Created Date: 2019-11-20 00:16:01
 * Author: Zz
 * Last Modified: 2019-11-20 00:16:01
 * Modified By: Zz (quitjie@gmail.com)
 * Description:
 */
import { randomStr } from '../util';
import Controller from '../Controller';

const resource = new Controller('moduleCategories', (index = 0) => ({
  title: `zz${index}`,
  key: index,
  updatedAt: 1559120526,
  createdAt: 1529630243,
  status: index % 2,
  id: `5b2c4e237b9b7300158fbc0${index}`,
}), () => ([{
  children: [{
    name: '系统管理',
    key: `http://localhost:3000/${randomStr()}`,
    updatedAt: 1559120526,
    createdAt: 1529630243,
    status: 1,
    id: randomStr(),
    icon: 'appstore',
    children: [{
      name: '日志管理',
      key: `http://localhost:3000/${randomStr()}`,
      updatedAt: 1559120526,
      createdAt: 1529630243,
      status: 1,
      id: randomStr(),
      icon: 'appstore',
    }],
  }, {
    name: 'zz管理',
    key: `http://localhost:3000/${randomStr()}`,
    updatedAt: 1559120526,
    createdAt: 1529630243,
    status: 1,
    id: randomStr(),
    icon: 'appstore',
  }],
  tab: 1,
}]));
export default resource.resource();
