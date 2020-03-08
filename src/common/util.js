import moment from 'moment';
import queryString from 'query-string';
import config from 'config';
import request from './request';

const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const chnUnitSection = ['', '万', '亿', '万亿', '亿亿'];
const chnUnitChar = ['', '十', '百', '千'];

function SectionToChinese(section) {
  let strIns = '';
  let chnStr = '';
  let unitPos = 0;
  let zero = true;
  while (section > 0) {
    const v = section % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos += 1;
    section = Math.floor(section / 10);
  }
  return chnStr;
}

export default {
  toFixed(value) {
    if (!value) return '0.00';
    return value.toFixed(2);
  },
  number2Chinese(num) {
    let unitPos = 0;
    let strIns = ''; let
      chnStr = '';
    let needZero = false;

    if (num === 0) {
      return chnNumChar[0];
    }

    while (num > 0) {
      const section = num % 10000;
      if (needZero) {
        chnStr = chnNumChar[0] + chnStr;
      }
      strIns = SectionToChinese(section);
      strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
      chnStr = strIns + chnStr;
      needZero = (section < 1000) && (section > 0);
      num = Math.floor(num / 10000);
      unitPos += 1;
    }
    return chnStr;
  },
  randomKey() {
    return Math.random().toString().slice(-16);
  },
  formatDate(unix, style = 'YYYY-MM-DD HH:mm:ss') {
    if (!unix) {
      return '';
    }
    return moment(parseInt(unix, 10) * 1000).format(style);
  },
  package200(res) {
    if (res.status !== 200) {
      return res.json().then((rst) => {
        const err = new Error(`${rst.message}`);
        err.code = res.code;
        err.status = res.status;
        throw err;
      });
    }
    return res.json();
  },
  package201(res) {
    if (res.status !== 201) {
      return res.json().then((rst) => {
        const err = new Error(`${rst.message}`);
        err.code = res.code;
        err.status = res.status;
        throw err;
      });
    }
    return res.json();
  },
  package204(res) {
    if (res.status !== 204) {
      return res.json().then((rst) => {
        const err = new Error(`${rst.message}`);
        err.code = res.code;
        err.status = res.status;
        throw err;
      });
    }
    return Promise.resolve({ code: 0, message: 'success' });
  },
  async qrRetrieve(text) {
    return request(`/group/api/createqrcode?text=${urlencoded(text)}`).then((res) => {
      if (res.status !== 200) {
        return res.json().then((rst) => {
          throw new Error(`[${rst.code}] ${rst.message}`);
        });
      }
      return res.json();
    });
  },
  // 页面路由
  getPageUrl(moduleName = '', resoureName = '', edit = false, id = '') {
    if (!resoureName) return '';

    // 详情页路由
    if (edit === 2) {
      const detailUrl = `${config.pagePrefix}/${moduleName}/${resoureName}/detail`;
      if (id) {
        return `${detailUrl}?id=${id}`;
      }
      return detailUrl;
    }

    // 编辑页，创建页
    if (edit) {
      const editUrl = `${config.pagePrefix}/${moduleName}/${resoureName}/edit`;
      if (id) {
        if (typeof id === 'string') {
          return `${editUrl}?id=${id}`;
        }
        return `${editUrl}?${queryString.stringify(id)}`;
      }
      return editUrl;
    }
    // 列表页
    return `${config.pagePrefix}/${moduleName}/${resoureName}`;
  },
};
