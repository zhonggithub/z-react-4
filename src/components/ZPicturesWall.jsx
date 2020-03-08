import { PlusOutlined } from '@ant-design/icons';
import { Upload, Modal } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

export default class ZPicturesWall extends React.Component {
  static propTypes = {
    actionUrl: PropTypes.string.isRequired,
    limit: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  }

  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
    if (this.props.onChange) {
      this.props.onChange(fileList);
    }
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={ this.props.actionUrl }
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= this.props.limit && this.props.limit !== 0 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

ZPicturesWall.defaultProps = {
  actionUrl: '',
  limit: 0,
};
