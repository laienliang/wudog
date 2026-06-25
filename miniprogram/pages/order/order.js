// pages/order/order.js
const { get, post } = require('../../utils/request')

Page({
  data: {
    accommodationId: '',  // 住宿ID
    roomId: '',           // 房型ID
    checkInDate: '',      // 入住日期
    checkOutDate: '',     // 离店日期
    nights: 1,            // 入住晚数
    accommodation: null,    // 住宿信息
    room: null,           // 房型信息
    guestName: '',        // 入住人姓名
    guestPhone: '',       // 入住人手机号
    remark: '',           // 备注
    totalPrice: 0,       // 总价
    loading: true,        // 加载状态
    submitting: false     // 提交状态
  },

  onLoad(options) {
    const { accommodationId, roomId, checkInDate, checkOutDate } = options
    const nights = this.calculateNights(checkInDate, checkOutDate)

    this.setData({
      accommodationId,
      roomId,
      checkInDate,
      checkOutDate,
      nights
    })
    this.fetchData(accommodationId, roomId)
  },

  // 获取数据
  fetchData(accommodationId, roomId) {
    if (!accommodationId || !roomId) {
      this.setData({ loading: false })
      wx.showToast({ title: '参数缺失，请重新选择', icon: 'none' })
      return
    }

    Promise.all([
      get(`/api/accommodation/detail/${accommodationId}`),
      get(`/api/room/detail/${roomId}`)
    ]).then(([accRes, roomRes]) => {
      const accommodation = accRes.code === 200 ? accRes.data : null
      const room = roomRes.code === 200 ? roomRes.data : null

      // 计算总价
      const totalPrice = room ? (room.price || 0) * this.data.nights : 0

      this.setData({
        accommodation,
        room,
        totalPrice,
        loading: false
      })
    }).catch((err) => {
      console.error('[order fetchData error]', err)
      this.setData({ loading: false })
      wx.showToast({ title: '数据加载失败', icon: 'none' })
    })
  },

  // 计算入住晚数
  calculateNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 1
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights : 1
  },

  // 输入入住人姓名
  onGuestNameInput(e) {
    this.setData({ guestName: e.detail.value })
  },

  // 输入入住人手机号
  onGuestPhoneInput(e) {
    this.setData({ guestPhone: e.detail.value })
  },

  // 输入备注
  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  // 提交订单
  submitOrder() {
    const { accommodationId, roomId, checkInDate, checkOutDate, guestName, guestPhone, remark, totalPrice, submitting, nights } = this.data

    // 日期校验
    const todayStr = new Date().toISOString().slice(0, 10)
    if (checkInDate < todayStr) {
      wx.showToast({ title: '入住日期不能早于今天', icon: 'none' })
      return
    }
    if (checkOutDate <= checkInDate) {
      wx.showToast({ title: '离店日期必须晚于入住日期', icon: 'none' })
      return
    }

    // 验证
    if (!guestName.trim()) {
      wx.showToast({ title: '请输入入住人姓名', icon: 'none' })
      return
    }
    if (!guestPhone.trim() || !/^1[3-9]\d{9}$/.test(guestPhone.trim())) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    if (submitting) return
    this.setData({ submitting: true })

    // 生成订单号
    const orderNo = 'WD' + Date.now() + Math.floor(Math.random() * 1000)

    // 构造订单数据
    const orderData = {
      orderNo,
      userId: 1, // 模拟用户ID，实际应从小程序登录获取
      accommodationId: parseInt(accommodationId),
      roomId: parseInt(roomId),
      checkInDate,
      checkOutDate,
      nights,
      guests: 2, // 默认2人，实际应让用户选择
      guestName,
      guestPhone,
      totalPrice,
      remark,
      status: 0 // 待支付
    }

    post('/api/order/create', orderData)
      .then(res => {
        if (res.code === 200) {
          wx.showToast({ title: '预订成功', icon: 'success' })
          setTimeout(() => {
            wx.switchTab({ url: '/pages/order-list/order-list' })
          }, 1500)
        } else {
          wx.showToast({ title: res.message || '预订失败', icon: 'none' })
          this.setData({ submitting: false })
        }
      })
      .catch((err) => {
        const msg = (err && err.message) || '网络错误'
        wx.showToast({ title: msg, icon: 'none' })
        this.setData({ submitting: false })
      })
  }
})
