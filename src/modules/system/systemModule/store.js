/**
 * Project: view
 * File: moduleStore.js
 * Created Date: 2019-11-19 18:50:35
 * Author: Zz
 * Last Modified: 2019-12-11 22:48:44
 * Modified By: Zz
 * Description:
 */

import config from 'config';
import { FetchStore } from 'common';

export default new FetchStore({
  apiPrefix: config.apiPrefix,
  resourceName: 'modules',
  initItem: () => ({
    id: '',
    name: '',
    children: '',
  }),
});
