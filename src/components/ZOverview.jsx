/**
* @Author: Zz
* @Date:   2016-10-07T21:31:53+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-07T23:22:23+08:00
*/
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { RightCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import PropTypes from 'prop-types';

export default class ZOverview extends React.Component {
  static propTypes ={
    data: PropTypes.arrayOf(PropTypes.shape({
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
      ]),
      title: PropTypes.string.isRequired,
      url: PropTypes.string,
    })),
    title: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      styleArray: [
        {
          background: '#3598dc', color: '#fff', fontSize: '24px', textAlign: 'right', height: '120px',
        },
        {
          background: '#e7505a', color: '#fff', fontSize: '24px', textAlign: 'right', height: '120px',
        },
        {
          background: '#32c5d2', color: '#fff', fontSize: '24px', textAlign: 'right', height: '120px',
        },
        {
          background: '#8e44ad', color: '#fff', fontSize: '24px', textAlign: 'right', height: '120px',
        },
        {
          background: '#578ebe', color: '#fff', fontSize: '24px', textAlign: 'right', height: '120px',
        },
        {
          background: '#44b6ae', color: '#fff', fontSize: '24px', textAlign: 'right', height: '120px',
        },
        {
          background: '#8775a7', color: '#fff', fontSize: '24px', textAlign: 'right', height: '120px',
        },
      ],
    };
  }

  renderOpertionsIcon = (item) => {
    if (!item.icon) return null;
    return typeof item.icon === 'string' ? <div style={{ float: 'left' }}>
    <LegacyIcon type={ item.icon } style={{ fontSize: '80px' }} />
  </div> : item.icon;
  }

  cardOpertions(dataArray) {
    const styleTmp = { minWidth: '300px' };
    let spanTmp = '6';
    if (dataArray.length === 1) {
      spanTmp = '24';
    } else if (dataArray.length === 2) {
      spanTmp = '12';
    } else if (dataArray.length === 3) {
      spanTmp = '8';
    }

    return dataArray.map((item, i) => (
        <Col span={spanTmp} key={item.title} style={styleTmp}>
          <Card bodyStyle={this.state.styleArray[i % this.state.styleArray.length]}>
            {
              this.renderOpertionsIcon(item)
            }
            <p>{item.content}</p>
            {
              item.url ? <div style={{ fontSize: '16px', margin: '20px 0' }}>
                <Link to={item.url} style={{ color: '#fff' }}>{item.title}<RightCircleOutlined style={{ marginLeft: '10px' }} /></Link>
              </div> : <div style={{ fontSize: '16px', margin: '20px 0' }}>{ item.title }</div>
            }
          </Card>
        </Col>
    ));
  }

  renderTitle() {
    if (this.props.title) { return <h3 style={{ fontSize: '18px', paddingLeft: '20px' }}>{this.props.title}</h3>; }
    return null;
  }

  render() {
    return (
      <div>
        {this.renderTitle()}
        <Row gutter={16} style={{ paddingTop: '20px' }}>
          {this.cardOpertions(this.props.data)}
        </Row>
      </div>
    );
  }
}
