/**
 * File: index.js
 * Project: z-react
 * FilePath: /src/modules/system/account/index.js
 * Created Date: 2019-12-11 21:37:04
 * Author: Zz
 * -----
 * Last Modified: 2019-12-11 22:20:50
 * Modified By: Zz
 * -----
 * Description:
 */
import React from 'react';
import { util } from 'common';
import SideNav from '../../sideNav';
import * as moduleConfig from '../config';
import accountStore from './store';

const PageAccountList = React.lazy(() => import('./PageAccountList'));
const PageAccountEdit = React.lazy(() => import('./PageAccountEdit'));

const { moduleName, resources } = moduleConfig;

export default [{
  path: '/index',
  exact: true,
  sidebar: () => <SideNav/>,
  main: () => <PageAccountList/>,
}, {
  path: util.getPageUrl(moduleName, resources.account),
  exact: true,
  sidebar: () => <SideNav/>,
  main: () => <PageAccountList/>,
}, {
  path: util.getPageUrl(moduleName, resources.account, true),
  exact: true,
  sidebar: () => <SideNav/>,
  main: () => <PageAccountEdit/>,
}];

export {
  accountStore,
};
