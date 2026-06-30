var BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: {
    itemType: 'scenic', data: {}, ticketTypes: [], itinerary: [],
    qtys: {}, people: 1, totalAmount: '0.00', totalCount: 0, minPrice: '--',
  },

  onLoad(options) {
    if (options.id && options.type) {
      this.setData({ itemType: options.type });
      this.loadData(options.id, options.type);
    }
  },

  async loadData(id, type) {
    try {
      var url = type === 'scenic' ? '/scenic-spots/' + id : '/routes/' + id;
      var res = await new Promise(r => wx.request({ url: BASE + url, success: r }));
      var d = (res.data && res.data.data) ? res.data.data : res.data;

      if (type === 'scenic') {
        var tickets = d.ticketTypes || [];
        var prices = tickets.map(function(t) { return Number(t.price); });
        var minP = prices.length > 0 ? Math.min.apply(null, prices) : 0;
        this.setData({ data: d, ticketTypes: tickets, minPrice: minP.toFixed(2) });
      } else {
        var itin = [];
        if (d.itinerary) {
          if (Array.isArray(d.itinerary)) itin = d.itinerary;
          else try { itin = JSON.parse(d.itinerary); } catch(e) {}
        }
        this.setData({ data: d, itinerary: itin, minPrice: Number(d.price).toFixed(2) });
      }
    } catch (e) { console.error(e); wx.showToast({ title: '加载失败', icon: 'none' }); }
  },

  updateQty(e) {
    var id = e.currentTarget.dataset.id;
    var delta = parseInt(e.currentTarget.dataset.delta);
    var q = this.data.qtys;
    var cur = q[id] || 0;
    var next = Math.max(0, cur + delta);
    q[id] = next;
    this.setData({ qtys: q }, this.calcTotal);
  },

  changePeople(e) {
    var delta = parseInt(e.currentTarget.dataset.delta);
    var cur = this.data.people;
    var max = this.data.data.maxPeople || 99;
    var next = Math.max(1, Math.min(max, cur + delta));
    this.setData({ people: next }, this.calcTotal);
  },

  calcTotal() {
    var type = this.data.itemType;
    if (type === 'route') {
      var p = this.data.people;
      var price = Number(this.data.data.price || 0);
      this.setData({ totalAmount: (p * price).toFixed(2), totalCount: p });
      return;
    }
    var tickets = this.data.ticketTypes;
    var q = this.data.qtys;
    var total = 0, count = 0;
    for (var i = 0; i < tickets.length; i++) {
      var t = tickets[i];
      var n = q[t.id] || 0;
      total += n * Number(t.price);
      count += n;
    }
    this.setData({ totalAmount: total.toFixed(2), totalCount: count });
  },

  submitOrder() {
    var type = this.data.itemType;
    var d = this.data.data;
    var total = Number(this.data.totalAmount);

    if (type === 'scenic' && this.data.totalCount === 0) {
      wx.showToast({ title: '请选择票种数量', icon: 'none' });
      return;
    }
    if (total <= 0) { wx.showToast({ title: '请选择数量', icon: 'none' }); return; }

    var items = [];
    if (type === 'scenic') {
      var tickets = this.data.ticketTypes;
      var q = this.data.qtys;
      for (var i = 0; i < tickets.length; i++) {
        var t = tickets[i];
        var n = q[t.id] || 0;
        if (n > 0) items.push({ productType: 'ticket', productId: t.id, productName: t.name, productImage: d.coverImage || '', unitPrice: Number(t.price), quantity: n });
      }
    } else {
      items.push({ productType: 'route', productId: d.id, productName: d.name, productImage: d.coverImage || '', unitPrice: Number(d.price), quantity: this.data.people });
    }

    var that = this;
    wx.request({
      url: BASE + '/orders', method: 'POST',
      data: { orderType: 'travel', merchantId: 1, items: items, remark: d.name + ' 预订' },
      success: function(res) {
        if (res.statusCode === 200) {
          wx.showToast({ title: '预订成功！', icon: 'success' });
          setTimeout(function() { wx.navigateBack(); }, 1500);
        } else { wx.showToast({ title: '预订失败', icon: 'none' }); }
      },
      fail: function() { wx.showToast({ title: '网络错误', icon: 'none' }); },
    });
  },
});
