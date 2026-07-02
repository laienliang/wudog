/* ============================================================
   金额格式化工具
   消除 JS IEEE 754 浮点数精度缺陷，统一保留 2 位小数
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\utils\format.ts
   ============================================================ */

/**
 * 格式化金额为数字，保留 2 位小数
 * 通过 Math.round(value * 100) / 100 避免浮点尾数
 * 例: 0.0112400000001 → 0.01；299.99999999 → 300
 */
export function formatPrice(value: number | null | undefined): number {
  if (value == null) return 0;
  return Math.round(value * 100) / 100;
}

/**
 * 格式化金额为显示字符串 ¥XX.XX
 * 例: formatPriceText(299.5) → "¥299.50"
 */
export function formatPriceText(value: number | null | undefined): string {
  return `¥${formatPrice(value).toFixed(2)}`;
}
