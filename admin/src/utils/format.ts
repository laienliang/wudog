/**
 * 格式化工具函数
 */

/**
 * 手机号脱敏展示
 * 将 13812345678 格式化为 138****5678
 * @param phone 手机号
 * @returns 脱敏后的手机号
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return '-';
  if (phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 身份证号脱敏展示
 * 将 110101199001011234 格式化为 110101********1234
 * @param idCard 身份证号
 * @returns 脱敏后的身份证号
 */
export function maskIdCard(idCard: string | null | undefined): string {
  if (!idCard) return '-';
  if (idCard.length !== 18) return idCard;
  return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
}

/**
 * 格式化金额
 * @param amount 金额（分或元）
 * @param isCent 是否为分
 * @returns 格式化后的金额字符串
 */
export function formatAmount(amount: number | null | undefined, isCent = false): string {
  if (amount === null || amount === undefined) return '¥0.00';
  const yuan = isCent ? amount / 100 : amount;
  return `¥${yuan.toFixed(2)}`;
}

/**
 * 格式化日期时间
 * @param date 日期字符串或Date对象
 * @param format 格式类型
 * @returns 格式化后的日期字符串
 */
export function formatDateTime(date: string | Date | null | undefined, format: 'datetime' | 'date' | 'time' = 'datetime'): string {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  switch (format) {
    case 'date':
      return `${year}-${month}-${day}`;
    case 'time':
      return `${hours}:${minutes}:${seconds}`;
    default:
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}

/**
 * 订单状态映射
 * 使用乌东文旅品牌色系：
 * - 苗银蓝 #1F5FA8 用于进行中状态
 * - 梯田绿 #6B8E3D 用于成功状态
 * - 刺绣橙 #E85D2F 用于警告/退款状态
 * - 古木棕 #7A5230 用于次要状态
 */
export const ORDER_STATUS_MAP: Record<string, { color: string; text: string }> = {
  pending_payment: { color: 'blue', text: '待支付' },
  paid: { color: 'processing', text: '已支付' },
  shipped: { color: 'geekblue', text: '已发货' },
  completed: { color: 'success', text: '已完成' },
  cancelled: { color: 'default', text: '已取消' },
  refunding: { color: 'warning', text: '退款中' },
  refunded: { color: 'error', text: '已退款' },
};

/**
 * 审核状态映射
 * - processing（苗银蓝）用于待审核
 * - success（梯田绿）用于通过
 * - error（刺绣橙）用于驳回
 */
export const AUDIT_STATUS_MAP: Record<string, { color: string; text: string }> = {
  pending: { color: 'processing', text: '待审核' },
  approved: { color: 'success', text: '已通过' },
  rejected: { color: 'error', text: '已驳回' },
};

/**
 * 模块类型映射
 */
export const MODULE_TYPE_MAP: Record<string, string> = {
  clothing: '非遗商品（衣）',
  food: '餐饮美食（食）',
  stay: '住宿预订（住）',
  travel: '线路订票（行）',
};

/**
 * 订单类型映射
 */
export const ORDER_TYPE_MAP: Record<string, string> = {
  product: '商品订单',
  food_order: '餐位预订',
  stay: '住宿预订',
  ticket: '门票订单',
  route: '路线订单',
};
