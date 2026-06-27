import { request } from '../../utils/request';

Page({
  data: {
    id: null,
    title: '',
    content: '',
    topicIndex: -1,
    topics: [],
    isEdit: false,
    submitting: false,
  },

  onLoad(options) {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    if (options.id) {
      this.setData({ id: options.id, isEdit: true });
      this.fetchDetail(options.id);
    }
    this.fetchTopics();
  },

  async fetchDetail(id) {
    try {
      const res = await request(`/api/travel-note/detail/${id}`);
      const d = res.data;
      const topicIndex = this.data.topics.findIndex(t => t.id === d.topic_id);
      this.setData({ title: d.title, content: d.content, topicIndex });
    } catch { /* */ }
  },

  async fetchTopics() {
    try {
      const res = await request('/api/topic/list');
      this.setData({ topics: res.data.list || [] });
    } catch { /* */ }
  },

  onTitleInput(e) { this.setData({ title: e.detail.value }); },
  onContentInput(e) { this.setData({ content: e.detail.value }); },

  onTopicChange(e) {
    this.setData({ topicIndex: Number(e.detail.value) });
  },

  async onSubmit(submitReview = false) {
    const { title, content, id, isEdit, topics, topicIndex } = this.data;
    if (!title.trim() || !content.trim()) {
      return wx.showToast({ title: '标题和正文不能为空', icon: 'none' });
    }
    this.setData({ submitting: true });
    try {
      const body = {
        title: title.trim(),
        content: content.trim(),
        topic_id: topicIndex >= 0 ? topics[topicIndex].id : null,
      };
      let noteId = Number(id);
      if (isEdit) {
        await request(`/api/travel-note/update/${id}`, 'PUT', body);
      } else {
        const res = await request('/api/travel-note/create', 'POST', body);
        noteId = res.data.id;
      }
      if (submitReview) {
        await request(`/api/travel-note/submit-review/${noteId}`, 'POST');
        wx.showToast({ title: '已提交审核', icon: 'success' });
      } else {
        wx.showToast({ title: '已保存草稿', icon: 'success' });
      }
      setTimeout(() => wx.navigateBack(), 1500);
    } catch {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
    this.setData({ submitting: false });
  },
});
