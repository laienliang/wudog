// pages/scenic/detail.js
const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    spot: null,
    ticketTypes: [],
  },

  onLoad(options) {
    const id = options.id
    if (!id) return
    api.getScenicSpot(parseInt(id)).then((res) => {
      this.setData({ spot: res })
      if (res.ticketTypes) {
        this.setData({ ticketTypes: res.ticketTypes })
      }
    })
  },

  goBack() {
    wx.navigateBack()
  },

  buyTicket(e) {
    const { id, name, price } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/order/index?orderType=1&itemId=${id}&itemName=${encodeURIComponent(name)}&price=${price}&ticketTypeId=${id}`,
    })
  },
})
