// pages/order-list/order-list.js
const { get, post, put } = require('../../utils/request')

// 状态配置
const STATUS_MAP = {
  0: { text: '待支付', color: '#fa8c16', bg: '#fff7e6' },
  1: { text: '已支付', color: '#165DFF', bg: '#e6f4ff' },
  2: { text: '已取消', color: '#999', bg: '#f5f5f5' },
  3: { text: '已完成', color: '#52c41a', bg: '#f6ffed' },
  4: { text: '已退款', color: '#999', bg: '#f5f5f5' },
}

// Tab 配置
const TABS = [
  { key: '', label: '全部' },
  { key: '0', label: '待支付' },
  { key: '1', label: '已支付' },
  { key: '3', label: '已完成' },
  { key: '2', label: '已取消/退款' },
]

Page({
  data: {
    // Tab
    tabs: TABS,
    currentTab: 0,
    activeStatus: '',

    // 列表
    list: [],
    loading: true,
    refreshing: false,

    // 用户ID（模拟，实际应从登录态获取）
    userId: 1,
  },

  onLoad() {
    this.fetchList()
  },

  onShow() {
    // 每次显示页面刷新数据（从下单/评价页返回时）
    if (this.data.list.length > 0) {
      this.fetchList()
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ refreshing: true })
    this.fetchList().then(() => {
      wx.stopPullDownRefresh()
      this.setData({ refreshing: false })
    })
  },

  // 获取订单列表
  fetchList() {
    const { userId, activeStatus } = this.data
    this.setData({ loading: true })

    const params = {
      page: 1,
      pageSize: 50,
      userId,
    }
    if (activeStatus !== '') {
      params.status = activeStatus
    }

    return get('/api/order/list', params)
      .then(res => {
        if (res.code === 200) {
          const list = (res.data && res.data.list) || []
          // 补充状态显示信息
          list.forEach(item => {
            item._statusInfo = STATUS_MAP[item.status] || { text: '未知', color: '#999', bg: '#f5f5f5' }
            item._dateRange = `${item.checkInDate || ''} 至 ${item.checkOutDate || ''}`
            item._accommodationName = item.accommodationName || '住宿'
            item._roomName = item.roomName || '房型'
          })
          this.setData({ list, loading: false })
        } else {
          this.setData({ list: [], loading: false })
        }
      })
      .catch((err) => {
        console.error('[order-list error]', err)
        this.setData({ list: [], loading: false })
      })
  },

  // 切换Tab
  onTabChange(e) {
    const index = e.currentTarget.dataset.index
    const tab = this.data.tabs[index]
    this.setData({
      currentTab: index,
      activeStatus: tab.key,
      list: [],
      loading: true,
    })
    this.fetchList()
  },

  // 模拟支付
  onPay(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认支付',
      content: '确定要支付此订单吗？',
      confirmColor: '#165DFF',
      success: (res) => {
        if (res.confirm) {
          this.doPay(id)
        }
      },
    })
  },

  // 执行支付
  doPay(orderId) {
    wx.showLoading({ title: '正在支付...' })

    // 模拟支付延迟
    setTimeout(() => {
      put(`/api/order/update/${orderId}`, { status: 1 })
        .then(res => {
          wx.hideLoading()
          if (res.code === 200) {
            wx.showToast({ title: '支付成功', icon: 'success' })
            this.fetchList()
          } else {
            wx.showToast({ title: res.message || '支付失败', icon: 'none' })
          }
        })
        .catch(() => {
          wx.hideLoading()
          wx.showToast({ title: '网络异常', icon: 'none' })
        })
    }, 1500)
  },

  // 取消订单
  onCancel(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认取消',
      content: '确定要取消此订单吗？取消后不可恢复',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          put(`/api/order/update/${id}`, { status: 2 })
            .then(res => {
              if (res.code === 200) {
                wx.showToast({ title: '已取消', icon: 'success' })
                this.fetchList()
              } else {
                wx.showToast({ title: res.message || '操作失败', icon: 'none' })
              }
            })
            .catch(() => {
              wx.showToast({ title: '网络异常', icon: 'none' })
            })
        }
      },
    })
  },

  // 确认完成（模拟：从已支付→已完成）
  onComplete(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认完成',
      content: '确认已完成入住吗？完成后可进行评价',
      confirmColor: '#52c41a',
      success: (res) => {
        if (res.confirm) {
          put(`/api/order/update/${id}`, { status: 3 })
            .then(res => {
              if (res.code === 200) {
                wx.showToast({ title: '订单已完成', icon: 'success' })
                this.fetchList()
              } else {
                wx.showToast({ title: res.message || '操作失败', icon: 'none' })
              }
            })
            .catch(() => {
              wx.showToast({ title: '网络异常', icon: 'none' })
            })
        }
      },
    })
  },

  // 去评价
  onReview(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/review/review?orderId=${item.id}&accommodationId=${item.accommodationId}&accommodationName=${encodeURIComponent(item.accommodationName || '')}`,
    })
  },

  // 去首页
  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  // 查看详情
  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${e.currentTarget.dataset.accommodationId}`,
    })
  },
})
