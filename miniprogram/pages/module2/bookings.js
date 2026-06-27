import { request } from '../../utils/request';

Page({
  data: {
    bookings: [],
    loading: true,
    statusText: { pending: '待确认', confirmed: '已确认', rejected: '已拒绝', cancelled: '已取消', completed: '已完成' },
    statusColor: { pending: '#faad14', confirmed: '#52c41a', rejected: '#e74c3c', cancelled: '#999', completed: '#1677ff' },
  },

  onShow() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    this.fetchData();
  },

  async fetchData() {
    this.setData({ loading: true });
    try {
      const res = await request('/api/restaurant-booking/list');
      this.setData({ bookings: res.data.list || [], loading: false });
    } catch { this.setData({ loading: false }); }
  },

  async cancelBooking(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个预订吗？',
      success: async (modalRes) => {
        if (!modalRes.confirm) return;
        try {
          await request(`/api/restaurant-booking/cancel/${id}`, 'PUT');
          wx.showToast({ title: '已取消', icon: 'success' });
          this.fetchData();
        } catch { wx.showToast({ title: '操作失败', icon: 'none' }); }
      },
    });
  },
});
