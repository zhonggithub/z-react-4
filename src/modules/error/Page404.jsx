import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';
import config from 'config';

export default class Page404 extends React.Component {
  render = () => (
    <Result
      status="404"
      title="404"
      subTitle="对不起，您访问的页面不存在。"
      extra={<Link to={config.indexPage}><Button type="primary">返回首页</Button></Link>}
    />
  )
}
