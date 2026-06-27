/* ============================================================
   业务常量
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\utils\constants.js
   ============================================================ */

/** 订单状态映射 */
const ORDER_STATUS = {
  pending_payment: { label: '待支付', color: '#9CA3AF' },
  paid: { label: '已支付', color: '#3B82F6' },
  confirmed: { label: '已确认', color: '#10B981' },
  checking_in: { label: '入住中', color: '#F59E0B' },
  completed: { label: '已完成', color: '#10B981' },
  cancelled: { label: '已取消', color: '#EF4444' },
  refunding: { label: '退款中', color: '#F97316' },
  refunded: { label: '已退款', color: '#8B5CF6' },
};

/** 退改规则 */
const CANCEL_RULES = [
  { daysBefore: 3, refundPercent: 100, desc: '入住前3天以上取消，全额退款' },
  { daysBefore: 1, refundPercent: 50, desc: '入住前1-3天取消，退款50%' },
  { daysBefore: 0, refundPercent: 0, desc: '入住前24小时内取消，不可退款' },
];

/** 民宿设施标签 */
const FACILITIES = [
  'WiFi', '空调', '停车场', '餐厅', '茶室', '洗衣服务', '行李寄存', '旅游咨询',
  '独立卫浴', '观景阳台', '儿童用品', '浴缸', '地暖', '智能马桶',
];

module.exports = { ORDER_STATUS, CANCEL_RULES, FACILITIES };
