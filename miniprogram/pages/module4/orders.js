import { request } from '../../utils/request';

Page({
  data: {
    tickets: [],
    loading: true,
    statusText: { unused: '未使用', used: '已核销', refunded: '已退款', expired: '已过期' },
    statusColor: { unused: '#1677ff', used: '#52c41a', refunded: '#999', expired: '#faad14' },
  },

  onShow() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    this.fetchData();
  },

  async fetchData() {
    this.setData({ loading: true });
    try {
      const res = await request('/api/e-ticket/list');
      this.setData({ tickets: res.data || [], loading: false });
    } catch { this.setData({ loading: false }); }
  },
});
