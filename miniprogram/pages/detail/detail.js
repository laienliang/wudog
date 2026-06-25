// pages/detail/detail.js
const { get, fixImageUrl, IMG_BASE } = require('../../utils/request')

Page({
  data: {
    id: '',           // 住宿ID
    detail: null,      // 住宿详情
    rooms: [],         // 房型列表
    loading: true,     // 加载状态
    checkInDate: '',   // 入住日期
    checkOutDate: '',  // 离店日期
    today: '',          // 今天日期（限制picker只能选今天及之后）
    minCheckOut: '',    // 最早离店日期（入住日期+1）
    showCalendar: false // 是否显示日历
  },

  onLoad(options) {
    // 计算今天日期（格式 YYYY-MM-DD，用本地时区避免时差问题）
    const now = new Date()
    const utcOffset = now.getTimezoneOffset() * 60000
    const localDate = new Date(now.getTime() - utcOffset)
    const todayStr = localDate.toISOString().slice(0, 10)

    if (options.id) {
      this.setData({ id: options.id, today: todayStr })
      this.fetchDetail(options.id)
    }
  },

  // 获取住宿详情
  fetchDetail(id) {
    this.setData({ loading: true })

    get(`/api/accommodation/detail/${id}`)
      .then(res => {
        if (res.code === 200) {
          const detail = res.data || {}
          // 解析 JSON 字段
          if (detail.facilities && typeof detail.facilities === 'string') {
            try {
              detail.facilities = JSON.parse(detail.facilities)
            } catch (e) {
              detail.facilities = []
            }
          }
          if (detail.images && typeof detail.images === 'string') {
            try {
              detail.images = JSON.parse(detail.images)
            } catch (e) {
              detail.images = []
            }
          }
          // 修复图片路径为完整URL
          fixImageUrl(detail)
          fixImageUrl(detail.rooms || [])
          if (detail.images && Array.isArray(detail.images)) {
            detail.images = detail.images.map(url => {
              if (typeof url === 'string' && url.startsWith('/')) {
                return IMG_BASE + url
              }
              return url
            })
          }
          this.setData({
            detail,
            rooms: detail.rooms || [],
            loading: false
          })
        }
      })
      .catch(() => {
        this.setData({ loading: false })
        wx.showToast({ title: '加载失败', icon: 'none' })
      })
  },

  // 选择入住日期
  onCheckInChange(e) {
    const checkInDate = e.detail.value
    // 计算最早离店日期（入住日期+1天）
    const d = new Date(checkInDate)
    d.setDate(d.getDate() + 1)
    const minCheckOut = d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0')
    this.setData({ checkInDate, minCheckOut })
  },

  // 选择离店日期
  onCheckOutChange(e) {
    this.setData({ checkOutDate: e.detail.value })
  },

  // 跳转到下单页
  goOrder(e) {
    const roomId = e.currentTarget.dataset.roomId
    const { id, checkInDate, checkOutDate, today } = this.data

    if (!checkInDate || !checkOutDate) {
      wx.showToast({ title: '请选择入住/离店日期', icon: 'none' })
      return
    }

    // 校验入住日期不能早于今天
    if (checkInDate < today) {
      wx.showToast({ title: '入住日期不能早于今天', icon: 'none' })
      return
    }

    // 校验离店日期必须晚于入住日期
    if (checkOutDate <= checkInDate) {
      wx.showToast({ title: '离店日期必须晚于入住日期', icon: 'none' })
      return
    }

    wx.navigateTo({
      url: `/pages/order/order?accommodationId=${id}&roomId=${roomId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
    })
  },

  // 预览图片
  previewImage(e) {
    const url = e.currentTarget.dataset.url
    const urls = this.data.detail.images || [this.data.detail.coverImage]
    wx.previewImage({
      current: url,
      urls
    })
  },

  // 返回列表
  goBack() {
    wx.navigateBack()
  }
})
