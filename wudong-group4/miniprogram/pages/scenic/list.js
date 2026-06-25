// pages/scenic/list.js
const api = require('../../utils/api')

Page({
  data: { spots: [] },

  onLoad() {
    this.loadScenic()
  },

  loadScenic() {
    api.getScenicSpots(1, 20).then((res) => {
      this.setData({ spots: res.list })
    })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/scenic/detail?id=${id}` })
  },
})
