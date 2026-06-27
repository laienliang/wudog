const { get } = require('../../utils/request');

Page({
  data: {
    homestayList: [],
    loading: false,
    isEmpty: false,
    page: 1,
    pageSize: 20,
    keyword: '',
  },

  onLoad: function () {
    this.fetchList();
  },

  fetchList: function () {
    var that = this;
    that.setData({ loading: true });

    get('/api/homestay/list', {
      page: that.data.page,
      pageSize: that.data.pageSize,
      keyword: that.data.keyword,
    }).then(function (data) {
      var list = (data && data.list) || [];
      that.setData({
        homestayList: list,
        isEmpty: list.length === 0,
        loading: false,
      });
    }).catch(function () {
      that.setData({
        homestayList: [],
        isEmpty: true,
        loading: false,
      });
    });
  },

  onPullDownRefresh: function () {
    this.setData({ page: 1, homestayList: [] });
    this.fetchList();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    var that = this;
    that.setData({ page: that.data.page + 1 });
    var page = that.data.page;
    var pageSize = that.data.pageSize;

    get('/api/homestay/list', {
      page: page,
      pageSize: pageSize,
    }).then(function (data) {
      var newList = (data && data.list) || [];
      that.setData({
        homestayList: that.data.homestayList.concat(newList),
        isEmpty: that.data.homestayList.length === 0,
      });
    });
  },
});
