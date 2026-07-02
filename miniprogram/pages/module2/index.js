import { request } from '../../utils/request';

Page({
  data: {
    tab: 'restaurant',
    restaurants: [],
    farmProducts: [],
    farmCategories: [],
    activeCategory: 0,
    page: 1,
    pageSize: 20,
    noMore: false,
    loading: false,
  },

  onLoad() {
    this.fetchFarmCategories();
    this.fetchData(true);
  },

  onPullDownRefresh() {
    this.setData({ page: 1, noMore: false });
    this.fetchData(true);
  },

  onReachBottom() {
    if (this.data.noMore || this.data.loading) return;
    this.setData({ page: this.data.page + 1 });
    this.fetchData();
  },

  async fetchFarmCategories() {
    try {
      const res = await request('/api/farm-product/category/list');
      this.setData({ farmCategories: res.data || [] });
    } catch { /* */ }
  },

  async fetchData(refresh = false) {
    this.setData({ loading: true });
    wx.showNavigationBarLoading();
    try {
      const { tab, page, pageSize, activeCategory } = this.data;
      if (tab === 'restaurant') {
        const res = await request('/api/restaurant/list', 'GET', { page, pageSize });
        const list = refresh ? res.data.list : [...this.data.restaurants, ...res.data.list];
        this.setData({ restaurants: list, noMore: list.length >= res.data.total });
      } else {
        const params = { page, pageSize, status: 'published' };
        if (activeCategory) params.category_id = activeCategory;
        const res = await request('/api/farm-product/list', 'GET', params);
        const list = refresh ? res.data.list : [...this.data.farmProducts, ...res.data.list];
        this.setData({ farmProducts: list, noMore: list.length >= res.data.total });
      }
    } catch { /* */ } finally {
      this.setData({ loading: false });
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  },

  onTabTap(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.tab) return;
    this.setData({ tab, page: 1, noMore: false });
    this.fetchData(true);
  },

  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id || 0;
    this.setData({ activeCategory: Number(id), page: 1, noMore: false, farmProducts: [] });
    this.fetchData(true);
  },

  goRestaurantDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/module2/restaurant-detail?id=${id}` });
  },

  goFarmDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/module2/farm-detail?id=${id}` });
  },

  goMine() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    wx.navigateTo({ url: '/pages/mine/index' });
  },
});
