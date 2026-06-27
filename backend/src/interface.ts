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

/** 订单状态枚举 */
export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  PAID = 'paid',
  CONFIRMED = 'confirmed',
  CHECKING_IN = 'checking_in',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDING = 'refunding',
  REFUNDED = 'refunded',
}

/** 退改状态 */
export enum CancelStatus {
  NONE = 'none',
  PARTIAL = 'partial',
  FULL = 'full',
  DENIED = 'denied',
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
