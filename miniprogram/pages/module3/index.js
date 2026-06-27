import { request } from '../../utils/request';

Page({
  data: {
    homestays: [],
    styleTags: ['全部', '田园风', '禅意', '亲子', '民族风', '现代简约'],
    activeTag: '全部',
    page: 1,
    pageSize: 20,
    noMore: false,
    loading: false,
  },

  onLoad() {
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

  async fetchData(refresh = false) {
    this.setData({ loading: true });
    wx.showNavigationBarLoading();
    try {
      const { page, pageSize, activeTag } = this.data;
      const params = { page, pageSize };
      if (activeTag !== '全部') params.style_tag = activeTag;
      const res = await request('/api/homestay/list', 'GET', params);
      const list = refresh ? res.data.list : [...this.data.homestays, ...res.data.list];
      this.setData({ homestays: list, noMore: list.length >= res.data.total });
    } catch { /* */ } finally {
      this.setData({ loading: false });
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  },

  onTagTap(e) {
    const tag = e.currentTarget.dataset.tag;
    if (tag === this.data.activeTag) return;
    this.setData({ activeTag: tag, page: 1, noMore: false, homestays: [] });
    this.fetchData(true);
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/module3/detail?id=${id}` });
  },
});
