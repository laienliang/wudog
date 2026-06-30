const BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { orders: [], statusMap: { pending_pay: '待支付', paid: '已支付', confirmed: '已确认', completed: '已完成', cancelled: '已取消', refunded: '已退款' } },
  onShow() { this.loadOrders(); },
  async loadOrders() {
    const token = wx.getStorageSync('token');
    if (!token) { this.setData({ orders: [] }); return; }
    try {
      const res = await new Promise((r, j) => wx.request({ url: BASE + '/orders', header: { Authorization: 'Bearer ' + token }, success: r, fail: j }));
      this.setData({ orders: res.data?.data?.list || res.data?.list || [] });
    } catch (e) { console.error(e); }
  },
});
