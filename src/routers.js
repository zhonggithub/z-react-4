/**
 * Project: view
 * File: routes.js
 * Created Date: 2019-11-17 14:05:59
 * Author: Zz
 * Last Modified: 2019-11-24 17:22:49
 * Modified By: Zz
 * Description:
 */
import React from 'react';
import {
  Error, Test, System, SideNav,
} from './modules';

const { TestSider1, TestList } = Test;

// eslint-disable-next-line import/no-mutable-exports
let routes = [
  {
    path: '/list',
    exact: true,
    sidebar: () => <TestSider1/>,
    main: () => <TestList/>,
  },
  {
    path: '/shoelaces',
    exact: true,
    sidebar: () => <div>Shoelaces</div>,
    main: () => <h2>Shoelaces</h2>,
  },
];

routes = routes.concat(System);

// 没有定义的页面返回404
routes.push({
  path: '*',
  sidebar: () => <SideNav/>,
  main: () => (<Error.Page404 />),
});

export default routes;
