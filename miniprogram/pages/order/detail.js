const { get, post } = require('../../utils/request');
const { ORDER_STATUS } = require('../../utils/constants');

function toStars(rating) {
  var count = Math.floor(rating || 5);
  var s = '';
  for (var i = 0; i < count; i++) { s += '★'; }
  return s;
}

Page({
  data: {
    order: null, statusMap: ORDER_STATUS,
    showReview: false, reviewRating: 5, reviewContent: '',
    submittingReview: false,
  },

  onLoad(options) {
    this.setData({ orderId: Number(options.id) });
    this.fetchOrder();
  },

  fetchOrder() {
    const id = this.data.orderId;
    get(`/api/lodging/orders/${id}`)
      .then(order => this.setData({ order }))
      .catch(() => {});
  },

  onPay() {
    const that = this;
    wx.showModal({
      title: '确认支付',
      content: '模拟支付：确认后将扣减库存并更新订单状态',
      success: async (res) => {
        if (!res.confirm) return;
        try {
          await post(`/api/lodging/order/pay/${that.data.order.id}`);
          wx.showToast({ title: '支付成功', icon: 'success' });
          that.fetchOrder();
        } catch { wx.showToast({ title: '支付失败', icon: 'none' }); }
      },
    });
  },

  onCancel() {
    const that = this;
    wx.showModal({
      title: '确认取消',
      content: '取消订单将按退改规则处理',
      success: async (res) => {
        if (!res.confirm) return;
        try {
          await post('/api/lodging/order/cancel', { orderId: that.data.order.id, reason: '用户取消' });
          wx.showToast({ title: '已取消', icon: 'success' });
          setTimeout(() => wx.navigateBack(), 1500);
        } catch { wx.showToast({ title: '取消失败', icon: 'none' }); }
      },
    });
  },

  onOpenReview() {
    this.setData({ showReview: true, reviewRating: 5, reviewContent: '' });
  },

  onCloseReview() {
    this.setData({ showReview: false });
  },

  onRatingTap(e) {
    this.setData({ reviewRating: Number(e.currentTarget.dataset.rating) });
  },

  onReviewInput(e) {
    this.setData({ reviewContent: e.detail.value });
  },

  async onSubmitReview() {
    if (this.data.submittingReview) return;
    const order = this.data.order;
    if (!order) return;
    this.setData({ submittingReview: true });
    try {
      await post('/api/lodging/reviews', {
        order_id: order.id,
        homestay_id: order.homestay_id,
        rating: this.data.reviewRating,
        content: this.data.reviewContent,
      });
      wx.showToast({ title: '评价成功', icon: 'success' });
      this.setData({ showReview: false, submittingReview: false });
      this.fetchOrder();
    } catch (err) {
      wx.showToast({ title: '评价失败，请重试', icon: 'none' });
      this.setData({ submittingReview: false });
    }
  },
});
