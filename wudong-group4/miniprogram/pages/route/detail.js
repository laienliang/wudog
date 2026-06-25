// pages/route/detail.js
const api = require('../../utils/api')
const app = getApp()

Page({
  data: { route: null },

  onLoad(options) {
    const id = options.id
    if (!id) return
    api.getRoute(parseInt(id)).then((res) => {
      this.setData({ route: res })
    })
  },

  goBack() {
    wx.navigateBack()
  },

  goBuy() {
    const r = this.data.route
    wx.navigateTo({
      url: `/pages/order/index?orderType=2&itemId=${r.id}&itemName=${encodeURIComponent(r.name)}&price=${r.price}`,
    })
  },
})
