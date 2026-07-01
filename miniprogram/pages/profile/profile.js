const { getUserInfo, updateProfile, updatePassword } = require('../../utils/api');
const { uploadFile } = require('../../utils/request');
const app = getApp();

Page({
  data: {
    userInfo: null,
    userInitial: '?',
    editing: false,
    nickname: '',
    phone: '',
    showPasswordModal: false,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  },

  onLoad() {
    this.loadUserInfo();
  },

  async loadUserInfo() {
    try {
      const res = await getUserInfo();
      const userInitial = res.data?.nickname?.[0] || res.data?.username?.[0] || '?';
      this.setData({
        userInfo: res.data,
        userInitial,
        nickname: res.data.nickname || '',
        phone: res.data.phone || '',
      });
      app.globalData.userInfo = res.data;
      wx.setStorageSync('userInfo', res.data);
    } catch {}
  },

  onEdit() { this.setData({ editing: true }); },
  onCancel() {
    this.setData({
      editing: false,
      nickname: this.data.userInfo.nickname || '',
      phone: this.data.userInfo.phone || '',
    });
  },

  onNicknameInput(e) { this.setData({ nickname: e.detail.value }); },
  onPhoneInput(e) { this.setData({ phone: e.detail.value }); },

  async onSave() {
    const { nickname, phone } = this.data;
    if (phone && !/^\d{11}$/.test(phone)) {
      wx.showToast({ title: '手机号格式错误', icon: 'none' }); return;
    }
    try {
      await updateProfile({ nickname, phone });
      wx.showToast({ title: '保存成功', icon: 'success' });
      this.setData({ editing: false });
      this.loadUserInfo();
    } catch {}
  },

  async onChooseAvatar() {
    try {
      const res = await wx.chooseMedia({ count: 1, mediaType: ['image'] });
      const filePath = res.tempFiles[0].tempFilePath;
      wx.showLoading({ title: '上传中...' });
      const uploadRes = await uploadFile(filePath);
      const avatarUrl = uploadRes.data?.url || uploadRes.data;
      await updateProfile({ avatar: avatarUrl });
      wx.showToast({ title: '头像已更新', icon: 'success' });
      this.loadUserInfo();
    } catch {}
    finally { wx.hideLoading(); }
  },

  onShowPasswordModal() { this.setData({ showPasswordModal: true }); },
  onHidePasswordModal() { this.setData({ showPasswordModal: false, oldPassword: '', newPassword: '', confirmPassword: '' }); },
  onOldPasswordInput(e) { this.setData({ oldPassword: e.detail.value }); },
  onNewPasswordInput(e) { this.setData({ newPassword: e.detail.value }); },
  onConfirmPasswordInput(e) { this.setData({ confirmPassword: e.detail.value }); },

  async onChangePassword() {
    const { oldPassword, newPassword, confirmPassword } = this.data;
    if (!oldPassword || !newPassword) {
      wx.showToast({ title: '请填写完整', icon: 'none' }); return;
    }
    if (newPassword.length < 6) {
      wx.showToast({ title: '密码至少6位', icon: 'none' }); return;
    }
    if (newPassword !== confirmPassword) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' }); return;
    }
    try {
      await updatePassword({ oldPassword, newPassword });
      wx.showToast({ title: '修改成功', icon: 'success' });
      this.onHidePasswordModal();
    } catch {}
  },
});
