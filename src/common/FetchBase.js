import queryString from 'query-string';
import request from './request';
import util from './util';

export default class FetchBase {
  constructor(url = '') {
    this.url = url;
  }

  create(data) {
    return request(this.url, data).then(util.package201);
  }

  retrieve(id, params = {}) {
    const url = `${this.url}/${id}?${queryString.stringify(params)}`;
    return request(url).then(util.package200);
  }

  update(id, data) {
    const url = `${this.url}/${id}`;
    return request(url, data).then(util.package200);
  }

  delete(id, httpCode = 204) {
    const url = `${this.url}/${id}`;
    return request(url, {}, 'DELETE').then(httpCode === 204 ? util.package204 : util.package200);
  }

  updateStatus(id, status) {
    const url = `${this.url}/${id}/status`;
    return request(url, { status }).then(util.package200);
  }

  list(params = { page: 1, pageSize: 10 }) {
    const url = `${this.url}?${queryString.stringify(params)}`;
    return request(url).then(util.package200);
  }

  static httpPost = (url, data) => request(url, data).then(util.package200)

  static httpGet = (url, params = {}) => request(`${url}?${queryString.stringify(params)}`).then(util.package200)
}
