/*
 * @Author: Zz
 * @Date: 2017-04-15 16:00:35
 * @Last Modified by: Zz
 * @Last Modified time: 2018-07-29 22:29:07
 */
import React from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button, Input, Row, message,
} from 'antd';

export default class ZNumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || props.defaultValue || (props.float ? '0.00' : 0),
      step: props.step || 1,
      min: props.min || 0,
      max: props.max || Number.MAX_VALUE,
      minusDisabled: false,
      plusDisabled: false,
      float: props.float || false,
    };
  }

  setValue = (e) => {
    const value = Number(e.target.value);
    if (isNaN(value)) {
      message.error('请输入数字!');
      return;
    }

    let textValue = e.target.value;
    if (this.state.float && textValue.indexOf('.') === -1) {
      textValue += '.00';
    }

    this.setState({
      value: textValue,
      minusDisabled: this.state.min === value,
      plusDisabled: this.state.max === value,
    });
    if (this.props.onChange) { this.props.onChange(value); }
  }

  onBtnClick = (type) => {
    let value = Number(this.state.value);
    if (isNaN(value)) {
      message.error('请输入数字!');
      return;
    }

    switch (type) {
      case 'minus': {
        if (this.state.min > value - this.state.step) { return; }
        value -= this.state.step;
        let textValue = `${value}`;
        if (this.state.float && textValue.indexOf('.') === -1) {
          textValue += '.00';
        }
        if (textValue.length - 1 - textValue.indexOf('.') < 2) {
          textValue += '0';
        }
        this.setState({
          value: textValue,
          minusDisabled: this.state.min === value,
          plusDisabled: this.state.max === value,
        });
      } break;
      case 'plus': {
        if (this.state.max < value + this.state.step) { return; }
        value += this.state.step;
        let textValue = `${value}`;
        if (this.state.float && textValue.indexOf('.') === -1) {
          textValue += '.00';
        }
        if (textValue.length - 1 - textValue.indexOf('.') < 2) {
          textValue += '0';
        }
        this.setState({
          value: textValue,
          minusDisabled: this.state.min === value,
          plusDisabled: this.state.max === value,
        });
      } break;
      default: break;
    }
    if (this.props.onChange) { this.props.onChange(value); }
  }

  render() {
    let textValue = `${this.state.value}`;
    if (this.state.float && textValue.indexOf('.') === -1) {
      textValue += '.00';
    }
    return (
      <Row>
        <Button disabled={this.state.minusDisabled} type="primary" icon={<MinusOutlined />} onClick={this.onBtnClick.bind(this, 'minus')}/>
        <Input style={{ width: 200, textAlign: 'right' }} value={textValue} defaultValue={textValue} onChange={this.setValue}/>
        <Button disabled={this.state.plusDisabled} type="primary" icon={<PlusOutlined />} onClick={this.onBtnClick.bind(this, 'plus')}/>
      </Row>
    );
  }
}
