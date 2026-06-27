/* ============================================================
   通用工具函数
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\utils\util.js
   ============================================================ */

/** 格式化日期 YYYY-MM-DD */
function formatDate(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 计算两个日期差（天数） */
function diffDays(d1, d2) {
  const a = new Date(d1).getTime();
  const b = new Date(d2).getTime();
  return Math.ceil((b - a) / (1000 * 60 * 60 * 24));
}

/** 获取今天日期字符串 */
function today() {
  return formatDate(new Date());
}

/** 获取 N 天后的日期 */
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return formatDate(d);
}

/** 显示 Toast */
function toast(title, icon = 'none') {
  wx.showToast({ title, icon, duration: 2000 });
}

module.exports = { formatDate, diffDays, today, daysFromNow, toast };
