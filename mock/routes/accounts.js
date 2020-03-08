import Controller from '../Controller';

const account = new Controller('accounts', (index = 0) => ({
  name: `zz${index}`,
  tel: `1376047185${index % 2}`,
  updatedAt: 1559120526,
  createdAt: 1529630243,
  status: index % 2,
  id: `5b2c4e237b9b7300158fbc0${index}`,
  roleID: `5be237b9b7300158fbc0${index}`,
  role: {
    name: `5be237b9b7300158fbc0${index}`,
  },
}));
export default account.resource();
