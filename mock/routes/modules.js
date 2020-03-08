/**
 * Project: view
 * File: modules.js
 * Created Date: 2019-11-19 19:55:58
 * Author: Zz
 * Last Modified: 2019-11-24 16:40:44
 * Modified By: Zz
 * Description:
 */
import { randomStr } from '../util';
import Controller from '../Controller';

const resource = new Controller('modules', (index = 0) => ({
  name: `zz${index}`,
  key: `http://localhost:3000/${randomStr()}`,
  updatedAt: 1559120526,
  createdAt: 1529630243,
  status: index % 2,
  icon: 'appstore',
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
  tab: 0,
}]));
export default resource.resource();
