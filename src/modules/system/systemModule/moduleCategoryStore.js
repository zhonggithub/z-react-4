/**
 * Project: view
 * File: moduleTabStore.js
 * Created Date: 2019-11-19 23:59:27
 * Author: Zz
 * Last Modified: 2019-12-29 00:15:48
 * Modified By: Zz
 * Description:
 */

import config from 'config';
import { FetchStore } from 'common';

export default new FetchStore({
  apiPrefix: config.apiPrefix,
  resourceName: 'moduleCategories',
  initItem: () => ({
    id: '',
    name: '',
    children: '',
  }),
});
