/**
 * Project: view
 * File: testStore.js
 * Created Date: 2019-10-21 11:42:20
 * Author: Zz
 * Last Modified: 2019-12-11 22:48:44
 * Modified By: Zz
 * Description:
 */
import config from 'config';
import { FetchStore } from 'common';

export default new FetchStore({
  resourceName: 'tests',
  apiPrefix: config.apiPrefix,
});
