/**
 * File: logStore.js
 * Project: z-react
 * FilePath: /src/stores/logStore.js
 * Created Date: 2019-11-24 16:46:32
 * Author: Zz
 * -----
 * Last Modified: 2019-12-11 22:48:44
 * Modified By: Zz
 * -----
 * Description:
 */

import config from 'config';
import { FetchStore } from 'common';

module.exports = new FetchStore({
  apiPrefix: config.apiPrefix,
  resourceName: 'logs',
});
