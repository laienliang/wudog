var request = require('../../utils/request');
var get = request.get;

function toStars(rating) {
  var count = Math.floor(rating || 5);
  var s = '';
  for (var i = 0; i < count; i++) { s += '★'; }
  return s;
}

Page({
  data: {
    id: null,
    detail: null,
    starsText: '',
    rooms: [],
    reviews: [],
    loading: true,
  },

  onLoad: function (options) {
    this.setData({ id: Number(options.id) });
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
        }

        var styleTags = detail.styleTags
          ? detail.styleTags.split(',').map(function (s) { return s.trim(); })
          : [];
        detail.styleTags = styleTags;

        var images = detail.images || [];
        if (!images.length && detail.coverImage) {
          images = [detail.coverImage];
        }
        detail.images = images;

        that.setData({
          detail: detail,
          starsText: toStars(detail.rating),
          rooms: rooms,
          reviews: reviews,
          loading: false,
        });
      })
      .catch(function () {
        that.setData({ loading: false, detail: null });
      });
  },

  onBook: function (e) {
    var roomId = e.currentTarget.dataset.id;
    var roomName = e.currentTarget.dataset.name;
    var price = e.currentTarget.dataset.price;
    var homestayId = this.data.id;
    wx.navigateTo({
      url: '/pages/booking/submit/submit?roomId=' + roomId + '&homestayId=' + homestayId + '&roomName=' + encodeURIComponent(roomName) + '&price=' + price,
    });
  },
});
