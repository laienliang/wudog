import { request } from '../../utils/request';

Page({
  data: {
    list: [],
    loading: true,
  },

  onLoad() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    this.fetchMessages();
  },

  async fetchMessages() {
    this.setData({ loading: true });
    try {
      // 获取互动数据：评论、点赞、关注
      const [commentRes, likeRes, followRes] = await Promise.all([
        request('/api/comment/list', 'GET', { page: 1, pageSize: 20 }),
        request('/api/like/list', 'GET', { page: 1, pageSize: 20 }),
        request('/api/follow/list', 'GET', { type: 'follower', page: 1, pageSize: 20 }),
      ]);

      const messages = [];
      (commentRes.data.list || []).forEach(c => {
        messages.push({
          type: 'comment',
          text: `用户${c.user_id} 评论了你的游记`,
          time: c.created_at,
          noteId: c.note_id,
        });
      });
      (likeRes.data.list || []).forEach(l => {
        messages.push({
          type: 'like',
          text: `用户${l.user_id} 赞了你的${l.target_type === 'note' ? '游记' : '评论'}`,
          time: l.created_at,
          noteId: l.target_type === 'note' ? l.target_id : null,
        });
      });
      (followRes.data.list || []).forEach(f => {
        messages.push({
          type: 'follow',
          text: `用户${f.follower_id} 关注了你`,
          time: f.created_at,
        });
      });

      messages.sort((a, b) => new Date(b.time) - new Date(a.time));
      this.setData({ list: messages });
    } catch { /* */ } finally {
      this.setData({ loading: false });
    }
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    if (id) wx.navigateTo({ url: `/pages/community-detail/community-detail?id=${id}` });
  },
});
