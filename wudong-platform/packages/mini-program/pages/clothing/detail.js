const { productApi, cartStorage } = require('../../utils/api');

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
      this.setData({ favorited: favIds.includes(parseInt(id)) });
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
    const favIds = wx.getStorageSync('wudong_favorites') || [];
    const id = this.data.product.id;
    if (this.data.favorited) {
      const updated = favIds.filter(f => f !== id);
      wx.setStorageSync('wudong_favorites', updated);
    } else {
      favIds.push(id);
      wx.setStorageSync('wudong_favorites', favIds);
    }
    this.setData({ favorited: !this.data.favorited });
    wx.showToast({ title: this.data.favorited ? '已收藏' : '已取消', icon: 'none' });
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
