import { request } from '../../utils/request';

Page({
  data: {
    list: [],
    topics: [],
    page: 1,
    pageSize: 20,
    total: 0,
    loading: false,
    noMore: false,
    keyword: '',
    activeTopic: '',
  },

  onLoad() {
    this.fetchTopics();
    this.fetchList(true);
  },

  onShow() {
    // 每次显示时刷新
  },

  onPullDownRefresh() {
    this.setData({ page: 1, noMore: false });
    this.fetchList(true);
  },

  onReachBottom() {
    if (this.data.noMore || this.data.loading) return;
    this.setData({ page: this.data.page + 1 });
    this.fetchList();
  },

  async fetchTopics() {
    try {
      const res = await request('/api/topic/list');
      this.setData({ topics: res.data.list || [] });
    } catch { /* */ }
  },

  async fetchList(refresh = false) {
    this.setData({ loading: true });
    wx.showNavigationBarLoading();
    try {
      const { page, pageSize, keyword, activeTopic } = this.data;
      const params = { page, pageSize, status: 'published' };
      if (keyword) params.keyword = keyword;
      if (activeTopic) params.topic = activeTopic;
      const res = await request('/api/travel-note/list', 'GET', params);
      const newList = refresh ? res.data.list : [...this.data.list, ...res.data.list];
      this.setData({
        list: newList,
        total: res.data.total,
        noMore: newList.length >= res.data.total,
      });
    } catch { /* */ } finally {
      this.setData({ loading: false });
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  },

  onSearch(e) {
    this.setData({ keyword: e.detail.value, page: 1, noMore: false, list: [] });
    this.fetchList(true);
  },

  onTopicTap(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ activeTopic: id || '', page: 1, noMore: false, list: [] });
    this.fetchList(true);
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/community-detail/community-detail?id=${id}` });
  },

  goPublish() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    wx.navigateTo({ url: '/pages/publish/publish' });
  },

  goMine() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    wx.navigateTo({ url: '/pages/mine/index' });
  },

  goSearch() {
    wx.navigateTo({ url: '/pages/search/search' });
  },
});
