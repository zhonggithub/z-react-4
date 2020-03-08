import { resFun, newRouter, randomStr } from '../util';

const router = newRouter();

router.post('/login', (req, res) => {
  const data = {
    token: 'token',
    user: {
      account: 'zz0',
      password: '',
      name: 'zz0',
      roles: [],
      lastLoginTime: 1473386516,
      id: '57de55213e442a17287ecd67',
      createAt: 1473326516,
      updateAt: 1473326516,
    },
  };
  resFun(res, data);
});

router.post('/logout', (req, res) => {
  resFun(res, {});
});

router.get('/afterLogin', (req, res) => {
  const data = {
    role: {
      modules: [
        {
          children: [
            {
              name: '首页',
              key: '/aius/hotel/index',
              parentID: '',
              tab: 0,
              status: 1,
              _id: '5d81eb94b0dab80018bbb28c',
              id: '5d81eb94b0dab80018bbb28c',
              icon: 'home',
              createdAt: '2019-09-16T08:32:20.070Z',
              children: [],
            },
            {
              name: '酒店管理',
              key: '/aius/hotel/hotel',
              parentID: '',
              tab: 0,
              status: 1,
              _id: '5d807704ebaa790018f444d6',
              id: '5d807704ebaa790018f444d6',
              icon: 'home',
              createdAt: '2019-09-17T06:02:44.355Z',
              children: [
                {
                  name: '酒店信息',
                  key: '/aius/hotel/hotel/info',
                  icon: 'info-circle',
                  parentID: '5d807704ebaa790018f444d6',
                  tab: 0,
                  status: 1,
                  createdAt: '2019-09-17T06:24:23.210Z',
                  updatedAt: '2019-09-18T07:03:14.625Z',
                  id: '5d807c17ebaa790018f444d7',
                  children: [],
                },
                {
                  name: '楼宇/房型管理',
                  key: '/aius/hotel/hotel/floors',
                  icon: 'bars',
                  parentID: '5d807704ebaa790018f444d6',
                  tab: 0,
                  status: 1,
                  createdAt: '2019-09-17T06:24:48.117Z',
                  updatedAt: '2019-09-18T06:17:48.377Z',
                  id: '5d807c30ebaa790018f444d8',
                  children: [],
                },
                {
                  name: '房间管理',
                  key: '/aius/hotel/hotel/rooms',
                  icon: 'bars',
                  parentID: '5d807704ebaa790018f444d6',
                  tab: 0,
                  status: 1,
                  createdAt: '2019-09-17T06:25:07.445Z',
                  updatedAt: '2019-09-18T06:17:44.048Z',
                  id: '5d807c43ebaa790018f444d9',
                  children: [],
                },
                {
                  name: 'PMS设置',
                  key: '/aius/hotel/hotel/pms',
                  icon: 'setting',
                  parentID: '5d807704ebaa790018f444d6',
                  tab: 0,
                  status: 1,
                  createdAt: '2019-09-18T08:56:59.035Z',
                  updatedAt: '2019-09-18T08:56:59.035Z',
                  id: '5d81f15bb0dab80018bbb28d',
                  children: [],
                },
              ],
            },
            {
              name: '系统管理',
              key: '/console/system',
              parentID: '',
              tab: 0,
              status: 1,
              _id: '5d81f1b9b0dab80018bbb28e',
              id: '5d81f1b9b0dab80018bbb28e',
              icon: 'setting',
              createdAt: '2019-09-18T08:58:33.117Z',
              children: [
                {
                  name: '管理员',
                  key: '/console/system/accounts',
                  icon: 'team',
                  parentID: '5d81f1b9b0dab80018bbb28e',
                  tab: 0,
                  status: 1,
                  createdAt: '2019-09-18T10:55:22.036Z',
                  updatedAt: '2019-09-18T10:55:22.036Z',
                  id: '5d820d1a4a98f60018b1af45',
                  children: [],
                },
                {
                  name: '角色管理',
                  key: '/console/system/roles',
                  icon: 'user',
                  parentID: '5d81f1b9b0dab80018bbb28e',
                  tab: 0,
                  status: 1,
                  createdAt: '2019-09-18T10:55:49.384Z',
                  updatedAt: '2019-09-18T14:19:20.171Z',
                  id: '5d820d354a98f60018b1af46',
                  children: [],
                },
                {
                  name: '日志管理',
                  key: '/console/system/logs',
                  icon: 'appstore',
                  parentID: '5d81f1b9b0dab80018bbb28e',
                  tab: 0,
                  status: 1,
                  createdAt: '2019-09-18T10:55:49.384Z',
                  updatedAt: '2019-09-18T14:19:20.171Z',
                  id: '59118a42197e27e1f754f6b6',
                  children: [],
                },
                {
                  name: '模块管理',
                  key: '/console/system/modules',
                  icon: 'appstore',
                  parentID: '5d81f1b9b0dab80018bbb28e',
                  tab: 0,
                  status: 1,
                  createdAt: '2019-09-18T10:55:49.384Z',
                  updatedAt: '2019-09-18T14:19:20.171Z',
                  id: '59118a42197e27e1f754f6b4',
                  children: [],
                },
              ],
            },
          ],
          categoryID: randomStr(),
          name: '运营管理',
        },
      ],
      value: 0,
    },
  };
  resFun(res, data);
});


export default router;
