const { getMyReviews } = require('../../utils/api');

Page({
  data: {
    reviews: [],
    loading: false,
  },

  onLoad() { this.loadReviews(); },

  async loadReviews() {
    this.setData({ loading: true });
    try {
      const res = await getMyReviews();
      const reviews = (res.data || []).map(r => ({
        ...r,
        ratingText: '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating),
      }));
      this.setData({ reviews });
    } catch {}
    finally { this.setData({ loading: false }); }
  },
});
