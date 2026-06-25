// pages/order/index.js
const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    orders: [],
    statusText: { 0: '待使用', 1: '已核销', 2: '已过期', 3: '已取消', 4: '已退款' },
    statusClass: {
      0: 'status-pending',
      1: 'status-used',
      2: 'status-expired',
      3: 'status-cancelled',
      4: 'status-cancelled',
    },
    // 购票模式
    buying: false,
    buyType: 'ticket',       // 'ticket' | 'route'
    selectedId: null,
    itemList: [],
    quantity: 1,
    visitDate: '',
    submitting: false,
  },

  onLoad(options) {
    // 如果通过购买链接进入，切换到购买模式
    if (options.buyType) {
      this.setData({ buying: true, buyType: options.buyType })
      if (options.itemId) {
        this.setData({ selectedId: parseInt(options.itemId) })
      }
      if (options.price) {
        this.setData({ selectedId: parseInt(options.itemId), _tempPrice: parseFloat(options.price) })
      }
    }
    this.loadOrders()
  },

  loadOrders() {
    const userId = app.globalData.userId
    api.getMyOrders(userId).then((res) => {
      this.setData({ orders: res.list })
    }).catch(console.error)
  },

  // 切换购票类型
  switchBuyType(type) {
    this.setData({ buyType: type, selectedId: null, itemList: [] })
    if (type === 'ticket') {
      this.loadTicketList()
    } else {
      this.loadRouteList()
    }
  },

  loadTicketList() {
    // 先加载景区列表，再加载每个景区的票种
    api.getScenicSpots(1, 20).then((res) => {
      const scenicList = res.list || []
      const allTickets = []
      const promises = scenicList.map((s) =>
        api.getTicketTypes(s.id).then((tts) =>
          tts.map((t) => ({ ...t, scenicName: s.name }))
        )
      )
      Promise.all(promises).then((ttsArray) => {
        ttsArray.forEach((arr) => allTickets.push(...arr))
        this.setData({ itemList: allTickets })
      })
    })
  },

  loadRouteList() {
    api.getRoutes().then((res) => {
      this.setData({ itemList: res || [] })
    })
  },

  // 选择票种/路线
  selectItem(e) {
    const id = e.currentTarget.dataset.id
    const price = e.currentTarget.dataset.price
    this.setData({ selectedId: id, _tempPrice: price })
  },

  // 调整数量
  onQuantityChange(e) {
    const qty = parseInt(e.detail.value) || 1
    this.setData({ quantity: qty })
  },

  // 选择日期
  onDateChange(e) {
    this.setData({ visitDate: e.detail.value })
  },

  // 购买确认
  confirmPurchase() {
    if (!this.data.selectedId) {
      wx.showToast({ title: '请选择票种或路线', icon: 'none' })
      return
    }
    if (this.data.quantity < 1) {
      wx.showToast({ title: '数量至少为1', icon: 'none' })
      return
    }
    if (this.data.buying) {
      this.submitOrder()
    } else {
      this.setData({ buying: true })
    }
  },

  submitOrder() {
    this.setData({ submitting: true })
    const { buyType, selectedId, quantity, visitDate, _tempPrice, itemList } = this.data
    const userId = app.globalData.userId

    let item = null
    if (buyType === 'ticket') {
      item = itemList.find((i) => i.id === selectedId)
    } else {
      item = itemList.find((i) => i.id === selectedId)
    }

    if (!item) {
      wx.showToast({ title: '未找到商品', icon: 'none' })
      this.setData({ submitting: false })
      return
    }

    const orderData = {
      userId,
      orderType: buyType === 'ticket' ? 1 : 2,
      itemId: selectedId,
      itemName: item.scenicName ? item.scenicName + ' - ' + item.name : item.name,
      ticketTypeId: buyType === 'ticket' ? selectedId : undefined,
      quantity,
      totalPrice: (_tempPrice || item.sellPrice || item.price) * quantity,
      visitDate: buyType === 'ticket' ? visitDate : undefined,
      validDays: buyType === 'ticket' ? (item.validDays || 1) : undefined,
    }

    api.createOrder(orderData).then(() => {
      wx.showToast({ title: '下单成功', icon: 'success' })
      this.setData({ buying: false, selectedId: null, quantity: 1, visitDate: '', submitting: false })
      this.loadOrders()
    }).catch((e) => {
      wx.showToast({ title: e.message || '下单失败', icon: 'none' })
      this.setData({ submitting: false })
    })
  },

  // 返回订单列表
  backToList() {
    this.setData({ buying: false, selectedId: null })
  },

  cancelOrder(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认取消',
      content: '确定取消此订单？',
      success: (ret) => {
        if (ret.confirm) {
          api.cancelOrder(id).then(() => {
            wx.showToast({ title: '已取消', icon: 'success' })
            this.loadOrders()
          })
        }
      },
    })
  },

  formatTime(time) {
    return new Date(time).toLocaleDateString()
  },
})
