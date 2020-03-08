/**
 * File: index.js
 * Project: z-react
 * FilePath: /src/modules/system/log/index.js
 * Created Date: 2019-12-11 21:42:47
 * Author: Zz
 * -----
 * Last Modified: 2019-12-11 22:22:42
 * Modified By: Zz
 * -----
 * Description:
 */
import React from 'react';
import { util } from 'common';
import SideNav from '../../sideNav';
import * as moduleConfig from '../config';
import logStore from './store';

const PageLogList = React.lazy(() => import('./PageLogList'));

const { moduleName, resources } = moduleConfig;

export default [{
  path: util.getPageUrl(moduleName, resources.log),
  exact: true,
  sidebar: () => <SideNav/>,
  main: () => <PageLogList/>,
}];

export {
  logStore,
};
