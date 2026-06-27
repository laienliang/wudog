import { request } from '../../utils/request';

Page({
  data: {
    topic: null,
    list: [],
    page: 1,
    pageSize: 20,
    total: 0,
    noMore: false,
    loading: true,
  },

  onLoad(options) {
    this.setData({ topicId: options.id });
    this.fetchTopic();
    this.fetchList(true);
  },

  async fetchTopic() {
    try {
      const res = await request(`/api/topic/detail/${this.data.topicId}`);
      this.setData({ topic: res.data });
    } catch { /* */ }
  },

  async fetchList(refresh = false) {
    this.setData({ loading: true });
    try {
      const { page, pageSize, topicId } = this.data;
      const res = await request('/api/travel-note/list', 'GET', {
        page, pageSize, topic: topicId, status: 'published',
      });
      const newList = refresh ? res.data.list : [...this.data.list, ...res.data.list];
      this.setData({
        list: newList,
        total: res.data.total,
        noMore: newList.length >= res.data.total,
      });
    } catch { /* */ } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
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

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/community-detail/community-detail?id=${id}` });
  },
});
