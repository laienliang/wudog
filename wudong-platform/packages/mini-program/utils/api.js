// 微信开发者工具中请使用 127.0.0.1 或实际 IP，不要用 localhost
// 注意：必须在 详情→本地设置 中勾选「不校验合法域名」
const BASE_URL = 'http://127.0.0.1:7001/api/v1';

const request = (url, data, method = 'GET') => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    const header = { 'Content-Type': 'application/json' };
    if (token) header['Authorization'] = 'Bearer ' + token;

    wx.request({
      url: BASE_URL + url,
      data,
      method,
      header,
      success: (res) => {
        if (res.statusCode === 401) {
          wx.navigateTo({ url: '/pages/login/index' });
          reject(res.data);
          return;
        }
        resolve(res.data && res.data.data !== undefined ? res.data.data : res.data);
      },
      fail: (err) => {
        console.error('API请求失败:', url, err);
        wx.showToast({ title: '网络错误: ' + (err.errMsg || '请检查后端是否启动'), icon: 'none', duration: 3000 });
        reject(err);
      },
    });
  });
};

const productApi = {
  list(params) { return request('/products', params); },
  detail(id) { return request('/products/' + id); },
  categories() { return request('/products/categories'); },
  skus(productId) { return request('/products/' + productId + '/skus'); },
  reviews(productId) { return request('/products/' + productId + '/reviews', { page: 1, pageSize: 10 }); },
};

const orderApi = {
  create(data) { return request('/orders', data, 'POST'); },
};

const cartStorage = {
  get() { return wx.getStorageSync('wudong_cart') || []; },
  save(cart) { wx.setStorageSync('wudong_cart', cart); },
  add(item) {
    const cart = this.get();
    const idx = cart.findIndex(i => i.skuId === item.skuId);
    if (idx >= 0) cart[idx].quantity += item.quantity;
    else cart.push(item);
    this.save(cart);
  },
  remove(skuId) {
    this.save(this.get().filter(i => i.skuId !== skuId));
  },
  updateQuantity(skuId, qty) {
    const cart = this.get();
    const item = cart.find(i => i.skuId === skuId);
    if (item) item.quantity = qty;
    this.save(cart);
  },
  getTotal() {
    return this.get().reduce((sum, i) => sum + i.price * i.quantity, 0);
  },
  clear() { wx.removeStorageSync('wudong_cart'); },
};

module.exports = { productApi, orderApi, cartStorage };
