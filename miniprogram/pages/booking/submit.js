var request = require('../../utils/request');
var get = request.get;
var post = request.post;

function todayStr() {
  var d = new Date();
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

function daysFromNow(n) {
  var d = new Date();
  d.setDate(d.getDate() + n);
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

function diffDays(d1, d2) {
  var a = new Date(d1).getTime();
  var b = new Date(d2).getTime();
  return Math.ceil((b - a) / (1000 * 60 * 60 * 24));
}

Page({
  data: {
    roomId: null,
    homestayId: null,
    roomName: '',
    price: 0,
    checkinDate: '',
    checkoutDate: '',
    nights: 0,
    totalPrice: 0,
    contactName: '',
    contactPhone: '',
    roomCount: '1',
    guestCount: '1',
    canSubmit: false,
    submitting: false,
    result: null,
    today: todayStr(),
    maxDate: daysFromNow(90),
  },

  onLoad: function (options) {
    this.setData({
      roomId: Number(options.roomId),
      homestayId: Number(options.homestayId),
      roomName: decodeURIComponent(options.roomName || ''),
      price: Number(options.price || 0),
    });
  },

  calcTotal: function () {
    var nights = this.data.nights;
    var roomCount = parseInt(this.data.roomCount) || 1;
    var price = this.data.price;
    var totalPrice = price * roomCount * nights;
    var canSubmit = nights > 0 && this.data.contactName.length > 0 && this.data.contactPhone.length > 0;
    this.setData({ totalPrice: totalPrice, canSubmit: canSubmit });
  },

  onCheckinChange: function (e) {
    var cin = e.detail.value;
    this.setData({ checkinDate: cin });
    if (this.data.checkoutDate) {
      var n = diffDays(cin, this.data.checkoutDate);
      this.setData({ nights: n > 0 ? n : 0 });
    }
    this.calcTotal();
  },

  onCheckoutChange: function (e) {
    var cout = e.detail.value;
    this.setData({ checkoutDate: cout });
    if (this.data.checkinDate) {
      var n = diffDays(this.data.checkinDate, cout);
      this.setData({ nights: n > 0 ? n : 0 });
    }
    this.calcTotal();
  },

  onContactName: function (e) {
    this.setData({ contactName: e.detail.value });
    this.calcTotal();
  },

  onContactPhone: function (e) {
    this.setData({ contactPhone: e.detail.value });
    this.calcTotal();
  },

  onRoomCount: function (e) {
    this.setData({ roomCount: e.detail.value });
    this.calcTotal();
  },

  onGuestCount: function (e) {
    this.setData({ guestCount: e.detail.value });
  },

  onSubmit: function () {
    var that = this;
    if (!that.data.canSubmit || that.data.submitting) return;
    that.setData({ submitting: true });

    post('/api/lodging/orders', {
      homestayId: that.data.homestayId,
      roomId: that.data.roomId,
      checkinDate: that.data.checkinDate,
      checkoutDate: that.data.checkoutDate,
      nights: that.data.nights,
      roomCount: parseInt(that.data.roomCount) || 1,
      contactName: that.data.contactName,
      contactPhone: that.data.contactPhone,
      guestCount: parseInt(that.data.guestCount) || 1,
      totalPrice: that.data.totalPrice,
    }).then(function (data) {
      that.setData({ result: data, submitting: false });
    }).catch(function () {
      that.setData({ submitting: false });
    });
  },
});
