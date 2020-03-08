/**
 * Project: view
 * File: routers.js
 * Created Date: 2019-11-17 14:26:28
 * Author: Zz
 * Last Modified: 2019-12-29 00:18:10
 * Modified By: Zz
 * Description:
 */
import account, { accountStore } from './account';
import log, { logStore } from './log';
import systemModule, { moduleStore, moduleCategoryStore } from './systemModule';
import role, { roleStore } from './role';

// export route
export default [
  ...account,
  ...log,
  ...systemModule,
  ...role,
];

// export store
export {
  accountStore,
  logStore,
  roleStore,
  moduleStore,
  moduleCategoryStore,
};
