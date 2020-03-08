import { observable } from 'mobx';
import { message, Modal } from 'antd';
import config from 'config';
import FetchBase from './FetchBase';

message.config({
  top: 100,
});

export default class FetchStore extends FetchBase {
  // retrieve, update, 操作时返回的资源
  @observable item = this.initItem();

  // list 返回的资源项
  @observable items = [];

  // list 操作时返回的资源项总计
  @observable total = 0;

  // list 操作时返回的结果
  @observable listResult = {};

  // list 操作loading状态
  @observable loading = false;

  @observable err = null;

  // batch操作时返回的操作结果
  @observable batchResults = [];

  // count操作时返回的数据
  @observable totalCount = 0;

  // listAll操作时返回的数据
  @observable allItems = [];

  // treeList操作时返回的数据
  @observable treeItems = [];

  static isShowedMessage = false;

  /**
   * Creates an instance of FetchStore.
   * @param {string} [apiPrefix=config.apiPrefix] 操作资源的的后端url路由前缀，后端url请按照restful风格
   * @param {string} [resourceName] 资源名
   * @param {boolean} [isSwitchChecked=false] 编辑页面是否连续录入
   * @param {boolean} [writeSuccessPopUp=true] 写操作：cerate,update,delete 成功时是否弹框提示
   * @param {string} [createPopInfo=''] 创建成功弹框提示文字
   * @param {string} [updatePopInfo=''] 更新成功弹框提示文字
   * @param {string} [delPopInfo=''] 删除成功弹框提示文字
   * @param {string} [statusPopInfo=''] 状态更新成功弹框提示文字
   * @param {function} [initItem=() => ({})] 初始化item的函数, 连续录入成功时会调用该方法初始化item
   * @memberof FetchStore
   */
  constructor({
    apiPrefix,
    resourceName,
    isSwitchChecked,
    writeSuccessPopUp,
    createPopInfo,
    updatePopInfo,
    delPopInfo,
    statusPopInfo,
    initItem,
  }) {
    super(`${apiPrefix || config.apiPrefix}/${resourceName || ''}`);
    this.isSwitchChecked = isSwitchChecked || false;
    this.writeSuccessPopUp = writeSuccessPopUp || true;
    this.resourceName = resourceName;
    this.apiPrefix = apiPrefix;

    const popInfo = '操作成功';
    this.createPopInfo = createPopInfo || popInfo;
    this.updatePopInfo = updatePopInfo || popInfo;
    this.delPopInfo = delPopInfo || popInfo;
    this.statusPopInfo = statusPopInfo || popInfo;
    this.initItem = initItem;
    if (!this.initItem) {
      this.initItem = () => ({});
    }
  }

  init() {
    this.item = this.initItem();
    this.items = [];
    this.total = 0;
    this.listResult = {};
    this.loading = false;
    this.err = null;
    this.batchResults = [];
    this.totalCount = 0;
    this.allItems = [];
  }

  showMessage = (err) => {
    if (!err) return;
    if (FetchStore.isShowedMessage) return;
    if (err.status === 401) {
      FetchStore.isShowedMessage = true;
      Modal.error({
        title: `${err.message}`,
        content: '',
        onOk() {
          FetchStore.isShowedMessage = false;
          sessionStorage.setItem('jwt:token', '');
          location.href = `${config.pagePrefix}/index`;
        },
      });
    } else {
      FetchStore.isShowedMessage = false;
      message.error(`${err.message}`);
    }
  }

  showSuccessPopUp(popInfo = '操作成功！') {
    if (this.writeSuccessPopUp) {
      message.success(popInfo);
    }
  }

  handleSuccess(next, data, showPop = false, popInfo = '') {
    if (showPop) {
      this.showSuccessPopUp(popInfo);
    }
    this.loading = false;
    if (next) {
      next(null, data);
    }
  }

  handleErr(err, next) {
    this.loading = false;
    if (!err) return;
    this.err = err;
    this.showMessage(err);
    if (next) {
      next(err);
    }
  }

