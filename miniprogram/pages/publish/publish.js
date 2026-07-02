import { request, uploadFile, uploadUrl } from '../../utils/request';

Page({
  data: {
    id: null,
    title: '',
    content: '',
    images: [],
    imageUrl: '',
    topicIndex: -1,
    topics: [],
    isEdit: false,
    submitting: false,
    uploading: false,
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
      this.setData({ title: d.title, content: d.content, images: d.images || [], topicIndex });
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

  onImageUrlInput(e) { this.setData({ imageUrl: e.detail.value }); },

  chooseImage() {
    const { images } = this.data;
    const remain = 9 - images.length;
    if (remain <= 0) {
      wx.showToast({ title: '最多9张图片', icon: 'none' });
      return;
    }
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      success: (res) => {
        this.setData({ uploading: true });
        const tasks = res.tempFiles.map(f => uploadFile(f.tempFilePath));
        Promise.all(tasks).then((results) => {
          const urls = results.map(r => r.data?.files?.[0]?.url).filter(Boolean);
          this.setData({ images: [...images, ...urls] });
          wx.showToast({ title: `已上传${urls.length}张`, icon: 'success' });
        }).catch(() => {}).finally(() => {
          this.setData({ uploading: false });
        });
      },
    });
  },

  async addImageUrl() {
    const { imageUrl, images } = this.data;
    const url = imageUrl.trim();
    if (!url) return;
    if (!/^https?:\/\/.+/.test(url)) {
      wx.showToast({ title: '请输入有效的图片URL', icon: 'none' });
      return;
    }
    if (images.length >= 9) {
      wx.showToast({ title: '最多9张图片', icon: 'none' });
      return;
    }
    this.setData({ uploading: true });
    try {
      const res = await uploadUrl(url);
      const localUrl = res.data?.url;
      if (localUrl) {
        this.setData({ images: [...images, localUrl], imageUrl: '' });
        wx.showToast({ title: '已下载', icon: 'success' });
      }
    } catch { /* */ }
    this.setData({ uploading: false });
  },

  removeImage(e) {
    const idx = e.currentTarget.dataset.index;
    this.setData({ images: this.data.images.filter((_, i) => i !== idx) });
  },

  async onSubmit(e) {
    const submitReview = e.currentTarget.dataset.review === 'true';
    const { title, content, images, id, isEdit, topics, topicIndex } = this.data;
    if (!title.trim() || !content.trim()) {
      return wx.showToast({ title: '标题和正文不能为空', icon: 'none' });
    }
    this.setData({ submitting: true });
    try {
      const body = {
        title: title.trim(),
        content: content.trim(),
        images,
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
      setTimeout(() => {
        const pages = getCurrentPages();
        const prev = pages[pages.length - 2];
        if (prev && prev.route === 'pages/mine/index') {
          wx.navigateBack();
        } else {
          wx.redirectTo({ url: '/pages/mine/index' });
        }
      }, 1500);
    } catch {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
    this.setData({ submitting: false });
  },
});
