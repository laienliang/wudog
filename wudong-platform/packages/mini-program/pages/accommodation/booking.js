var BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: {
    homestay: {}, roomType: null,
    checkIn: '', checkOut: '',
    name: '', phone: '', remark: '',
    nights: 0, totalAmount: 0,
    submitting: false, showSuccess: false, orderNo: '',
  },

  onLoad(options) {
    if (options.id) this.loadData(options.id, options.roomTypeId);
  },

  async loadData(id, roomTypeId) {
    try {
      var res = await new Promise(function(r) { wx.request({ url: BASE + '/homestays/' + id, success: r }); });
      var data = res.data && res.data.data ? res.data.data : res.data;
      var rt = null;
      if (data.roomTypes) {
        for (var i = 0; i < data.roomTypes.length; i++) {
          if (String(data.roomTypes[i].id) === String(roomTypeId)) { rt = data.roomTypes[i]; break; }
        }
      }
      this.setData({ homestay: data, roomType: rt });
      this.calcTotal();
    } catch (e) { console.error(e); wx.showToast({ title: '加载失败', icon: 'none' }); }
  },

  // ===== 日期选择 =====
  onCheckInChange(e) {
    var val = e.detail.value;
    this.setData({ checkIn: val, checkOut: '' }, this.calcTotal);
  },

  onCheckOutChange(e) {
    var val = e.detail.value;
    if (val <= this.data.checkIn) {
      wx.showToast({ title: '离店日期须晚于入住日期', icon: 'none' });
      return;
    }
    this.setData({ checkOut: val }, this.calcTotal);
  },

  // ===== 表单输入 =====
  onNameInput(e) { this.setData({ name: e.detail.value }); },
  onPhoneInput(e) { this.setData({ phone: e.detail.value }); },
  onRemarkInput(e) { this.setData({ remark: e.detail.value }); },

  // ===== 价格计算 =====
  calcTotal() {
    var checkIn = this.data.checkIn;
    var checkOut = this.data.checkOut;
    var rt = this.data.roomType;
    if (!checkIn || !checkOut || !rt) {
      this.setData({ nights: 0, totalAmount: 0 });
      return;
    }
    var d1 = new Date(checkIn), d2 = new Date(checkOut);
    var nights = Math.max(0, Math.ceil((d2.getTime() - d1.getTime()) / 86400000));
    var price = Number(rt.price || 0);
    this.setData({ nights: nights, totalAmount: (nights * price).toFixed(2) });
  },

  // ===== 提交订单 =====
  submitOrder() {
    var name = this.data.name, phone = this.data.phone;
    if (!name) { wx.showToast({ title: '请输入姓名', icon: 'none' }); return; }
    if (!phone || !/^1\d{10}$/.test(phone)) { wx.showToast({ title: '请输入正确手机号', icon: 'none' }); return; }
    if (!this.data.checkIn || !this.data.checkOut) { wx.showToast({ title: '请选择日期', icon: 'none' }); return; }
    if (this.data.nights <= 0) { wx.showToast({ title: '请选择有效日期', icon: 'none' }); return; }

    this.setData({ submitting: true });
    var that = this;
    var rt = this.data.roomType;
    var img = (rt.images && rt.images[0]) || this.data.homestay.coverImage || '';

    wx.request({
      url: BASE + '/orders', method: 'POST',
      data: {
        orderType: 'accommodation', merchantId: 1,
        items: [{
          productType: 'room_type', productId: rt.id, productName: rt.name,
          productImage: img, unitPrice: Number(rt.price), quantity: that.data.nights,
        }],
        remark: that.data.homestay.name + ' ' + rt.name + ' 入住' + that.data.checkIn + ' 离店' + that.data.checkOut + ' 联系人' + name + ' ' + phone,
      },
      success: function(res) {
        if (res.statusCode === 200) {
          var orderData = res.data && res.data.data ? res.data.data : res.data;
          var orderNo = orderData.orderNo || (orderData.data && orderData.data.orderNo) || '-';
          that.setData({ showSuccess: true, orderNo: orderNo, submitting: false });
        } else {
          wx.showToast({ title: '提交失败', icon: 'none' });
          that.setData({ submitting: false });
        }
      },
      fail: function() {
        wx.showToast({ title: '网络错误', icon: 'none' });
        that.setData({ submitting: false });
      },
    });
  },

  goBack() { wx.navigateBack(); },
});
