// ============================================================
// 乌东文旅平台 — 统一 API 类型定义
// 所有前端项目引用此包以保持类型一致
// ============================================================

// ---- 统一 API 响应格式 ----

export interface ApiSuccessResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
  requestId: string;
}

export interface PaginatedData<T> {
  list: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export type PaginatedResponse<T> = ApiSuccessResponse<PaginatedData<T>>;

export interface ApiErrorResponse {
  code: number;
  message: string;
  data: null;
  errors?: Array<{ field: string; message: string }>;
  timestamp: number;
  requestId: string;
}

// ---- 用户相关 ----

export interface UserInfo {
  id: number;
  nickname: string;
  avatar: string;
  gender: 0 | 1 | 2;
  phone: string;
  province?: string;
  city?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ---- 订单相关 ----

export type OrderStatus =
  | 'pending_payment'
  | 'pending_confirm'
  | 'confirmed'
  | 'completed'
  | 'refunding'
  | 'refunded'
  | 'cancelled';

export type OrderType = 'product' | 'food' | 'accommodation' | 'ticket';

export interface OrderItem {
  id: number;
  orderNo: string;
  type: OrderType;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
}

// ---- 商品相关 ----

export interface ProductSku {
  id: number;
  productId: number;
  spec: string;
  price: number;
  stock: number;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  subtitle: string;
  categoryId: number;
  mainImage: string;
  price: number;
  marketPrice: number;
  sales: number;
  rating: number;
  status: 0 | 1;
  createdAt: string;
}

// ---- 购物车 ----

export interface CartItem {
  id: number;
  productId: number;
  skuId: number;
  productName: string;
  productImage: string;
  spec: string;
  price: number;
  quantity: number;
  stock: number;
  merchantId: number;
  merchantName: string;
  selected: boolean;
  valid: boolean;
}

// ---- 公共枚举 ----

export enum BusinessCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  BUSINESS_ERROR = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_ERROR = 500,
}
