/** 订单状态枚举 */
export enum OrderStatus {
  PENDING_PAY = 'pending_pay',
  PAID = 'paid',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

/** 订单类型 */
export enum OrderType {
  CLOTHING = 'clothing',
  FOOD_MEAL = 'food_meal',
  FOOD_PRODUCT = 'food_product',
  ACCOMMODATION = 'accommodation',
  TRAVEL = 'travel',
}

/** 创建订单请求 */
export interface CreateOrderInput {
  orderType: OrderType;
  merchantId: number;
  items: CreateOrderItemInput[];
  remark?: string;
}

export interface CreateOrderItemInput {
  productType: string;
  productId: number;
  productName: string;
  productImage?: string;
  skuId?: number;
  skuName?: string;
  unitPrice: number;
  quantity: number;
}

/** 订单列表查询参数 */
export interface OrderQueryInput {
  page?: number;
  pageSize?: number;
  orderType?: OrderType;
  status?: OrderStatus;
}

/** 订单VO */
export interface OrderVO {
  id: number;
  orderNo: string;
  userId: number;
  merchantId: number;
  orderType: string;
  totalAmount: number;
  payAmount: number;
  status: string;
  payType: string;
  payTime: string;
  remark: string;
  createdAt: string;
  items: OrderItemVO[];
  logs: OrderLogVO[];
}

export interface OrderItemVO {
  id: number;
  productType: string;
  productName: string;
  productImage: string;
  skuId: number;
  skuName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderLogVO {
  fromStatus: string;
  toStatus: string;
  operator: string;
  remark: string;
  createdAt: string;
}
