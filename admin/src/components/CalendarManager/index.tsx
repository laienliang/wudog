/* ============================================================
   ★ 房态日历管理组件 — 日历视图批量修改库存/单独调价
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\components\CalendarManager\index.tsx
   ============================================================ */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Select, Button, InputNumber, DatePicker, Tag, Space, message, Spin, Modal, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { getRooms, getHomestays, getAdminCalendar, batchEditCalendar, singleEditCalendar } from '../../api/lodging';
import './style.css';

const { RangePicker } = DatePicker;

export default function CalendarManager() {
  const [homestays, setHomestays] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedHomestay, setSelectedHomestay] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 当前展示月份
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));

  // 批量编辑模式
  const [batchMode, setBatchMode] = useState(false);
  const [batchDates, setBatchDates] = useState<[string, string] | null>(null);
  const [editModal, setEditModal] = useState<{ date: string; price: number; stock: number } | null>(null);
  const [batchStock, setBatchStock] = useState<number | null>(null);
  const [batchPrice, setBatchPrice] = useState<number | null>(null);

  useEffect(() => {
    (async () => { try { const r = await getHomestays({ pageSize: 100 }); setHomestays(r.list || []); } catch {} })();
  }, []);

  useEffect(() => {
    if (!selectedHomestay) { setRooms([]); return; }
    (async () => { try { const r = await getRooms({ homestay_id: selectedHomestay, pageSize: 100 }); setRooms(r.list || []); } catch {} })();
  }, [selectedHomestay]);

  // 房型变化 → 加载当月房态
  const fetchCalendar = useCallback(async () => {
    if (!selectedRoom) { setCalendar([]); return; }
    setLoading(true);
    try {
      const sd = currentMonth.startOf('month').format('YYYY-MM-DD');
      const ed = currentMonth.endOf('month').format('YYYY-MM-DD');
      const r = await getAdminCalendar({ room_id: selectedRoom, startDate: sd, endDate: ed, pageSize: 100 });
      setCalendar(r.list || []);
    } catch {}
    setLoading(false);
  }, [selectedRoom, currentMonth]);

  useEffect(() => { fetchCalendar(); }, [fetchCalendar]);

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));

  // 生成当月日期网格
  const monthDays = useMemo(() => {
    const start = currentMonth.startOf('month');
    const end = currentMonth.endOf('month');
    const days: Dayjs[] = [];
    // 填充月初空白
    const startDayOfWeek = start.day(); // 0=Sun
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(start.subtract(startDayOfWeek - i, 'day'));
    }
    for (let d = dayjs(start); d.isBefore(end.add(1, 'day')); d = d.add(1, 'day')) {
      days.push(d);
    }
    // 补齐末尾
    while (days.length % 7 !== 0) {
      days.push(days[days.length - 1].add(1, 'day'));
    }
    return days;
  }, [currentMonth]);

  const calMap = useMemo(() => {
    const m: Record<string, any> = {};
    calendar.forEach(c => { m[c.bookingDate] = c; });
    return m;
  }, [calendar]);

  const isCurrentMonth = (d: Dayjs) => d.month() === currentMonth.month();

  // 单击日期 → 编辑弹窗
  const handleDayClick = (dateStr: string, item: any) => {
    if (batchMode) return;
    setEditModal({
      date: dateStr,
      price: item?.price ?? 0,
      stock: item?.available_stock ?? 0,
    });
  };

  const handleSingleSave = async () => {
    if (!editModal || !selectedRoom) return;
    try { await singleEditCalendar({ roomId: selectedRoom, date: editModal.date, availableStock: editModal.stock, price: editModal.price }); } catch {}
    message.success('已更新'); setEditModal(null); fetchCalendar();
  };

  // 批量编辑
  const handleBatchSave = async () => {
    if (!batchDates || !selectedRoom) { message.warning('请选择日期范围'); return; }
    try { await batchEditCalendar({ roomId: selectedRoom, startDate: batchDates[0], endDate: batchDates[1], availableStock: batchStock ?? undefined, price: batchPrice ?? undefined }); } catch {}
    message.success('批量更新成功'); setBatchMode(false); setBatchDates(null); fetchCalendar();
  };

  const weekHeaders = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="calendar-manager">
      {/* 筛选栏 */}
      <Space wrap style={{ marginBottom: 16 }}>
        <Select placeholder="选择民宿" style={{ width: 200 }} value={selectedHomestay}
          onChange={(v) => { setSelectedHomestay(v); setSelectedRoom(null); }}
          options={homestays.map((h: any) => ({ label: h.name, value: h.id }))} allowClear />
        <Select placeholder="选择房型" style={{ width: 200 }} value={selectedRoom}
          onChange={setSelectedRoom}
          options={rooms.map((r: any) => ({ label: r.name, value: r.id }))} />
        {selectedRoom && (
          <Button onClick={() => { setBatchMode(!batchMode); setBatchDates(null); }} type={batchMode ? 'primary' : 'default'}>
            {batchMode ? '退出批量模式' : '批量编辑'}
          </Button>
        )}
      </Space>

      {/* 批量编辑工具栏 */}
      {batchMode && selectedRoom && (
        <Card size="small" style={{ marginBottom: 16, background: '#FFF7E6' }}>
          <Space wrap>
            <RangePicker
              onChange={(vals) => {
                if (vals && vals[0] && vals[1]) {
                  setBatchDates([vals[0].format('YYYY-MM-DD'), vals[1].format('YYYY-MM-DD')]);
                } else { setBatchDates(null); }
              }}
            />
            <span>库存：</span><InputNumber min={0} value={batchStock} onChange={setBatchStock} placeholder="间数" />
            <span>价格：</span><InputNumber min={0} step={10} value={batchPrice} onChange={setBatchPrice} placeholder="元/晚" />
            <Button type="primary" icon={<SaveOutlined />} onClick={handleBatchSave}>应用批量更新</Button>
          </Space>
        </Card>
      )}

      {/* 日历网格 */}
      {selectedRoom ? (
        <Spin spinning={loading}>
          <Card
            title={
              <Space>
                <Button size="small" icon={<LeftOutlined />} onClick={prevMonth} />
                <strong>{currentMonth.format('YYYY年MM月')}</strong>
                <Button size="small" icon={<RightOutlined />} onClick={nextMonth} />
              </Space>
            }
          >
            <div className="cal-grid">
              {weekHeaders.map(w => <div key={w} className="cal-header-cell">{w}</div>)}
              {monthDays.map((d, i) => {
                const dateStr = d.format('YYYY-MM-DD');
                const item = calMap[dateStr];
                const active = isCurrentMonth(d);
                const statusColor = !active ? 'transparent' :
                  item?.status === 3 ? '#f0f0f0' : item?.status === 2 ? '#FFF1F0' :
                  item?.available_stock === 0 ? '#FFF1F0' : '#F6FFED';
                return (
                  <div
                    key={i}
                    className={`cal-cell ${active ? 'active' : 'dimmed'} ${batchMode ? 'batch-mode' : ''}`}
                    style={{ background: statusColor }}
                    onClick={() => active && handleDayClick(dateStr, item)}
                  >
                    <span className="cal-date">{d.date()}</span>
                    {active && item && (
                      <>
                        <span className="cal-price">¥{item.price ?? '—'}</span>
                        <span className="cal-stock">余{item.available_stock}</span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </Spin>
      ) : (
        <Card><div style={{ textAlign: 'center', padding: 40, color: '#999' }}>请选择民宿和房型查看房态日历</div></Card>
      )}

      {/* 单日编辑弹窗 */}
      <Modal title={`编辑 ${editModal?.date}`} open={!!editModal} onOk={handleSingleSave} onCancel={() => setEditModal(null)}>
        {editModal && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <label>可售库存（间）：</label>
              <InputNumber min={0} value={editModal.stock} onChange={(v) => setEditModal({ ...editModal, stock: v || 0 })} style={{ width: '100%' }} />
            </div>
            <div>
              <label>当日价格（元）：</label>
              <InputNumber min={0} step={10} value={editModal.price} onChange={(v) => setEditModal({ ...editModal, price: v || 0 })} style={{ width: '100%' }} />
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
}
