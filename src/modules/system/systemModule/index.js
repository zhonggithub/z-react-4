/**
 * File: index.js
 * Project: z-react
 * FilePath: /src/modules/system/module/index.js
 * Created Date: 2019-12-11 21:45:36
 * Author: Zz
 * -----
 * Last Modified: 2019-12-29 00:18:43
 * Modified By: Zz
 * -----
 * Description:
 */
import React from 'react';
import { util } from 'common';
import SideNav from '../../sideNav';
import * as moduleConfig from '../config';
import moduleStore from './store';
import moduleCategoryStore from './moduleCategoryStore';

const PageModuleList = React.lazy(() => import('./PageModuleList'));

const { moduleName, resources } = moduleConfig;

export default [{
  path: util.getPageUrl(moduleName, resources.module),
  exact: true,
  sidebar: () => <SideNav/>,
  main: () => <PageModuleList/>,
}];

export {
  moduleStore,
  moduleCategoryStore,
};
