import { get, post, put, del, patch } from '../utils/request';

export interface PaginatedResult<T> { total: number; page: number; pageSize: number; list: T[]; }

// ======= 民宿 =======
export function getHomestays(params?: any) { return get<PaginatedResult<any>>('/api/homestay/list', params); }
export function createHomestay(data: any) { return post('/api/homestay/create', data); }
export function updateHomestay(id: number, data: any) { return put(`/api/homestay/update/${id}`, data); }
export function deleteHomestay(id: number) { return del(`/api/homestay/delete/${id}`); }

// ======= 房型 =======
export function getRooms(params?: any) { return get<PaginatedResult<any>>('/api/lodging/admin/rooms', params); }
export function createRoom(data: any) { return post('/api/lodging/admin/rooms', data); }
export function updateRoom(id: number, data: any) { return put(`/api/lodging/admin/rooms/${id}`, data); }
export function deleteRoom(id: number) { return del(`/api/lodging/admin/rooms/${id}`); }

// ======= 房态日历 =======
export function getAdminCalendar(params?: any) { return get<PaginatedResult<any>>('/api/lodging/admin/calendar', params); }
export function batchEditCalendar(data: { roomId: number; startDate: string; endDate: string; availableStock?: number; price?: number; status?: number }) {
  return put('/api/lodging/room-calendar/batch-edit', data);
}
export function singleEditCalendar(data: { roomId: number; date: string; availableStock?: number; price?: number; status?: number }) {
  return patch('/api/lodging/admin/calendar/single', data);
}

// ======= 订单 =======
export function getAdminOrders(params?: any) { return get<PaginatedResult<any>>('/api/lodging/admin/orders', params); }
export function updateOrderStatus(id: number, status: string) { return put(`/api/lodging/admin/orders/${id}/status`, { status }); }
export function verifyCheckIn(code: string) { return post('/api/lodging/admin/orders/verify', { code }); }
export function deleteOrder(id: number) { return del(`/api/lodging/admin/orders/${id}`); }

// ======= 评价 =======
export function getAdminReviews(params?: any) { return get<PaginatedResult<any>>('/api/lodging/admin/reviews', params); }
export function replyReview(id: number, owner_reply: string) { return post(`/api/lodging/admin/reviews/${id}/reply`, { owner_reply }); }
export function toggleReviewStatus(id: number, status: number) { return put(`/api/lodging/admin/reviews/${id}/status`, { status }); }
export function deleteReview(id: number) { return del(`/api/lodging/admin/reviews/${id}`); }

// ======= 入住须知 =======
export function getAdminHouseRules(params?: any) { return get<PaginatedResult<any>>('/api/lodging/admin/house-rules', params); }
export function saveHouseRule(data: any) { return post('/api/lodging/admin/house-rules', data); }
export function updateHouseRule(id: number, data: any) { return put(`/api/lodging/admin/house-rules/${id}`, data); }
export function deleteHouseRule(id: number) { return del(`/api/lodging/admin/house-rules/${id}`); }
