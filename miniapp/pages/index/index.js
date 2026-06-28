// 🔴 临时最小测试版 — 不 require 任何外部模块
// 如果这个版本页面能渲染出调试面板，说明原来的 require 有问题

const BASE_URL = 'http://127.0.0.1:3000/api';

Page({
  data: {
    categories: [],
    products: [],
    activeCategoryId: '',
    keyWord: '',
    loading: false,
    message: '',
    debugText: '页面已加载（最小版）',
    debugCategoriesCount: 0,
    debugProductsCount: 0,
    debugError: '',
    debugStep: '1-Page已创建',
  },

  onLoad() {
    this.setData({ debugStep: '2-onLoad已触发' });
    this.loadData();
  },

  onShow() {
    this.setData({ debugStep: this.data.debugStep + ' -> 3-onShow' });
    if (this._hasLoaded) {
      this.loadProducts();
    }
  },

  async loadData() {
    this.setData({ debugStep: this.data.debugStep + ' -> 4-loadData' });
    await Promise.all([this.loadCategories(), this.loadProducts()]);
    this.setData({
      debugStep: this.data.debugStep + ' -> 5-完成',
      debugText: '加载成功：分类 ' + this.data.categories.length + ' 个，商品 ' + this.data.products.length + ' 个',
    });
    this._hasLoaded = true;
  },

  loadCategories() {
    this.setData({ debugStep: this.data.debugStep + ' -> 6-请求分类' });
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + '/app/wudong/product-categories/list',
        method: 'GET',
        success: res => {
          const body = res.data || {};
          if (body.code === 1000) {
            const list = body.data || [];
            this.setData({
              categories: list,
              debugCategoriesCount: list.length,
              debugStep: this.data.debugStep + ' -> 7-分类OK(' + list.length + ')',
            });
            resolve(list);
          } else {
            this.setData({ debugError: '分类接口 code=' + body.code, debugText: '失败' });
            reject(new Error(body.message || 'code not 1000'));
          }
        },
        fail: err => {
          this.setData({ debugError: '分类请求fail: ' + (err.errMsg || JSON.stringify(err)), debugText: '失败' });
          reject(err);
        },
      });
    });
  },

  loadProducts() {
    this.setData({ loading: true, message: '', debugStep: this.data.debugStep + ' -> 8-请求商品' });
    const query = [
      'page=1',
      'pageSize=20',
      this.data.activeCategoryId ? 'categoryId=' + this.data.activeCategoryId : '',
      this.data.keyWord ? 'keyWord=' + encodeURIComponent(this.data.keyWord) : '',
    ].filter(Boolean).join('&');

    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + '/app/wudong/products/page?' + query,
        method: 'GET',
        success: res => {
          const body = res.data || {};
          if (body.code === 1000) {
            const page = body.data || {};
            const list = page.list || [];
            const catCount = this.data.debugCategoriesCount;
            this.setData({
              products: list,
              loading: false,
              debugProductsCount: list.length,
              debugText: '加载成功：分类 ' + catCount + ' 个，商品 ' + list.length + ' 个',
              debugStep: this.data.debugStep + ' -> 9-商品OK(' + list.length + ')',
            });
            resolve(page);
          } else {
            this.setData({ loading: false, debugError: '商品接口 code=' + body.code, debugText: '失败' });
            reject(new Error(body.message || 'code not 1000'));
          }
        },
        fail: err => {
          this.setData({ loading: false, debugError: '商品请求fail: ' + (err.errMsg || JSON.stringify(err)), debugText: '失败' });
          reject(err);
        },
      });
    });
  },

  onKeywordInput(event) {
    this.setData({ keyWord: event.detail.value });
  },

  onSearch() {
    this.loadProducts();
  },

  onSelectCategory(event) {
    this.setData({ activeCategoryId: event.currentTarget.dataset.id || '' });
    this.loadProducts();
  },

  goDetail(event) {
    wx.navigateTo({
      url: '/pages/detail/index?id=' + event.currentTarget.dataset.id,
    });
  },

  goFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/index',
    });
  },
});
