import { request } from '../../utils/request';

Page({
  data: {
    keyword: '',
    notes: [],
    topics: [],
    searching: false,
    noResult: false,
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  async onSearch() {
    const { keyword } = this.data;
    if (!keyword.trim()) return;
    this.setData({ searching: true, noResult: false });
    try {
      const [noteRes, topicRes] = await Promise.all([
        request('/api/travel-note/list', 'GET', { keyword, status: 'published', page: 1, pageSize: 20 }),
        request('/api/topic/list'),
      ]);
      const filteredTopics = (topicRes.data.list || []).filter(t => t.name.includes(keyword));
      this.setData({
        notes: noteRes.data.list || [],
        topics: filteredTopics,
        noResult: noteRes.data.list.length === 0 && filteredTopics.length === 0,
      });
    } catch { /* */ } finally {
      this.setData({ searching: false });
    }
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/community-detail/community-detail?id=${id}` });
  },

  goTopic(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/topic/topic?id=${id}` });
  },

  goUser(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/user/index?id=${id}` });
  },
});
