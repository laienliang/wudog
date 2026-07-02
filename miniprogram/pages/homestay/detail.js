var request = require('../../utils/request');
var get = request.get;

function toStars(rating) {
  var count = Math.floor(rating || 5);
  var s = '';
  for (var i = 0; i < count; i++) { s += '★'; }
  return s;
}

function fmtDate(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

Page({
  data: {
    id: null,
    detail: null,
    starsText: '',
    rooms: [],
    reviews: [],
    loading: true,
    checkIn: '',
    checkOut: '',
  },

  onLoad: function (options) {
    this.setData({
      id: Number(options.id),
      checkIn: options.checkIn || '',
      checkOut: options.checkOut || '',
    });
    this.loadDetail();
  },

  loadDetail: function () {
    var that = this;
    that.setData({ loading: true });

    get('/api/homestay/detail/' + that.data.id)
      .then(function (data) {
        var detail = data;
        var rooms = detail.rooms || [];
        var reviews = detail.reviews || [];

        for (var i = 0; i < reviews.length; i++) {
          reviews[i].starsText = toStars(reviews[i].rating);
          reviews[i].showDate = fmtDate(reviews[i].created_at);
        }

        var styleTags = detail.h_facility_tags
          ? detail.h_facility_tags.split(',').map(function (s) { return s.trim(); })
          : [];
        detail.styleTags = styleTags;

        var images = detail.images || [];
        if (!images.length && detail.cover_image) {
          images = [detail.cover_image];
        }
        detail.images = images;

        that.setData({
          detail: detail,
          starsText: toStars(detail.rating),
          rooms: rooms,
          reviews: reviews,
          loading: false,
        });

        // 若已选择日期，检查每个房型的库存
        var checkIn = that.data.checkIn;
        var checkOut = that.data.checkOut;
        if (checkIn && checkOut && rooms.length > 0) {
          that.checkAvailability(rooms, checkIn, checkOut);
        }
      })
      .catch(function () {
        that.setData({ loading: false, detail: null });
      });
  },

  /** 调用日历接口检查指定日期范围内房型是否有库存 */
  checkAvailability: function (rooms, checkIn, checkOut) {
    var that = this;
    var promises = rooms.map(function (room) {
      return get('/api/lodging/calendar/' + room.id, {
        startDate: checkIn,
        endDate: checkOut,
      })
        .then(function (calendarData) {
          var days = calendarData.list || calendarData || [];
          if (!Array.isArray(days)) days = [];
          var available = true;
          for (var i = 0; i < days.length; i++) {
            var stock = days[i].stock != null ? days[i].stock : days[i].available_count;
            if (stock != null && stock <= 0) {
              available = false;
              break;
            }
          }
          return { roomId: room.id, available: available };
        })
        .catch(function () {
          // 接口失败时默认视为可订，避免误伤
          return { roomId: room.id, available: true };
        });
    });

    Promise.all(promises).then(function (results) {
      var availability = {};
      results.forEach(function (r) {
        availability[r.roomId] = r.available;
      });
      var updatedRooms = that.data.rooms.map(function (room) {
        return Object.assign({}, room, { available: availability[room.id] !== false });
      });
      that.setData({ rooms: updatedRooms });
    });
  },

  onBook: function (e) {
    var roomId = e.currentTarget.dataset.id;
    // 检查该房型是否已标记为不可订
    var rooms = this.data.rooms;
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i].id === roomId && rooms[i].available === false) {
        wx.showToast({ title: '该日期该房型已售罄', icon: 'none' });
        return;
      }
    }
    var roomName = e.currentTarget.dataset.name;
    var price = e.currentTarget.dataset.price;
    var homestayId = this.data.id;
    var checkIn = this.data.checkIn || '';
    var checkOut = this.data.checkOut || '';
    wx.navigateTo({
      url: '/pages/order/create?roomId=' + roomId + '&homestayId=' + homestayId + '&roomName=' + encodeURIComponent(roomName || '') + '&price=' + (price || 0) + '&checkIn=' + checkIn + '&checkOut=' + checkOut,
    });
  },
});
