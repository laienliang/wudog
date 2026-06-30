var BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { homestay: {}, roomTypes: [], showPopup: false, selectedRoom: {}, amenities: [], reviews: [] },

  onLoad(options) {
    if (options.id) this.loadData(options.id);
  },

  async loadData(id) {
    try {
      var res = await new Promise(function(r) { wx.request({ url: BASE + '/homestays/' + id, success: r }); });
      var data = res.data && res.data.data ? res.data.data : res.data;
      this.setData({ homestay: data, roomTypes: data.roomTypes || [] });

      // 加载评价
      this.loadReviews();
    } catch (e) { console.error(e); wx.showToast({ title: '加载失败', icon: 'none' }); }
  },

  async loadReviews() {
    try {
      var res = await new Promise(function(r) { wx.request({ url: BASE + '/accommodation-reviews?page=1&pageSize=5', success: r }); });
      var list = (res.data && res.data.data && res.data.data.list) || [];
      this.setData({ reviews: list.slice(0, 3) });
    } catch (e) { console.error(e); }
  },

  reviewUserAvatar: function(item) {
    var name = item.user_name || '匿';
    return name.charAt(0);
  },

  showRoomDetail(e) {
    var id = e.currentTarget.dataset.id;
    var room = this.data.roomTypes.find(function(r) { return String(r.id) === String(id); });
    if (room) {
      var amenities = [
        { icon: '🛌', label: '床品', desc: '高品质棉织品' },
        { icon: '🚿', label: '洗浴', desc: '品牌洗护、24h热水' },
        { icon: '❄️', label: '电器', desc: '空调、平板电视' },
        { icon: '🧴', label: '用品', desc: '牙刷、拖鞋、矿泉水' },
        { icon: '🔊', label: '隔音', desc: '双层玻璃' },
        { icon: '🧹', label: '清洁', desc: '每日清洁服务' },
        { icon: '🔒', label: '安全', desc: '电子门锁' },
        { icon: '☕', label: '餐饮', desc: '含双早' },
      ];
      this.setData({ showPopup: true, selectedRoom: room, amenities: amenities });
    }
  },

  closePopup() { this.setData({ showPopup: false, selectedRoom: {}, amenities: [] }); },
  stopPropagation() {},

  goToBooking(e) {
    var id = this.data.homestay.id;
    var roomTypeId = e.currentTarget.dataset.id;
    this.setData({ showPopup: false });
    wx.navigateTo({ url: '/pages/accommodation/booking?id=' + id + '&roomTypeId=' + roomTypeId });
  },

  goBack() { wx.navigateBack(); },
});
