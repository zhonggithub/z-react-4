/**
 * File: index.js
 * Project: z-react
 * FilePath: /src/modules/system/role/index.js
 * Created Date: 2019-12-11 21:47:19
 * Author: Zz
 * -----
 * Last Modified: 2020-01-01 21:40:10
 * Modified By: Zz
 * -----
 * Description:
 */
import React from 'react';
import { util } from 'common';
import SideNav from '../../sideNav';
import * as moduleConfig from '../config';
import roleStore from './store';

const PageRoleList = React.lazy(() => import('./PageRoleList'));
const PageRoleEdit = React.lazy(() => import('./PageRoleEdit'));

const { moduleName, resources } = moduleConfig;

const url = {
  role: util.getPageUrl(moduleName, resources.role),
  roleEdit: util.getPageUrl(moduleName, resources.role, true),
};

export default [
  {
    path: url.role,
    exact: true,
    sidebar: () => <SideNav/>,
    main: () => global.store.getPage(url.role, <PageRoleList/>),
  }, {
    path: url.roleEdit,
    exact: true,
    sidebar: () => <SideNav/>,
    main: () => global.store.getPage(url.role, <PageRoleEdit/>),
  },
];

export {
  roleStore,
};
