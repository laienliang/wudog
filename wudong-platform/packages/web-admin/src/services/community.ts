import api from './api';

export const communityApi = {
  listTravelogues(params?: any) { return api.get('/travelogues', { params }).then(r => r.data); },
  getTravelogue(id: number) { return api.get(`/travelogues/${id}`).then(r => r.data); },
  updateTravelogue(id: number, data: any) { return api.put(`/travelogues/${id}`, data).then(r => r.data); },
  updateStatus(id: number, status: number) { return api.put(`/travelogues/${id}/status`, { status }).then(r => r.data); },
  deleteTravelogue(id: number) { return api.delete(`/travelogues/${id}`).then(r => r.data); },

  listComments(params?: any) { return api.get('/comments', { params }).then(r => r.data); },
  deleteComment(id: number) { return api.delete(`/comments/${id}`).then(r => r.data); },
  replyComment(id: number, content: string) { return api.post(`/comments/${id}/reply`, { content }).then(r => r.data); },

  listTopics() { return api.get('/topics').then(r => r.data); },
  createTopic(data: any) { return api.post('/topics', data).then(r => r.data); },
  updateTopic(id: number, data: any) { return api.put(`/topics/${id}`, data).then(r => r.data); },
  deleteTopic(id: number) { return api.delete(`/topics/${id}`).then(r => r.data); },

  listReports(params?: any) { return api.get('/reports', { params }).then(r => r.data); },
  updateReportStatus(id: number, status: number) { return api.put(`/reports/${id}/status`, { status }).then(r => r.data); },

  getStats() { return api.get('/community/stats').then(r => r.data); },
};
