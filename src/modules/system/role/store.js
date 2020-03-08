/**
 * Project: view
 * File: roleStore.js
 * Created Date: 2019-11-17 19:56:53
 * Author: Zz
 * Last Modified: 2019-12-11 22:48:44
 * Modified By: Zz
 * Description:
 */

import config from 'config';
import { FetchStore } from 'common';

export default new FetchStore({
  apiPrefix: config.apiPrefix,
  resourceName: 'roles',
  initItem: () => ({
    id: '',
    name: '',
    modules: [],
  }),
});
