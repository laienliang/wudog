import { request, getImageUrl } from '../../utils/request';

Page({
  data: {
    categories: [],
    activeCategory: 0,
    products: [],
    page: 1,
    pageSize: 20,
    noMore: false,
    loading: false,
    sort: 'newest',
  },

  onLoad() {
    this.fetchCategories();
    this.fetchProducts(true);
  },

  onPullDownRefresh() {
    this.setData({ page: 1, noMore: false });
    this.fetchProducts(true);
  },

  onReachBottom() {
    if (this.data.noMore || this.data.loading) return;
    this.setData({ page: this.data.page + 1 });
    this.fetchProducts();
  },

  async fetchCategories() {
    try {
      const res = await request('/api/product-category/list');
      this.setData({ categories: res.data || [] });
    } catch { /* */ }
  },

  async fetchProducts(refresh = false) {
    this.setData({ loading: true });
    wx.showNavigationBarLoading();
    try {
      const { page, pageSize, activeCategory, sort } = this.data;
      const params = { page, pageSize, status: 'published' };
      if (activeCategory) params.category_id = activeCategory;
      if (sort !== 'newest') params.sort = sort;
      const res = await request('/api/product/list', 'GET', params);
      const list = (res.data.list || []).map(p => ({ ...p, mainImage: getImageUrl(p.mainImage) }));
      const newList = refresh ? list : [...this.data.products, ...list];
      this.setData({
        products: newList,
        noMore: newList.length >= res.data.total,
      });
    } catch { /* */ } finally {
      this.setData({ loading: false });
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  },

  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id || 0;
    this.setData({ activeCategory: Number(id), page: 1, noMore: false, products: [] });
    this.fetchProducts(true);
  },

  onSortTap(e) {
    const sort = e.currentTarget.dataset.sort;
    if (sort === this.data.sort) return;
    this.setData({ sort, page: 1, noMore: false, products: [] });
    this.fetchProducts(true);
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/module1/detail?id=${id}` });
  },

  goMine() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    wx.navigateTo({ url: '/pages/mine/index' });
  },
});
