/* ============================================================
   日期范围选择器 — 30天房态日历
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\components\Calendar\index.tsx
   ============================================================ */
import { useState, useEffect, useMemo } from 'react';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { getCalendar, CalendarDay } from '../../api/lodging';
import './style.css';

const { RangePicker } = DatePicker;

interface Props {
  roomId: number;
  basePrice: number;
  onDateChange: (checkIn: string, checkOut: string, nights: number) => void;
}

export default function RoomCalendar({ roomId, basePrice, onDateChange }: Props) {
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(null);
  const [loading, setLoading] = useState(false);

  const today = dayjs();
  const maxDate = today.add(90, 'day');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getCalendar(roomId, today.format('YYYY-MM-DD'), today.add(30, 'day').format('YYYY-MM-DD'));
        setCalendar(data || []);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [roomId]);

  // 构建不可选日期（满房或关房）
  const disabledDates = useMemo(() => {
    return calendar
      .filter(c => c.status !== 1 || c.available_stock <= 0)
      .map(c => c.date);
  }, [calendar]);

  // 日期 → 当日价格映射
  const priceMap = useMemo(() => {
    const map: Record<string, number> = {};
    calendar.forEach(c => { map[c.date] = c.price ?? basePrice; });
    return map;
  }, [calendar, basePrice]);

  const handleChange = (vals: any) => {
    if (!vals || vals.length < 2) { setDates(null); return; }
    const [s, e] = vals;
    setDates([s, e]);
    const nights = e.diff(s, 'day');
    onDateChange(s.format('YYYY-MM-DD'), e.format('YYYY-MM-DD'), nights);
  };

  const disabledDate = (d: Dayjs) => {
    const dateStr = d.format('YYYY-MM-DD');
    return d.isBefore(today, 'day') || d.isAfter(maxDate, 'day') || disabledDates.includes(dateStr);
  };

  const dateCellRender = (d: Dayjs) => {
    const dateStr = d.format('YYYY-MM-DD');
    const price = priceMap[dateStr];
    const item = calendar.find(c => c.date === dateStr);
    if (!item || item.status !== 1) return null;
    return (
      <div className="date-cell">
        <span className="date-price">¥{price ?? basePrice}</span>
        <span className="date-stock">余{item.available_stock}间</span>
      </div>
    );
  };

  const nights = dates ? dates[1].diff(dates[0], 'day') : 0;
  const totalPrice = dates
    ? calendar
        .filter(c => c.date >= dates[0].format('YYYY-MM-DD') && c.date < dates[1].format('YYYY-MM-DD'))
        .reduce((sum, c) => sum + (c.price ?? basePrice), 0)
    : 0;

  return (
    <div className="calendar-panel">
      <RangePicker
        value={dates as any}
        onChange={handleChange}
        disabledDate={disabledDate}
        cellRender={dateCellRender as any}
        style={{ width: '100%' }}
        placeholder={['入住日期', '离店日期']}
      />
      {nights > 0 && (
        <div className="calendar-summary">
          共 <strong>{nights}</strong> 晚 · 总价 <em>¥{totalPrice}</em>
        </div>
      )}
    </div>
  );
}
