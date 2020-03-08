/**
* @Author: Zz
* @Date:   2016-10-11T20:31:24+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-12T23:18:53+08:00
*/
// eslint-disable-next-line max-classes-per-file
import React from 'react';
import PropTypes from 'prop-types';
import {
  CloseCircleOutlined,
  InboxOutlined,
  PictureOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Upload, message, Modal, Button, Tabs } from 'antd';

const { Dragger } = Upload;
const { TabPane } = Tabs;

export default class ZUpload extends React.Component {
  static propTypes = {
    action: PropTypes.string,
    onChange: PropTypes.func, // 图片上传回调函数，参数：fileList
    defaultFileList: PropTypes.array, // [ {uid: '', href: ''} ]
    only: PropTypes.bool, // 只是单选,如果定义了该属性,请确保defaultFileList是长度为一的数组,否则图片预览时始终替换第一个图片
  }

  constructor(props) {
    super(props);
    this.state = {
      defaultFileList: this.props.defaultFileList,
      loading: false,
      visible: false,
      previewVisible: false,
      previewImage: '',
      imageList: this.props.defaultFileList || [],
      imageTotal: this.props.defaultFileList ? this.props.defaultFileList.length : 0,
      showPreview: !!this.props.defaultFileList,
      isShelter: false,
      fileList: [],
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
      previewVisible: false,
    });
  }

  handleOk = () => {
    this.setState({
      visible: false,
      showPreview: true,
    });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  handlePreviewCancel = () => {
    this.setState({ previewVisible: false });
  }

  onImageClick(url) {
    this.setState({
      previewImage: url,
      previewVisible: true,
    });
  }

  onImageDelClick = (uid) => {
    const { fileList } = this.state;
    for (let j = 0; j < fileList.length; j += 1) {
      const item = fileList[j];

      if (item.uid === uid) {
        fileList.splice(j, 1);
        this.setState({ fileList });
        break;
      }
    }

    const tmpImageList = this.state.imageList;
    for (let i = 0; i < tmpImageList.length; i += 1) {
      const item = tmpImageList[i];
      if (item.uid === uid) {
        tmpImageList.splice(i, 1);
        this.setState({ imageList: tmpImageList });
        break;
      }
    }

    this.setState({
      imageTotal: this.state.imageTotal - 1 < 0 ? 0 : this.state.imageTotal - 1,
    });

    if (this.props.onChange) {
      this.props.onChange({ file: { status: 'removed' } }, fileList);
    }
  }

  renderPreview() {
    if (this.state.imageList.length && this.state.showPreview) {
      let i = -1;
      return this.state.imageList.map((item) => {
        i += 1;
        if (!item.href) { return null; }
        return (
          <div style={{
            float: 'left',
            border: '1px solid #d9d9d9',
            // padding: '5px',
            position: 'relative',
            padding: '5px',
            marginLeft: '10px',
            marginTop: '10px',
            width: '80px',
            height: '80px',
          }}
            key={`${i}${Date.now()}`}
           >
            <img className="hms-def-picture-appear-img"
              onClick={this.onImageClick.bind(this, item.href)}
              src={item.href}/>
            <CloseCircleOutlined
              className="hms-def-picture-appear-close-icon"
              onClick={this.onImageDelClick.bind(this, item.uid)} />
            <Modal
             visible={this.state.previewVisible}
             footer={null}
             onCancel={this.handlePreviewCancel}
             width="800px"
             style={{ textAlign: 'center' }}
             >
               <img alt="example"
                 style={{ maxWidth: '750px' }}
                 src={this.state.previewImage} />
            </Modal>
          </div>
        );
      });
    }
    return null;
  }

  renderDragger() {
    const _this = this;
    const props = {
      name: 'file',
      showUploadList: true,
      listType: 'picture-card',
      action: this.props.action, // || '/upload.do',
      headers: {
        token: sessionStorage.getItem('jwt:token'),
      },
      // beforeUpload(file){
      //   let fileList = _this.state.fileList;
      //   fileList.push(file);
      //   _this.setState({fileList: fileList});
      // },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        const { fileList } = _this.state;
        if (!_this.props.only || fileList.length === 0) {
          let isHas = false;
          for (let j = 0; j < fileList.length; j += 1) {
            const item = fileList[j];
            if (item.uid === info.file.uid) {
              isHas = true;
              break;
            }
          }
          if (!isHas) {
            fileList.push(info.file);
            _this.setState({ fileList });
          }
        } else if (_this.props.only) {
          fileList[0] = info.file;
        }

        if (info.file.status === 'removed' || info.file.status === 'error') {
          _this.setState({
            imageTotal: _this.state.imageTotal - 1 < 0 ? 0 : _this.state.imageTotal - 1,
          });
          const tmpImageList = _this.state.imageList;
          for (let i = 0; i < tmpImageList.length; i += 1) {
            const item = tmpImageList[i];
            if (item.uid === info.file.uid) {
              tmpImageList.splice(i, 1);
              _this.setState({ imageList: tmpImageList });
              break;
            }
          }

          for (let j = 0; j < fileList.length; j += 1) {
            const item = fileList[j];
            if (item.uid === info.file.uid) {
              fileList.splice(j, 1);
              _this.setState({ fileList });
              break;
            }
          }
        }

        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);

          const tmp = _this.state.imageList;
          // TODO: info.file.response
          const file = { href: info.file.response, uid: info.file.uid };
          if (_this.props.only) {
            if (tmp.length === 0) { tmp.push(file); } else { tmp[0] = file; }
          } else {
            tmp.push(file);
            _this.setState({ imageTotal: _this.state.imageTotal + 1 });
          }

          _this.setState({ imageList: tmp });

          if (_this.props.only) {
            fileList[0] = info.file;
            _this.setState({ fileList });
          } else {
            for (let j = 0; j < fileList.length; j += 1) {
              const item = fileList[j];
              if (item.uid === info.file.uid) {
                fileList[j] = info.file;
                _this.setState({ fileList });
                break;
              }
            }
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
        if (_this.props.onChange) {
          _this.props.onChange(info, fileList);
        }
      },
      onPreview: (file) => {
        this.setState({
          previewImage: file.response,
          previewVisible: true,
        });
      },
    };

    return (
      <div>
        <div style={{ height: 180 }}>
          <Dragger {...props} fileList={this.state.fileList}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text" style={{ fontSize: '20px' }}>点击或拖拽上传图片</p>
          </Dragger>
        </div>
        <Modal
          visible={this.state.previewVisible}
          footer={null} onCancel={this.handlePreviewCancel}>
          <img alt="example" src={this.state.previewImage} />
        </Modal>
      </div>
    );
  }

  deleteBtnOnClick = () => {
    this.setState({
      imageTotal: 0,
      imageList: [],
      fileList: [],
    });
  }

  modalShow() {
    return (
      <Modal
        width='552px'
        visible={this.state.visible}
        title={<span><PictureOutlined /> 图片选择</span>}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
            确定
          </Button>,
          <Button key="back" type="ghost" onClick={this.handleCancel}>取消</Button>,
        ]}
      >
        <Tabs defaultActiveKey="1" style={{ height: `${350 + ((this.state.imageTotal / 5) | 0) * 125}px` }}>
          <TabPane tab={<span><UploadOutlined />上传</span>} key="1" >
            { this.renderDragger() }
          </TabPane>
          {/* <TabPane tab={<span><ZIcon iconfont="&#xe632;" />历史上传</span>} key="2">
            Tab 2
          </TabPane>
          <TabPane tab={<span><Icon type="cloud-download-o" />远程图片</span>} key="3">
            Tab 3
          </TabPane> */}
        </Tabs>
        <div className="ant-layout-breadcrumb" style={{ float: 'right', marginTop: '-12px' }}>
          <Button type="primary" onClick={this.deleteBtnOnClick} style={{ background: '#f3565d', borderColor: '#f3565d' }}>
            删除所有
          </Button>
        </div>
        <div style={{
          height: '24px',
          borderBottom: '1px solid #e9e9e9',
        }}> </div>
      </Modal>
    );
  }

  render() {
    return (
      <div>
        {this.renderPreview()}
        <Button type="dashed" icon={<PlusOutlined />} onClick={this.showModal} style={{
          width: 80, height: 80, fontSize: '26px', marginLeft: '10px', marginTop: '10px', paddingTop: '5px',
        }}>
        </Button>
        {this.modalShow()}
      </div>
    );
  }
}
