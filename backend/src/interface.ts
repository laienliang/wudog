// ============================================================
// 公共接口类型定义
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\interface.ts
// ============================================================

/** 统一返回结构 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/** 分页查询参数 */
export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

/** 分页返回结构 */
export interface PaginatedResult<T> {
  total: number;
  page: number;
  pageSize: number;
  list: T[];
}

/** 订单状态枚举（DB 存 TINYINT） */
export enum OrderStatus {
  PENDING_PAYMENT = 0,
  PAID = 1,
  CONFIRMED = 2,
  CHECKING_IN = 3,
  COMPLETED = 4,
  CANCELLED = 5,
  REFUNDING = 6,
  REFUNDED = 7,
}

/** 订单状态字符串→数字映射（前端传字符串，后端转数字） */
export const ORDER_STATUS_MAP: Record<string, OrderStatus> = {
  pending_payment: OrderStatus.PENDING_PAYMENT,
  paid: OrderStatus.PAID,
  confirmed: OrderStatus.CONFIRMED,
  checking_in: OrderStatus.CHECKING_IN,
  completed: OrderStatus.COMPLETED,
  cancelled: OrderStatus.CANCELLED,
  refunding: OrderStatus.REFUNDING,
  refunded: OrderStatus.REFUNDED,
};

/** 订单状态数字→字符串映射（返回给前端时转字符串） */
export const ORDER_STATUS_REVERSE_MAP: Record<number, string> = {
  [OrderStatus.PENDING_PAYMENT]: 'pending_payment',
  [OrderStatus.PAID]: 'paid',
  [OrderStatus.CONFIRMED]: 'confirmed',
  [OrderStatus.CHECKING_IN]: 'checking_in',
  [OrderStatus.COMPLETED]: 'completed',
  [OrderStatus.CANCELLED]: 'cancelled',
  [OrderStatus.REFUNDING]: 'refunding',
  [OrderStatus.REFUNDED]: 'refunded',
};

/** 前端字符串状态 → 后端枚举数字 */
export function toOrderStatusNumber(status: string | number): number {
  if (typeof status === 'number') return status;
  const num = Number(status);
  if (!isNaN(num) && ORDER_STATUS_REVERSE_MAP[num]) return num;
  const mapped = ORDER_STATUS_MAP[status];
  if (mapped !== undefined) return mapped;
  throw new Error(`无效的订单状态: ${status}`);
}

/** 后端枚举数字 → 前端字符串状态 */
export function toOrderStatusString(status: number): string {
  return ORDER_STATUS_REVERSE_MAP[status] || String(status);
}

/** 退改状态（DB 存 TINYINT） */
export enum CancelStatus {
  NONE = 0,
  PARTIAL = 1,
  FULL = 2,
  DENIED = 3,
}

/** 退改规则项 */
export interface CancellationRule {
  daysBefore: number;
  refundPercent: number;
  description: string;
}

/** 房态状态 */
export enum CalendarStatus {
  AVAILABLE = 1,  // 可售
  FULL = 2,       // 满房
  CLOSED = 3,     // 关房
}
