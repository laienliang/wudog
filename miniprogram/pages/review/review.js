// pages/review/review.js
const { get, post } = require('../../utils/request')

Page({
  data: {
    orderId: '',
    accommodationId: '',
    accommodationName: '',

    // 表单数据
    rating: 5,
    content: '',
    isAnonymous: false,

    // 星星选项
    stars: [1, 2, 3, 4, 5],
    submitting: false,

    loading: true,
  },

  onLoad(options) {
    const { orderId, accommodationId, accommodationName } = options
    this.setData({
      orderId,
      accommodationId,
      accommodationName: decodeURIComponent(accommodationName || ''),
      loading: false,
    })
  },

  // 选择评分星级
  onStarTap(e) {
    this.setData({ rating: e.currentTarget.dataset.star })
  },

  // 输入评价内容
  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  // 切换匿名
  onAnonymousChange(e) {
    this.setData({ isAnonymous: e.detail.value })
  },

  // 提交评价
  submitReview() {
    const { orderId, accommodationId, rating, content, isAnonymous, submitting } = this.data

    if (submitting) return

    if (!content.trim()) {
      wx.showToast({ title: '请输入评价内容', icon: 'none' })
      return
    }

    if (content.trim().length < 10) {
      wx.showToast({ title: '评价内容至少10个字', icon: 'none' })
      return
    }

    this.setData({ submitting: true })

    post('/api/review/create', {
      userId: 1,           // 模拟用户ID
      accommodationId: parseInt(accommodationId),
      orderId: parseInt(orderId),
      rating,
      content: content.trim(),
      isAnonymous: isAnonymous ? 1 : 0,
      status: 1,          // 显示状态
    })
      .then(res => {
        if (res.code === 200) {
          wx.showToast({ title: '评价成功', icon: 'success' })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        } else {
          wx.showToast({ title: res.message || '评价失败', icon: 'none' })
          this.setData({ submitting: false })
        }
      })
      .catch((err) => {
        console.error('[review submit error]', err)
        wx.showToast({ title: '网络错误', icon: 'none' })
        this.setData({ submitting: false })
      })
  },
})
