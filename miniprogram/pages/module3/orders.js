import { request } from '../../utils/request';

Page({
  data: {
    bookings: [],
    loading: true,
    statusText: { pending: '待支付', paid: '已支付', confirmed: '已确认', cancelled: '已取消', refunding: '退款中', refunded: '已退款', completed: '已完成' },
    statusColor: { pending: '#faad14', paid: '#1677ff', confirmed: '#52c41a', cancelled: '#999', refunding: '#faad14', refunded: '#999', completed: '#1677ff' },
  },

  onShow() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    this.fetchData();
  },

  async fetchData() {
    this.setData({ loading: true });
    try {
      const res = await request('/api/homestay-booking/list');
      this.setData({ bookings: res.data || [], loading: false });
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
          await request(`/api/homestay-booking/cancel/${id}`, 'PUT');
          wx.showToast({ title: '已取消', icon: 'success' });
          this.fetchData();
        } catch { wx.showToast({ title: '操作失败', icon: 'none' }); }
      },
    });
  },
});
