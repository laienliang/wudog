const { getOrderList, requestCancelOrder, requestReturnOrder, revokeCancelOrder, createReview } = require('../../utils/api');
const app = getApp();

Page({
  data: {
    orders: [],
    loading: false,
    page: 1,
    hasMore: true,
    statusMap: {
      0: '待处理', 1: '已确认', 2: '已发货', 3: '已完成', 4: '已取消',
    },
    // 评价弹窗
    showReview: false,
    reviewOrderId: null,
    reviewRating: 5,
    reviewContent: '',
  },

  onLoad() { this.loadOrders(true); },
  onPullDownRefresh() { this.loadOrders(true); },
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadOrders(false, this.data.page + 1);
    }
  },

  async loadOrders(reset, page) {
    if (this.data.loading) return;
    const p = reset ? 1 : (page || this.data.page + 1);
    this.setData({ loading: true });
    try {
      const res = await getOrderList({ userId: app.globalData.userInfo?.id, page: p, pageSize: 10 });
      const list = res.data?.list || [];
      this.setData({
        orders: reset ? list : [...this.data.orders, ...list],
        page: p,
        hasMore: list.length >= 10,
      });
    } catch {}
    finally {
      this.setData({ loading: false });
      if (reset) wx.stopPullDownRefresh();
    }
  },

  async onCancel(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '申请取消',
      content: '确定要取消该订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await requestCancelOrder(id);
            wx.showToast({ title: '申请已提交', icon: 'success' });
            this.loadOrders(true);
          } catch {}
        }
      },
    });
  },

  async onReturn(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '申请退货',
      content: '确定要申请退货吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await requestReturnOrder(id);
            wx.showToast({ title: '申请已提交', icon: 'success' });
            this.loadOrders(true);
          } catch {}
        }
      },
    });
  },

  async onRevoke(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '撤销申请',
      content: '确定要撤销取消/退货申请吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await revokeCancelOrder(id);
            wx.showToast({ title: '已撤销', icon: 'success' });
            this.loadOrders(true);
          } catch {}
        }
      },
    });
  },

  onReview(e) {
    const orderId = e.currentTarget.dataset.id;
    this.setData({ showReview: true, reviewOrderId: orderId, reviewRating: 5, reviewContent: '' });
  },

  onCloseReview() { this.setData({ showReview: false }); },
  onRatingChange(e) { this.setData({ reviewRating: e.detail.value }); },
  onReviewContentInput(e) { this.setData({ reviewContent: e.detail.value }); },

  async onSubmitReview() {
    const { reviewOrderId, reviewRating, reviewContent, orders } = this.data;
    const order = orders.find(o => o.id === reviewOrderId);
    if (!order) return;
    try {
      await createReview({
        product_id: order.product_id,
        order_id: order.id,
        rating: reviewRating,
        content: reviewContent.trim(),
      });
      wx.showToast({ title: '评价成功', icon: 'success' });
      this.setData({ showReview: false });
      this.loadOrders(true);
    } catch {}
  },
});
