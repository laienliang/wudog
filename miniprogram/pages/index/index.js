// pages/index/index.js
const api = require('../../utils/api')

Page({
  data: {
    spots: [],
    routes: [],
  },

  onLoad() {
    this.loadData()
  },

  loadData() {
    Promise.all([api.getScenicSpots(1, 6), api.getRoutes(1, 4)])
      .then(([spotRes, routeRes]) => {
        this.setData({ spots: spotRes.list, routes: routeRes.list })
      })
      .catch(console.error)
  },

  toScenicDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/scenic/detail?id=${id}` })
  },

  toRouteDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/route/detail?id=${id}` })
  },
})
