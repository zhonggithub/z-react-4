/*
 * File: ZDistrict.jsx
 * Project: z-react
 * FilePath: /src/components/ZDistrict.jsx
 * Created Date: 2019-09-13 15:00:06
 * Author: Zz
 * -----
 * Last Modified: 2020-02-07 22:22:49
 * Modified By: Zz
 * -----
 * Description:
 */

import React from 'react';
import { Select, message } from 'antd';
import PropTypes from 'prop-types';
import config from 'config';
import { request, util } from '../common';

const { Option } = Select;

export default class ZDistrict extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    level: PropTypes.oneOf([1, 2, 3]),
    address: PropTypes.shape({
      province: PropTypes.string,
      city: PropTypes.string,
      district: PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.defautValue || [],
      inputValue: '',
      options: [],
      cities: [],
      districts: [],
      city: props.address ? props.address.city || '0' : '0',
      district: props.district ? props.district || '0' : '0',
      province: props.province ? props.province || '0' : '0',
      level: props.level || 3,
      address: props.address,
      administrativeDistrict: {
        province: [],
        city: [],
        district: [],
      },
    };
  }

  componentDidMount() {
    request(`${config.apiPrefix}/common/dist`).then(util.package200).then((res) => {
      this.setState({ administrativeDistrict: res.data });
    }).catch((err) => {
      message.error(err.message);
    });
  }

  setValue = (value, selectedOptions = []) => {
    this.setState({ value });
    this.props.onChange(value, selectedOptions);
  }

  onProvinceChange = (value) => {
    const { administrativeDistrict } = this.state;
    let districts = [];
    const district = '';
    if (value !== '0' && {}.hasOwnProperty.call(administrativeDistrict.district, administrativeDistrict.city[value][0])) {
      districts = administrativeDistrict.district[administrativeDistrict.city[value][0]];
      // district = administrativeDistrict.district[administrativeDistrict.city[value][0]][0];
    }

    let cities = [];
    const city = '0';
    if (value !== '0' && {}.hasOwnProperty.call(administrativeDistrict.city, value)) {
      cities = administrativeDistrict.city[value];
      // city = administrativeDistrict.city[value][0];
    }

    this.setState({
      province: value,
      cities,
      city,
      districts,
      district,
    });

    if (this.props.onChange) {
      this.props.onChange({
        province: value === '0' ? '' : value,
        city: city === '0' ? '' : city,
        district: district === '0' ? '' : district,
      });
    }
  }

  onCityChange = (value) => {
    const { administrativeDistrict } = this.state;
    const district = '0';
    let districts = [];
    if ({}.hasOwnProperty.call(administrativeDistrict.district, value)) {
      districts = administrativeDistrict.district[value];
      // district = administrativeDistrict.district[value][0];
    }
    this.setState({
      city: value,
      districts,
      district,
    });

    if (this.props.onChange) {
      this.props.onChange({
        province: this.state.province === '0' ? '' : this.state.province,
        city: value === '0' ? '' : value,
        district: district === '0' ? '' : district,
      });
    }
  }

  onDictrictChange = (value) => {
    this.setState({
      district: value,
    });

    if (this.props.onChange) {
      this.props.onChange({
        province: this.state.province === '0' ? '' : this.state.province,
        city: this.state.city === '0' ? '' : this.state.city,
        district: value === '0' ? '' : value,
      });
    }
  }

  renderDistrictSelect() {
    const { administrativeDistrict } = this.state;
    const defaultValue = this.props.address ? this.props.address.district : this.state.district;
    const value = this.state.city;
    if ({}.hasOwnProperty.call(administrativeDistrict.district, value)) {
      let districtOptions = [<Option key='0'>区</Option>];
      districtOptions = districtOptions.concat(this.state.districts.map(
        (district) => <Option key={district}>{district}</Option>,
      ));
      return (
        <Select value={this.state.district === '0' ? defaultValue || this.state.district : this.state.district} style={{ width: 150 }} onChange={this.onDictrictChange}>
          { districtOptions }
        </Select>
      );
    }
    return null;
  }

  renderProvince() {
    const { administrativeDistrict } = this.state;
    const defaultValue = this.props.address ? this.props.address.province : this.state.province;
    const provinceOptions = [<Option key='0'>省</Option>];
    let opts = provinceOptions;
    if (administrativeDistrict.province && administrativeDistrict.province.length > 0) {
      opts = provinceOptions.concat(administrativeDistrict.province.map(
        (province) => <Option key={province}>{province}</Option>,
      ));
    }
    return (
      <Select value={ this.state.province === '0' ? defaultValue || this.state.province : this.state.province} style={{ width: 150, marginRight: '5px' }} onChange={this.onProvinceChange}>
        { opts }
      </Select>
    );
  }

  renderCity() {
    const { administrativeDistrict } = this.state;
    const defaultValue = this.props.address ? this.props.address.city : this.state.city;
    const cityOptions = [<Option key='0'>市</Option>];
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.city = this.state.city === '0' ? defaultValue || this.state.city : this.state.city;
    if (this.state.city !== '0' && administrativeDistrict.district && administrativeDistrict.district.length > 0) {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.districts = administrativeDistrict.district[this.state.city] || [];
    }
    let { cities } = this.state;
    if (this.props.address
      && this.props.address.province
      && this.state.province === '0'
      && administrativeDistrict.city
    ) {
      cities = administrativeDistrict.city[this.props.address.province] || [];
    }
    const opts = cityOptions.concat(cities.map((city) => <Option key={city}>{city}</Option>));
    return (
      <Select value={this.state.city} style={{ width: 150, marginRight: '5px' }} onChange={this.onCityChange}>
        { opts }
      </Select>
    );
  }

  render() {
    return (
      <div>
        { this.renderProvince() }
        { this.state.level >= 2 ? this.renderCity() : null }
        { this.state.level >= 3 ? this.renderDistrictSelect() : null }
      </div>
    );
  }
}
