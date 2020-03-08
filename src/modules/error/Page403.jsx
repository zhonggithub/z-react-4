import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';
import config from 'config';

export default class Page403 extends React.Component {
  render = () => (
    <Result
      status="403"
      title="403"
      subTitle="对不起，您无权访问该页面。"
      extra={<Link to={config.indexPage}><Button type="primary">返回首页</Button></Link>}
    />
  )
}
