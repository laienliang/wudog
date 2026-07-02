/* ============================================================
   业务常量（DB 存 TINYINT 数值）
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\utils\constants.js
   ============================================================ */

/** 订单状态映射（后端 OrderStatus 枚举值） */
const ORDER_STATUS = {
  0: { label: '待支付', color: '#9CA3AF' },
  1: { label: '已支付', color: '#3B82F6' },
  2: { label: '已确认', color: '#10B981' },
  3: { label: '入住中', color: '#F59E0B' },
  4: { label: '已完成', color: '#10B981' },
  5: { label: '已取消', color: '#EF4444' },
  6: { label: '退款中', color: '#F97316' },
  7: { label: '已退款', color: '#8B5CF6' },
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
