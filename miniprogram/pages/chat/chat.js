const { sendChatMessage, getChatConversation } = require('../../utils/api');
const app = getApp();

Page({
  data: {
    messages: [],
    input: '',
    sending: false,
    adminId: 1,
    pollTimer: null,
  },

  onLoad() {
    this.loadMessages();
    this.startPolling();
  },

  onUnload() {
    this.stopPolling();
  },

  startPolling() {
    this.data.pollTimer = setInterval(() => this.loadMessages(), 3000);
  },

  stopPolling() {
    if (this.data.pollTimer) {
      clearInterval(this.data.pollTimer);
      this.data.pollTimer = null;
    }
  },

  async loadMessages() {
    try {
      const res = await getChatConversation(this.data.adminId);
      this.setData({ messages: res.data?.list || [] });
    } catch {}
  },

  onInput(e) { this.setData({ input: e.detail.value }); },

  async onSend() {
    const { input, sending, adminId } = this.data;
    if (!input.trim() || sending) return;
    this.setData({ sending: true });
    try {
      await sendChatMessage({
        receiver_type: 'admin',
        receiver_id: adminId,
        content: input.trim(),
      });
      this.setData({ input: '' });
      await this.loadMessages();
    } catch {
      wx.showToast({ title: '发送失败', icon: 'none' });
    }
    finally { this.setData({ sending: false }); }
  },
});
