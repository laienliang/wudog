import api from './api';

/* ============================================================
   管理后台 API 服务
   ============================================================ */
export const adminApi = {
  // 认证
  login(username: string, password: string) {
    return api.post('/admin/auth/login', { username, password }).then(res => res.data);
  },
  refresh(refreshToken: string) {
    return api.post('/admin/auth/refresh', { refreshToken }).then(res => res.data);
  },

  // 仪表盘
  getDashboard() {
    return api.get('/admin/dashboard').then(res => res.data);
  },

  // 用户管理
  listUsers(params?: any) {
    return api.get('/admin/users', { params }).then(res => res.data);
  },
  getUserDetail(id: number) {
    return api.get(`/admin/users/${id}`).then(res => res.data);
  },
  toggleUserStatus(id: number, status: number) {
    return api.put(`/admin/users/${id}/status`, { status }).then(res => res.data);
  },
  updateUser(id: number, data: any) {
    return api.put(`/admin/users/${id}`, data).then(res => res.data);
  },

  // 商家管理
  listMerchants(params?: any) {
    return api.get('/admin/merchants', { params }).then(res => res.data);
  },
  listMerchantApplications(params?: any) {
    return api.get('/admin/merchant-applications', { params }).then(res => res.data);
  },
  reviewMerchantApplication(id: number, data: any) {
    return api.post(`/admin/merchant-applications/${id}/review`, data).then(res => res.data);
  },
  updateMerchantStatus(id: number, status: number) {
    return api.put(`/admin/merchants/${id}/status`, { status }).then(res => res.data);
  },
  forceLogoutMerchant(id: number) {
    return api.post(`/admin/merchants/${id}/force-logout`).then(res => res.data);
  },

  // 角色管理
  listRoles() {
    return api.get('/admin/roles').then(res => res.data);
  },
  createRole(data: any) {
    return api.post('/admin/roles', data).then(res => res.data);
  },
  updateRole(id: number, data: any) {
    return api.put(`/admin/roles/${id}`, data).then(res => res.data);
  },
  deleteRole(id: number) {
    return api.delete(`/admin/roles/${id}`).then(res => res.data);
  },

  // 轮播图管理
  listBanners() {
    return api.get('/admin/banners').then(res => res.data);
  },
  createBanner(data: any) {
    return api.post('/admin/banners', data).then(res => res.data);
  },
  updateBanner(id: number, data: any) {
    return api.put(`/admin/banners/${id}`, data).then(res => res.data);
  },
  deleteBanner(id: number) {
    return api.delete(`/admin/banners/${id}`).then(res => res.data);
  },

  // 公告管理
  listAnnouncements(params?: any) {
    return api.get('/admin/announcements', { params }).then(res => res.data);
  },
  createAnnouncement(data: any) {
    return api.post('/admin/announcements', data).then(res => res.data);
  },
  updateAnnouncement(id: number, data: any) {
    return api.put(`/admin/announcements/${id}`, data).then(res => res.data);
  },
  deleteAnnouncement(id: number) {
    return api.delete(`/admin/announcements/${id}`).then(res => res.data);
  },

  // 推荐位管理
  listRecommendations() {
    return api.get('/admin/recommendations').then(res => res.data);
  },
  createRecommendation(data: any) {
    return api.post('/admin/recommendations', data).then(res => res.data);
  },
  updateRecommendation(id: number, data: any) {
    return api.put(`/admin/recommendations/${id}`, data).then(res => res.data);
  },
  deleteRecommendation(id: number) {
    return api.delete(`/admin/recommendations/${id}`).then(res => res.data);
  },

  // 系统消息
  listMessages(params?: any) {
    return api.get('/admin/messages', { params }).then(res => res.data);
  },
  sendMessage(data: any) {
    return api.post('/admin/messages', data).then(res => res.data);
  },

  // 财务管理
  listFinance(params?: any) {
    return api.get('/admin/finance', { params }).then(res => res.data);
  },

  // 系统配置
  getConfig(key?: string) {
    return api.get('/admin/config', { params: { key } }).then(res => res.data);
  },
  setConfig(key: string, value: string) {
    return api.put(`/admin/config/${key}`, { value }).then(res => res.data);
  },

  // 敏感词管理
  listSensitiveWords() {
    return api.get('/admin/sensitive-words').then(res => res.data);
  },
  createSensitiveWord(data: any) {
    return api.post('/admin/sensitive-words', data).then(res => res.data);
  },
  deleteSensitiveWord(id: number) {
    return api.delete(`/admin/sensitive-words/${id}`).then(res => res.data);
  },

  // 操作日志
  listOperationLogs(params?: any) {
    return api.get('/admin/operation-logs', { params }).then(res => res.data);
  },

  // 活动横幅
  listActivityBanners() {
    return api.get('/admin/activity-banners').then(res => res.data);
  },
  createActivityBanner(data: any) {
    return api.post('/admin/activity-banners', data).then(res => res.data);
  },
  updateActivityBanner(id: number, data: any) {
    return api.put(`/admin/activity-banners/${id}`, data).then(res => res.data);
  },
  deleteActivityBanner(id: number) {
    return api.delete(`/admin/activity-banners/${id}`).then(res => res.data);
  },

  // 消息模板
  listMessageTemplates(params?: any) {
    return api.get('/admin/message-templates', { params }).then(res => res.data);
  },
  createMessageTemplate(data: any) {
    return api.post('/admin/message-templates', data).then(res => res.data);
  },
  updateMessageTemplate(id: number, data: any) {
    return api.put(`/admin/message-templates/${id}`, data).then(res => res.data);
  },
  deleteMessageTemplate(id: number) {
    return api.delete(`/admin/message-templates/${id}`).then(res => res.data);
  },
};
