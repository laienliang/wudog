import { request } from '../../utils/request';

Page({
  data: {
    tab: 'spots',
    spots: [],
    routes: [],
    loading: true,
  },

  onLoad() {
    this.fetchData();
  },

  onPullDownRefresh() {
    this.fetchData();
  },

  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.tab) return;
    this.setData({ tab });
  },

  async fetchData() {
    this.setData({ loading: true });
    wx.showNavigationBarLoading();
    try {
      const [spotsRes, routesRes] = await Promise.all([
        request('/api/scenic-spot/list', 'GET', { page: 1, pageSize: 50 }),
        request('/api/tour-route/list', 'GET', { page: 1, pageSize: 50 }),
      ]);
      this.setData({
        spots: spotsRes.data?.list || [],
        routes: routesRes.data?.list || [],
      });
    } catch { /* */ } finally {
      this.setData({ loading: false });
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  },

  goSpotDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/module4/spot-detail?id=${id}` });
  },

  goRouteDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/module4/route-detail?id=${id}` });
  },

  goMine() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    wx.navigateTo({ url: '/pages/mine/index' });
  },
});
