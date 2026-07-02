/* ============================================================
   API 接口层 — 民宿预订所有接口
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\api\lodging.ts
   ============================================================ */
import { get, post, put, del } from '../utils/request';

// ============== 民宿 ==============
export interface Homestay {
  id: number; name: string; address: string; cover_image: string;
  images: string[]; description: string; facilities: string;
  min_price: number; rating: number; review_count: number;
  latitude: number; longitude: number; contact_phone: string;
}

export interface PaginatedResult<T> {
  total: number; page: number; pageSize: number; list: T[];
}

export function getHomestays(params: {
  page?: number; pageSize?: number; keyword?: string; sort?: string;
}) {
  return get<PaginatedResult<Homestay>>('/api/homestay/list', params);
}

export function getHomestayDetail(id: number) {
  return get<Homestay & { rooms: Room[]; house_rules: HouseRule[] }>(`/api/homestay/detail/${id}`);
}

export function searchHomestays(params: {
  checkInDate: string; checkOutDate: string;
  minPrice?: number; maxPrice?: number;
  facilities?: string[]; page?: number; pageSize?: number;
}) {
  return get<PaginatedResult<Homestay>>('/api/homestay/search', params);
}

// ============== 房型 ==============
export interface Room {
  id: number; homestay_id: number; name: string; bed_type: string;
  area: number; max_guests: number; base_price: number;
  images: string[]; facilities: string[]; description: string;
  default_stock: number;
}

export function getRooms(homestayId: number) {
  return get<PaginatedResult<Room>>('/api/lodging/rooms', { homestay_id: homestayId });
}

// ============== 房态 ==============
export interface CalendarDay {
  id: number; room_id: number; bookingDate: string;
  available_stock: number; bookedStock: number; price: number; status: number;
}

export function getCalendar(roomId: number, startDate: string, endDate: string) {
  return get<CalendarDay[]>(`/api/lodging/calendar/${roomId}`, { startDate, endDate });
}

// ============== 订单 ==============
export function createOrder(data: {
  homestay_id: number; room_id: number;
  check_in_date: string; check_out_date: string;
  room_count: number; contact_name: string; contact_phone: string; guest_count: number;
}) {
  return post<{ id: number; order_no: string; total_price: number; check_in_code: string }>('/api/lodging/orders', data);
}

export function getOrders(params: { page?: number; pageSize?: number; status?: string }) {
  return get<PaginatedResult<any>>('/api/lodging/orders', params);
}

export function getOrderDetail(id: number) {
  return get<any>(`/api/lodging/orders/${id}`);
}

export function cancelOrder(orderId: number, reason?: string) {
  return post('/api/lodging/order/cancel', { orderId, reason });
}

export function getCheckInCode(orderId: number) {
  return get<{ checkInCode: string }>(`/api/lodging/order/check-in-code/${orderId}`);
}

// ============== 评价 ==============
export function getReviews(params: { homestay_id?: number; page?: number; pageSize?: number }) {
  return get<PaginatedResult<any>>('/api/lodging/reviews', params);
}

export function postReview(data: { order_id: number; homestay_id: number; rating: number; content?: string; images?: string[] }) {
  return post('/api/lodging/reviews', data);
}

// ============== 收藏 ==============
export function getFavorites(params: { page?: number; pageSize?: number }) {
  return get<PaginatedResult<Homestay>>('/api/favorites/list', params);
}

export function toggleFavorite(homestayId: number) {
  return post<{ isFavorited: boolean }>('/api/favorites/toggle', { homestay_id: homestayId });
}

export function checkFavorited(homestayId: number) {
  return get<{ isFavorited: boolean }>(`/api/favorites/check/${homestayId}`);
}

// ============== 入住须知 ==============
export interface HouseRule {
  id: number; homestay_id: number;
  check_in_time: string; check_out_time: string;
  cancellation_rules: Array<{ daysBefore: number; refundPercent: number; description: string }>;
  notes: string;
}

export function getHouseRules(homestayId: number) {
  return get<HouseRule>(`/api/homestay/${homestayId}/rules`);
}
