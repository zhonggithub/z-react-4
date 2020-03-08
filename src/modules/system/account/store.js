/**
 * Project: view
 * File: account.js
 * Created Date: 2019-11-17 17:07:28
 * Author: Zz
 * Last Modified: 2019-12-11 22:48:23
 * Modified By: Zz
 * Description:
 */

import config from 'config';
import { FetchStore } from 'common';

export default new FetchStore({
  apiPrefix: config.apiPrefix,
  resourceName: 'accounts',
  initItem: () => ({
    roleID: '',
    role: {},
    tel: '',
    name: '',
    email: '',
  }),
});
