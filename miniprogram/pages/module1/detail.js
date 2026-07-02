import { request, getImageUrl } from '../../utils/request';

Page({
  data: {
    product: null,
    loading: true,
    selectedSku: null,
    quantity: 1,
    currentImage: 0,
    allImages: [],
  },

  onLoad(options) {
    this.fetchDetail(options.id);
  },

  async fetchDetail(id) {
    this.setData({ loading: true });
    try {
      const res = await request(`/api/product/detail/${id}`);
      const p = res.data;
      const allImages = [getImageUrl(p.mainImage), ...(p.images || []).map(i => getImageUrl(i.url))].filter(Boolean);
      this.setData({ product: p, allImages, loading: false });
    } catch {
      this.setData({ product: null, loading: false });
    }
  },

  onSwiperChange(e) {
    this.setData({ currentImage: e.detail.current });
  },

  onSkuTap(e) {
    const { id } = e.currentTarget.dataset;
    const sku = this.data.product.skus.find(s => s.id === Number(id));
    this.setData({ selectedSku: sku || null });
  },

  onQtyMinus() {
    if (this.data.quantity > 1) this.setData({ quantity: this.data.quantity - 1 });
  },

  onQtyPlus() {
    this.setData({ quantity: this.data.quantity + 1 });
  },


  async addToCart() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    if (this.data.product.skus?.length && !this.data.selectedSku) {
      wx.showToast({ title: '请选择规格', icon: 'none' }); return;
    }
    try {
      await request('/public/cart/add', 'POST', {
        product_id: this.data.product.id,
        sku_id: this.data.selectedSku?.id || null,
        quantity: this.data.quantity,
        source_module: 'module1',
      });
      wx.showToast({ title: '已加入购物车', icon: 'success' });
    } catch {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  async buyNow() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    if (this.data.product.skus?.length && !this.data.selectedSku) {
      wx.showToast({ title: '请选择规格', icon: 'none' }); return;
    }
    try {
      await request('/public/cart/add', 'POST', {
        product_id: this.data.product.id,
        sku_id: this.data.selectedSku?.id || null,
        quantity: this.data.quantity,
        source_module: 'module1',
      });
      wx.navigateTo({ url: '/pages/cart/cart' });
    } catch {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },
});
