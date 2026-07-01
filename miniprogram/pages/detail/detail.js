const { getProductDetail, toggleFavorite, addToCart, getProductReviews } = require('../../utils/api');
const app = getApp();

Page({
  data: {
    product: null,
    selectedSku: null,
    loading: true,
    isFavorited: false,
    reviews: [],
    currentImage: 0,
  },

  onLoad(options) {
    if (options.id) {
      this.loadProduct(options.id);
    }
  },

  async loadProduct(id) {
    this.setData({ loading: true });
    try {
      const res = await getProductDetail(id);
      const product = res.data;
      this.setData({
        product,
        selectedSku: product.skus?.length > 0 ? product.skus[0] : null,
      });
      this.loadReviews(id);
      this.checkFavorite(product.id);
    } catch {
      wx.showToast({ title: '商品不存在', icon: 'none' });
    }
    finally { this.setData({ loading: false }); }
  },

  async loadReviews(productId) {
    try {
      const res = await getProductReviews(productId);
      const reviews = (res.data || []).map(r => ({
        ...r,
        ratingText: '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating),
      }));
      this.setData({ reviews });
    } catch {}
  },

  async checkFavorite(productId) {
    if (!app.globalData.token) return;
    try {
      const res = await require('../../utils/api').getFavoriteList();
      const favorites = res.data || [];
      this.setData({ isFavorited: favorites.some(f => f.product_id === productId) });
    } catch {}
  },

  onSwiperChange(e) { this.setData({ currentImage: e.detail.current }); },
  selectSku(e) { this.setData({ selectedSku: this.data.product.skus[e.currentTarget.dataset.index] }); },

  async onFavorite() {
    if (!app.checkLogin()) return;
    try {
      const res = await toggleFavorite({ product_id: this.data.product.id });
      this.setData({ isFavorited: res.data.favorited });
      wx.showToast({ title: res.data.favorited ? '已收藏' : '已取消', icon: 'success' });
    } catch {}
  },

  async onAddCart() {
    if (!app.checkLogin()) return;
    const { selectedSku } = this.data;
    if (!selectedSku) { wx.showToast({ title: '请选择规格', icon: 'none' }); return; }
    if (selectedSku.stock <= 0) { wx.showToast({ title: '已售罄', icon: 'none' }); return; }
    try {
      await addToCart({ product_id: this.data.product.id, sku_id: selectedSku.id, quantity: 1 });
      wx.showToast({ title: '已加入购物车', icon: 'success' });
    } catch {}
  },

  onBuy() {
    if (!app.checkLogin()) return;
    const { product, selectedSku } = this.data;
    if (!selectedSku) { wx.showToast({ title: '请选择规格', icon: 'none' }); return; }
    if (selectedSku.stock <= 0) { wx.showToast({ title: '已售罄', icon: 'none' }); return; }
    wx.navigateTo({
      url: `/pages/order-confirm/order-confirm?productId=${product.id}&skuId=${selectedSku.id}&productName=${encodeURIComponent(product.name)}&specName=${encodeURIComponent(selectedSku.spec_name)}&price=${selectedSku.price}&quantity=1`,
    });
  },

  goChat() {
    if (!app.checkLogin()) return;
    wx.navigateTo({ url: '/pages/chat/chat' });
  },
});
