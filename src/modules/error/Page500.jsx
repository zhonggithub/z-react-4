import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';
import config from 'config';

export default class Page500 extends React.Component {
  render = () => (
    <Result
      status="500"
      title="500"
      subTitle="服务器在开小差..."
      extra={<Link to={config.indexPage}><Button type="primary">返回首页</Button></Link>}
    />
  )
}
