/*
 * @Author: Zz
 * @Date: 2017-04-15 16:01:48
 * @Last Modified by: Zz
 * @Last Modified time: 2018-07-29 22:36:21
 */
// eslint-disable-next-line max-classes-per-file
import React from 'react';
import PropTypes from 'prop-types';

export default class ZPictureCard extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    title: PropTypes.string,
    selected: PropTypes.bool,
    titleDirection: PropTypes.string, // top or bottom
    width: PropTypes.string,
    height: PropTypes.string,
    picWidth: PropTypes.string,
    picHeight: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      isSelected: props.selected || false,
    };
  }

  selected = () => {
    this.setState({
      isSelected: !this.state.isSelected,
    });
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    let selected = this.state.isSelected;
    if (this.props.selected !== undefined) {
      const tmp = this.props.selected;
      selected = tmp;
    }
    const titleTmp = <div style={{ width: this.props.width || '91px' }} className='hms-picture-card-title'>{this.props.title}</div>;
    return (
      <div style={{ float: 'left' }}>
        {this.props.titleDirection === 'top' || !this.props.titleDirection ? titleTmp : null }
        <div className={selected ? 'hms-picture-card-select' : 'hms-picture-card'}
          onClick={this.selected}
          style={{ width: this.props.width || '91px', height: this.props.height || '112px' }}
        >
          <img className="hms-layout-img"
            style={{ width: this.props.picWidth || '53px', height: this.props.picHeight || '101px' }}
            src={this.props.src}/>
        </div>
        {this.props.titleDirection === 'top' || !this.props.titleDirection ? null : titleTmp}
      </div>
    );
  }
}

export class ZPictureCardGroup extends React.Component {
  static propTypes = {
    items: PropTypes.array, // pictureCard的参数数组。[{title:'', src:''}]
    onSelected: PropTypes.func, // 选择了那张图片回调函数，参数：index，表示图片在PictureCardGroup的索引值，0起偏
    defaultSelect: PropTypes.number, // 默认选择的那个图片, index 0起偏
    titleDirection: PropTypes.string, // top or bottom
  }

  constructor(props) {
    super(props);
    this.state = {
      selectArray: [],
    };
  }

  onSelected(src) {
    const selectArray = [];
    let selectIndex = 0;
    for (let i = 0; i < this.props.items.length; i += 1) {
      const item = this.props.items[i];
      if (item.src === src) {
        selectIndex = i;
        selectArray.push(true);
      } else {
        selectArray.push(false);
      }
    }
    this.setState({ selectArray });
    if (this.props.onSelected) {
      this.props.onSelected(selectIndex);
    }
  }

  renderItems() {
    if (!this.props.items) {
      return null;
    }

    const { selectArray } = this.state;
    let i = -1;
    return this.props.items.map((item) => {
      i += 1;
      let select = false;
      if (!selectArray.length
        && this.props.defaultSelect !== undefined
        && i === this.props.defaultSelect) {
        select = true;
      }
      return <ZPictureCard key={item.src}
        titleDirection={ this.props.titleDirection }
        src={item.src}
        title={item.title}
        width={item.width}
        height={item.height}
        picWidth={item.picWidth}
        picHeight={item.picHeight}
        // selected={selectArray.length ? selectArray[i] : false}
        selected={selectArray.length ? selectArray[i] : select}
        onClick={this.onSelected.bind(this, item.src)}/>;
    });
  }

  render() {
    return (
      <div>
        {this.renderItems()}
      </div>
    );
  }
}
