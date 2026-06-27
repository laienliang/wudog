import { request } from '../../utils/request';

Page({
  data: {
    tab: 'following',
    list: [],
    page: 1,
    pageSize: 20,
    noMore: false,
    loading: true,
    userId: null,
  },

  onLoad(options) {
    this.setData({ userId: options.userId || '' });
    this.fetchList(true);
  },

  switchTab(e) {
    const { tab } = e.currentTarget.dataset;
    if (tab === this.data.tab) return;
    this.setData({ tab, page: 1, noMore: false, list: [] });
    this.fetchList(true);
  },

  async fetchList(refresh = false) {
    this.setData({ loading: true });
    try {
      const { page, pageSize, tab, userId } = this.data;
      const params = { page, pageSize, type: tab === 'following' ? 'following' : 'follower' };
      if (userId) params.userId = Number(userId);
      const res = await request('/api/follow/list', 'GET', params);
      const newList = refresh ? res.data.list : [...this.data.list, ...res.data.list];
      this.setData({
        list: newList,
        noMore: newList.length >= res.data.total,
        loading: false,
      });
    } catch {
      this.setData({ loading: false });
    }
  },

  onReachBottom() {
    if (this.data.noMore || this.data.loading) return;
    this.setData({ page: this.data.page + 1 });
    this.fetchList();
  },

  goUser(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/user/index?id=${id}` });
  },
});
