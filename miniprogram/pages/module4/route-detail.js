import { request } from '../../utils/request';

Page({
  data: {
    route: null,
    loading: true,
  },

  onLoad(options) {
    this.fetchDetail(options.id);
  },

  async fetchDetail(id) {
    this.setData({ loading: true });
    try {
      const res = await request(`/api/tour-route/detail/${id}`);
      this.setData({ route: res.data, loading: false });
    } catch { this.setData({ route: null, loading: false }); }
  },
});
