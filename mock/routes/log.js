/**
 * File: log.js
 * Project: z-react
 * FilePath: /mock/routes/log.js
 * Created Date: 2019-11-24 20:33:17
 * Author: Zz
 * -----
 * Last Modified: 2019-11-24 20:34:09
 * Modified By: Zz
 * -----
 * Description:
 */

import Controller from '../Controller';

const roler = new Controller('logs', (index = 0) => ({
  updatedAt: 1574598622,
  createdAt: 1574598622,
  accountID: '5b8f49c1deecb30015129c3b',
  params: {
    account: '13760471842',
    verificationCode: '1e2v',
    kind: 'AP',
  },
  code: 0,
  message: 'success',
  ip: '27.155.69.27',
  method: 'POST',
  url: '/aius/console/api/login',
  accountName: `zz${index}`,
  id: '5dda77de5db8fd0017c3a0cf',
}));
export default roler.resource();
