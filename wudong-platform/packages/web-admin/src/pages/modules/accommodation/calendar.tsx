import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, InputNumber, Button, message, Tag, Space, Typography, Spin, Empty } from 'antd';
import { CalendarOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { accommodationApi } from '../../../services/accommodation';

const { Text } = Typography;
const COLORS = { primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838', danger: '#D94A4A' };

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

const CalendarTab: React.FC = () => {
  const [homestays, setHomestays] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [selectedHomestay, setSelectedHomestay] = useState<number | undefined>(undefined);
  const [selectedRoomType, setSelectedRoomType] = useState<number | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Batch form
  const [batchStart, setBatchStart] = useState('');
  const [batchEnd, setBatchEnd] = useState('');
  const [batchPrice, setBatchPrice] = useState<number | undefined>(undefined);
  const [batchStock, setBatchStock] = useState<number | undefined>(undefined);
  const [batchStatus, setBatchStatus] = useState<number | undefined>(undefined);
  const [batchLoading, setBatchLoading] = useState(false);

  useEffect(() => {
    accommodationApi.allHomestays().then((res: any) => {
      setHomestays(res?.data || res || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedHomestay) {
      accommodationApi.listRoomTypes(selectedHomestay).then((res: any) => {
        setRoomTypes(res?.data || res || []);
        setSelectedRoomType(undefined);
      }).catch(() => setRoomTypes([]));
    }
  }, [selectedHomestay]);

  useEffect(() => {
    if (selectedRoomType && selectedMonth) {
      setLoading(true);
      accommodationApi.getCalendar(selectedRoomType, selectedMonth).then((res: any) => {
        setCalendarData(res?.data || res || []);
      }).catch(() => setCalendarData([])).finally(() => setLoading(false));
    }
  }, [selectedRoomType, selectedMonth]);

  // Build calendar grid
  const buildCalendarGrid = () => {
    const year = parseInt(selectedMonth.slice(0, 4));
    const month = parseInt(selectedMonth.slice(5, 7));
    const firstDay = dayjs(`${selectedMonth}-01`);
    const daysInMonth = firstDay.daysInMonth();
    const startWeekday = firstDay.day();

    const dataByDate: Record<string, any> = {};
    calendarData.forEach(d => { dataByDate[d.date] = d; });

    const weeks: any[][] = [];
    let week: any[] = [];
    for (let i = 0; i < startWeekday; i++) week.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${selectedMonth}-${String(d).padStart(2, '0')}`;
      const info = dataByDate[dateStr];
      week.push({ day: d, date: dateStr, info, isToday: dayjs().format('YYYY-MM-DD') === dateStr });
      if (week.length === 7) { weeks.push(week); week = []; }
    }
    if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week); }
    return weeks;
  };

  const handleBatchApply = async () => {
    if (!selectedRoomType) { message.warning('请先选择房型'); return; }
    if (!batchStart || !batchEnd) { message.warning('请选择日期范围'); return; }
    if (batchStart > batchEnd) { message.warning('开始日期不能晚于结束日期'); return; }
    if (batchPrice === undefined && batchStock === undefined && batchStatus === undefined) {
      message.warning('请至少设置一项（价格/库存/状态）');
      return;
    }
    setBatchLoading(true);
    try {
      await accommodationApi.batchSetCalendar({
        roomTypeId: selectedRoomType,
        startDate: batchStart,
        endDate: batchEnd,
        price: batchPrice,
        stock: batchStock,
        status: batchStatus,
      });
      message.success('日历更新成功');
      // Refresh
      const res = await accommodationApi.getCalendar(selectedRoomType, selectedMonth);
      setCalendarData(res?.data || res || []);
    } catch { message.error('操作失败'); }
    finally { setBatchLoading(false); }
  };

  const weeks = buildCalendarGrid();
  const monthOptions: { label: string; value: string }[] = [];
  for (let i = -6; i <= 6; i++) {
    const m = dayjs().add(i, 'month');
    monthOptions.push({ label: m.format('YYYY年MM月'), value: m.format('YYYY-MM') });
  }

  return (
    <div>
      {/* ===== 筛选栏 ===== */}
      <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }} styles={{ body: { padding: '16px 24px' } }}>
        <Row gutter={16} align="middle">
          <Col><Text type="secondary">民宿：</Text></Col>
          <Col>
            <Select placeholder="选择民宿" style={{ width: 180 }} allowClear showSearch optionFilterProp="label"
              value={selectedHomestay} onChange={setSelectedHomestay}
              options={(homestays || []).map((h: any) => ({ label: h.name, value: h.id }))} />
          </Col>
          <Col><Text type="secondary">房型：</Text></Col>
          <Col>
            <Select placeholder={selectedHomestay ? '选择房型' : '请先选民宿'} style={{ width: 200 }} allowClear
              value={selectedRoomType} onChange={setSelectedRoomType} disabled={!selectedHomestay}
              options={(roomTypes || []).map((r: any) => ({ label: r.name, value: r.id }))} />
          </Col>
          <Col><Text type="secondary">月份：</Text></Col>
          <Col>
            <Select style={{ width: 140 }} value={selectedMonth} onChange={setSelectedMonth} options={monthOptions} />
          </Col>
        </Row>
      </Card>

      {/* ===== 日历网格 ===== */}
      <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}
        title={<Space><CalendarOutlined style={{ color: COLORS.primary }} /><Text strong>{selectedMonth} 房态日历</Text></Space>}
        styles={{ body: { padding: '16px 24px' } }}>
        {!selectedRoomType ? (
          <Empty description="请先选择民宿和房型" />
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /><div style={{ marginTop: 12 }}>加载中...</div></div>
        ) : (
          <>
            {/* Weekday header */}
            <Row gutter={[4, 4]} style={{ marginBottom: 4 }}>
              {WEEKDAYS.map((d, i) => (
                <Col span={3} key={d} style={{ textAlign: 'center', fontWeight: 600, color: i >= 5 ? COLORS.danger : '#666', padding: '8px 0', fontSize: 13 }}>
                  {d}
                </Col>
              ))}
            </Row>
            {/* Calendar grid */}
            {weeks.map((week, wi) => (
              <Row gutter={[4, 4]} key={wi} style={{ marginBottom: 4 }}>
                {week.map((cell, ci) => (
                  <Col span={3} key={ci}>
                    {cell ? (
                      <div style={{
                        padding: '6px 4px', borderRadius: 6, textAlign: 'center', minHeight: 70,
                        background: cell.info ? (
                          cell.info.status === 2 ? '#fff1f0' :
                          cell.info.stock === 0 ? '#f0f0f0' : '#f6ffed'
                        ) : '#fafafa',
                        border: cell.isToday ? `2px solid ${COLORS.primary}` : '1px solid #f0f0f0',
                        cursor: 'default',
                      }}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: [0, 6].includes(dayjs(cell.date).day()) ? COLORS.danger : '#333' }}>
                          {cell.day}
                        </div>
                        {cell.info ? (
                          <>
                            <div style={{ fontSize: 11, color: COLORS.price, fontWeight: 600 }}>¥{Number(cell.info.price).toFixed(0)}</div>
                            <div style={{ fontSize: 11, color: cell.info.stock === 0 ? COLORS.danger : '#666' }}>
                              {cell.info.stock}间
                            </div>
                            {cell.info.status === 1 && <Tag color="warning" style={{ fontSize: 10, lineHeight: '16px', padding: '0 4px' }}>满房</Tag>}
                            {cell.info.status === 2 && <Tag color="error" style={{ fontSize: 10, lineHeight: '16px', padding: '0 4px' }}>维护</Tag>}
                          </>
                        ) : (
                          <div style={{ fontSize: 11, color: '#ccc' }}>未设置</div>
                        )}
                      </div>
                    ) : <div />}
                  </Col>
                ))}
              </Row>
            ))}
            {/* Legend */}
            <Space style={{ marginTop: 12 }} size={16}>
              <Space size={4}><div style={{ width: 14, height: 14, borderRadius: 3, background: '#f6ffed', border: '1px solid #b7eb8f' }} />有房</Space>
              <Space size={4}><div style={{ width: 14, height: 14, borderRadius: 3, background: '#f0f0f0', border: '1px solid #d9d9d9' }} />满房</Space>
              <Space size={4}><div style={{ width: 14, height: 14, borderRadius: 3, background: '#fff1f0', border: '1px solid #ffa39e' }} />维护</Space>
              <Space size={4}><div style={{ width: 14, height: 14, borderRadius: 3, background: '#fafafa', border: '1px solid #f0f0f0' }} />未设置</Space>
            </Space>
          </>
        )}
      </Card>

      {/* ===== 批量操作 ===== */}
      {selectedRoomType && (
        <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          title={<Space><SaveOutlined style={{ color: COLORS.primary }} /><Text strong>批量设置</Text></Space>}
          styles={{ body: { padding: '16px 24px' } }}>
          <Row gutter={16} align="middle">
            <Col><Text type="secondary">开始日期：</Text></Col>
            <Col><input type="date" value={batchStart} onChange={e => setBatchStart(e.target.value)}
              style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 13 }} /></Col>
            <Col><Text type="secondary">结束日期：</Text></Col>
            <Col><input type="date" value={batchEnd} onChange={e => setBatchEnd(e.target.value)}
              style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 13 }} /></Col>
            <Col><Text type="secondary">价格(¥)：</Text></Col>
            <Col><InputNumber min={0} precision={2} placeholder="留空不修改" value={batchPrice} onChange={v => setBatchPrice(v)} style={{ width: 130 }} /></Col>
            <Col><Text type="secondary">库存：</Text></Col>
            <Col><InputNumber min={0} placeholder="留空不修改" value={batchStock} onChange={v => setBatchStock(v)} style={{ width: 120 }} /></Col>
            <Col><Text type="secondary">状态：</Text></Col>
            <Col>
              <Select placeholder="不修改" allowClear style={{ width: 120 }}
                value={batchStatus} onChange={v => setBatchStatus(v)}
                options={[
                  { label: '可用', value: undefined },
                  { label: '已满', value: 1 },
                  { label: '维护中', value: 2 },
                ].filter(Boolean)} />
            </Col>
            <Col><Button type="primary" icon={<SaveOutlined />} loading={batchLoading} onClick={handleBatchApply}
              style={{ background: COLORS.primary }}>应用</Button></Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default CalendarTab;
