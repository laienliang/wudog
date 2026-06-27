/* ============================================================
   民宿卡片组件 — 星级计算在 JS 中，wxml 只渲染结果
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\components\homestay-card\homestay-card.js
   ============================================================ */

/** 评分 → 星星字符串 */
function toStars(rating) {
  var count = Math.floor(rating || 5);
  var s = '';
  for (var i = 0; i < count; i++) { s += '★'; }
  return s;
}

Component({
  properties: {
    item: { type: Object, value: {} },
    type: { type: String, value: 'waterfall' },
  },

  data: {
    stars: '',
    ratingText: '',
  },

  observers: {
    'item': function (item) {
      if (!item) return;
      var rating = item.rating;
      this.setData({
        stars: toStars(rating),
        ratingText: (rating || 5) + '分',
      });
    },
  },

  methods: {
    onTap(e) {
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({ url: '/pages/homestay/detail?id=' + id });
    },
  },
});
