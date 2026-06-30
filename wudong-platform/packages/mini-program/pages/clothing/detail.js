const { productApi, cartStorage } = require('../../utils/api');
const BASE = 'http://127.0.0.1:7001/api/v1';

Page({
  data: {
    product: {},
    images: [],
    skus: [],
    reviews: [],
    selectedSkuId: null,
    selectedPrice: 0,
    quantity: 1,
    favorited: false,
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ productId: parseInt(options.id) });
      this.loadProduct(options.id);
    }
  },

  async loadProduct(id) {
    try {
      const product = await productApi.detail(id);
      const images = product.mainImage ? [product.mainImage] : [];

      const [skus, reviews] = await Promise.all([
        productApi.skus(id),
        productApi.reviews(id),
      ]);

      const skuList = skus || [];
      this.setData({
        product,
        images,
        skus: skuList,
        reviews: reviews.list || reviews || [],
        selectedSkuId: skuList.length > 0 ? skuList[0].id : null,
        selectedPrice: skuList.length > 0 ? skuList[0].price : product.price,
      });

      // 检查是否已收藏
      const favIds = wx.getStorageSync('wudong_favorites') || [];
      let favorited = favIds.includes(parseInt(id));
      try {
        const token = wx.getStorageSync('token');
        if (token) {
          const res = await new Promise(r => wx.request({ url: BASE + '/favorites?targetType=product', header: { 'Authorization': 'Bearer ' + token }, success: r }));
          const favs = res.data?.data || res.data || [];
          if (favs.some(f => f.targetId === parseInt(id))) favorited = true;
        }
      } catch(_) {}
      this.setData({ favorited });
    } catch (e) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  onSkuTap(e) {
    const skuId = e.currentTarget.dataset.id;
    const sku = this.data.skus.find(s => String(s.id) === skuId);
    this.setData({
      selectedSkuId: skuId,
      selectedPrice: sku ? sku.price : this.data.product.price,
    });
  },

  onQtyMinus() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 });
    }
  },

  onQtyPlus() {
    this.setData({ quantity: this.data.quantity + 1 });
  },

  onFavoriteTap() {
    const id = this.data.product.id;
    const newState = !this.data.favorited;
    // 本地存储
    const favIds = wx.getStorageSync('wudong_favorites') || [];
    wx.setStorageSync('wudong_favorites', newState ? [...favIds, id] : favIds.filter(f => f !== id));
    this.setData({ favorited: newState });
    wx.showToast({ title: newState ? '已收藏' : '已取消', icon: 'none' });
    // 同步到后端
    const token = wx.getStorageSync('token');
    if (token) {
      wx.request({
        url: BASE + '/favorites', method: 'POST',
        header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        data: { targetType: 'product', targetId: id },
      });
    }
  },

  onAddToCart() {
    const sku = this.data.skus.find(s => s.id === this.data.selectedSkuId);
    cartStorage.add({
      productId: this.data.product.id,
      skuId: this.data.selectedSkuId,
      name: this.data.product.name,
      price: this.data.selectedPrice,
      image: this.data.product.mainImage || '',
      quantity: this.data.quantity,
      skuName: sku ? sku.name : '',
    });
    wx.showToast({ title: '已加入购物车', icon: 'success' });
  },

  onBuyNow() {
    const sku = this.data.skus.find(s => s.id === this.data.selectedSkuId);
    if (!sku) { wx.showToast({ title: '请选择规格', icon: 'none' }); return; }
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/index' }); return; }
    const BASE = 'http://127.0.0.1:7001/api/v1';
    wx.request({
      url: BASE + '/orders', method: 'POST',
      header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      data: { orderType: 'clothing', merchantId: 1, items: [{
        productType: 'clothing', productId: this.data.product.id, productName: this.data.product.name,
        productImage: this.data.product.mainImage || '', skuId: sku.id, skuName: sku.name,
        unitPrice: sku.price || this.data.product.price, quantity: this.data.quantity,
      }]},
      success: () => { wx.showToast({ title: '下单成功', icon: 'success' }); },
      fail: () => { wx.showToast({ title: '下单失败', icon: 'none' }); },
    });
  },
  onContact() {
    wx.showActionSheet({ itemList: ['拨打客服电话: 13988889999'], success: () => wx.makePhoneCall({ phoneNumber: '13988889999' }) });
  },
});
