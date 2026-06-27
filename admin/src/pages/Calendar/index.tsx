/* ============================================================
   ★ 房态日历页面（核心专属功能）
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\Calendar\index.tsx
   ============================================================ */
import CalendarManager from '../../components/CalendarManager';

export default function CalendarPage() {
  return (
    <div>
      <h2>房态日历管理</h2>
      <p style={{ color: '#999', marginBottom: 16 }}>
        批量修改每日库存和价格：选择房型后可单击单日编辑，或开启批量模式选择日期范围统一修改。
      </p>
      <CalendarManager />
    </div>
  );
}
