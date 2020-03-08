/*
 * File: ZPictrueShow.jsx
 * Project: z-react
 * FilePath: /src/components/ZPictrueShow.jsx
 * Created Date: 2019-11-24 17:56:54
 * Author: Zz
 * -----
 * Last Modified: 2019-11-24 17:57:28
 * Modified By: Zz
 * -----
 * Description:
 */
import React from 'react';
import PropTypes from 'prop-types';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

export default class ZPictureAppear extends React.Component {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    imageUrl: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      width: '80px',
      height: '80px',
      isShow: true,
    };
  }

  onImageClick = () => {
    this.setState({
      previewVisible: true,
    });
  }

  handlePreviewCancel = () => {
    this.setState({ previewVisible: false });
  }

  onImageDelClick = () => {
    this.setState({
      isShow: false,
    });
  }

  render() {
    if (this.props.imageUrl && this.state.isShow) {
      return (
        <div style={{
          float: 'left',
          border: '1px solid #d9d9d9',
          position: 'relative',
          padding: '0 5px',
          marginRight: '5px',
          marginTop: '10px',
          width: this.props.width || this.state.width,
          height: this.props.height || this.state.height,
        }}>
          <img className="hms-def-picture-appear-img"
            onClick={this.onImageClick}
            src={this.props.imageUrl}
            />
          <CloseCircleOutlined
            className='hms-def-picture-appear-close-icon'
            onClick={this.onImageDelClick} />
          <Modal visible={this.state.previewVisible} width="800px" style={{ textAlign: 'center' }} footer={null} onCancel={this.handlePreviewCancel}>
            <img alt="example" style={{ maxWidth: '750px' }} src={this.props.imageUrl} />
          </Modal>
        </div>
      );
    }
    return null;
  }
}
