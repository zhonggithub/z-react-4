/*
 * File: ZEditableTagGroup.jsx
 * Project: z-react
 * FilePath: /src/components/ZEditableTagGroup.jsx
 * Created Date: 2020-02-07 22:22:57
 * Author: Zz
 * -----
 * Last Modified: 2020-02-07 22:23:05
 * Modified By: Zz
 * -----
 * Description:
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Tag, Input, Tooltip, Button,
} from 'antd';

export default class ZEditableTagGroup extends React.Component {
  static propTypes = {
    defaultTags: PropTypes.array,
    onCreate: PropTypes.func,
    tags: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      tags: props.tags || props.defaultTags || [],
      inputVisible: false,
      inputValue: '',
      color: ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple', '#f50', '#2db7f5', '#87d068', '#108ee9'],
    };
  }

  handleClose = (removedTag) => {
    const tmpTags = this.state.tags.length > 0 ? this.state.tags : this.props.defaultTags;
    const tags = tmpTags.filter((tag) => tag !== removedTag);
    this.setState({ tags });
    if (this.props.onCreate) {
      this.props.onCreate(tags);
    }
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let tags = state.tags.length > 0 ? state.tags : this.props.defaultTags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
    if (this.props.onCreate) {
      this.props.onCreate(tags);
    }
  }

  saveInputRef = (input) => {
    this.input = input;
  }

  render() {
    const {
      tags, inputVisible, inputValue, color,
    } = this.state;
    let tmpTags = tags;
    if (tags.length <= 0) {
      if (this.props.defaultTags && this.props.defaultTags.length !== 0) {
        tmpTags = this.props.defaultTags.concat(tags);
      }
    }
    return (
      <div>
        { (!tmpTags || tmpTags.length < 0) ? null : tmpTags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag
              key={tag}
              color={color[index % color.length]}
              closable afterClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && <Button size="small" type="dashed" onClick={this.showInput}>+ 新建标签</Button>}
      </div>
    );
  }
}
