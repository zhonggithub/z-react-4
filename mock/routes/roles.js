/**
 * Project: view
 * File: roles.js
 * Created Date: 2019-11-19 18:26:16
 * Author: Zz
 * Last Modified: 2019-11-24 16:41:03
 * Modified By: Zz
 * Description:
 */

import Controller from '../Controller';

const roler = new Controller('roles', (index = 0) => ({
  name: `role${index}`,
  updatedAt: 1559120526,
  createdAt: 1529630243,
  status: index % 2,
  id: `5be237b9b7300158fbc0${index}`,
}));
export default roler.resource();