  /**
   * @param {any} [data={}] 创建资源时的数据
   * @param {any} [antForm={}] ant Form 组件, 以便创建成功后，如果设置了连续录入，进行初始化item 的操作
   * @memberof FetchStore
   */
  create(data = {}, antForm = {}, next) {
    if (this.loading) return;
    this.loading = true;
    super.create(data).then((ret) => {
      this.loading = false;
      if (this.writeSuccessPopUp) {
        message.success(this.createPopInfo);
      }
      this.item = {
        ...this.initItem(),
        ...ret.data,
      };
      if (this.isSwitchChecked) {
        this.item = this.initItem();
        if (antForm && antForm.setFieldsValue) {
          antForm.setFieldsValue(this.item);
        }
      } else if (next) {
        next(null, this.item);
      }
    }).catch((err) => {
      this.handleErr(err, next);
    });
  }

  retrieve(id, params, next) {
    this.loading = true;
    super.retrieve(id, params).then((ret) => {
      this.item = ret.data;
      this.handleSuccess(next, ret.data);
    }).catch((err) => {
      this.handleErr(err, next);
    });
  }

  update(id, data, next) {
    this.loading = true;
    super.update(id, data).then((ret) => {
      this.item = ret.data;
      this.handleSuccess(next, ret.data, true, this.updatePopInfo);
    }).catch((err) => {
      this.handleErr(err, next);
    });
  }

  /**
   * batch 操作采用http post 方法. batch操作常用来批量更新和批量删除
   * @param {string} url 批量操作资源的url.例如 url = /api/batch/update/groups
   * @param {json} data 批量操作资源时需要的参数. data 是是个json 对象. 后端需要按这个格式处理数据.
   * @return {json} batchResults 批量处理的结果
   * @memberof FetchStore
   *
   * 例如： 批量更新状态. url = ／api/batch/groups
   * data 数据结构如下
   *
   * {
   *    cmd: 'update',
   *    params: [ { id: 'id', data: { status: 1 }} ]
   * }
   *
   */
  batch(data, next) {
    this.loading = true;
    const url = `${this.apiPrefix}/batch/${this.resourceName}`;
    super.httpPost(url, data).then((ret) => {
      this.batchResults = ret.data;
      this.handleSuccess(next, ret.data, true);
    }).catch((err) => {
      this.handleErr(err, next);
    });
  }

  delete(id, next) {
    this.loading = true;
    super.delete(id).then(() => {
      this.handleSuccess(next, null, true, this.delPopInfo);
    }).catch((err) => {
      this.handleErr(err, next);
    });
  }

  updateStatus(id, status, next) {
    this.loading = true;
    super.updateStatus(id, status).then((ret) => {
      this.item = ret.data;
      this.handleSuccess(next, ret.data, true, this.statusPopInfo);
    }).catch((err) => {
      this.handleErr(err, next);
    });
  }

  list(params = { page: 1, pageSize: 10 }, next) {
    this.loading = true;
    super.list(params).then((ret) => {
      this.listResult = ret.data;
      this.total = parseInt(ret.data.total, 10);
      this.items = ret.data.items;
      this.handleSuccess(next, ret.data.items);
    }).catch((err) => {
      this.handleErr(err, next);
    });
  }

  count(params = {}, next) {
    this.loading = true;
    const url = `${this.apiPrefix}/count/${this.resourceName}`;
    FetchStore.httpGet(url, params).then((ret) => {
      this.totalCount = ret.data.total;
      this.handleSuccess(next, ret.data.total);
    }).catch((err) => {
      this.handleErr(err, next);
    });
  }

  listAll(params = {}, next) {
    this.loading = true;
    const url = `${this.apiPrefix}/listAll/${this.resourceName}`;
    FetchStore.httpGet(url, params).then((ret) => {
      this.allItems = ret.data;
      this.handleSuccess(next, ret.data);
    }).catch((err) => {
      this.handleErr(err, next);
    });
  }

  treeList(params = {}, next) {
    this.loading = true;
    const url = `${this.apiPrefix}/treeList/${this.resourceName}`;
    FetchStore.httpGet(url, params).then((ret) => {
      this.treeItems = ret.data;
      this.handleSuccess(next, ret.data);
    }).catch((err) => {
      this.handleErr(err, next);
    });
  }
}
