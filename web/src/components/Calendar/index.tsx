/* ============================================================
   日期范围选择器 — 房态日历（无价格版）
   - 页面不展示任何房价金额
   - 可售日期：两行居中 — 日期数字 + 余X间
   - 不可售/无数据：红色"未开"
   - disabledDate 仅禁用过期日期 + 满房日期
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
  initialCheckIn?: string;
  initialCheckOut?: string;
  onDateChange: (checkIn: string, checkOut: string, nights: number) => void;
}

export default function RoomCalendar({
  roomId,
  initialCheckIn,
  initialCheckOut,
  onDateChange,
}: Props) {
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(() => {
    if (initialCheckIn && initialCheckOut) {
      const s = dayjs(initialCheckIn);
      const e = dayjs(initialCheckOut);
      if (s.isValid() && e.isValid() && e.isAfter(s)) {
        return [s, e];
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const today = dayjs();
  const maxDate = today.add(90, 'day');

  // 同步外部传入的初始日期
  useEffect(() => {
    if (initialCheckIn && initialCheckOut && !dates) {
      const s = dayjs(initialCheckIn);
      const e = dayjs(initialCheckOut);
      if (s.isValid() && e.isValid() && e.isAfter(s)) {
        setDates([s, e]);
        const n = e.diff(s, 'day');
        onDateChange(initialCheckIn, initialCheckOut, n);
      }
    }
  }, [initialCheckIn, initialCheckOut]); // eslint-disable-line react-hooks/exhaustive-deps

  // 拉取房态数据（仅取 stock、status、bookingDate，不关心 price）
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getCalendar(
          roomId,
          today.format('YYYY-MM-DD'),
          today.add(90, 'day').format('YYYY-MM-DD'),
        );
        setCalendar(data || []);
      } catch {
        /* ignore */
      }
      setLoading(false);
    })();
  }, [roomId]);

  // 不可选日期集合（status ≠ 1 或 stock ≤ 0）
  const unavailableDates = useMemo(() => {
    return new Set(
      calendar
        .filter((c) => c.status !== 1 || c.available_stock <= 0)
        .map((c) => c.bookingDate),
    );
  }, [calendar]);

  // ---- RangePicker 回调 ----
  const handleChange = (vals: any) => {
    if (!vals || vals.length < 2) {
      setDates(null);
      onDateChange('', '', 0);
      return;
    }
    const [s, e] = vals;
    setDates([s, e]);
    const nights = e.diff(s, 'day');
    onDateChange(s.format('YYYY-MM-DD'), e.format('YYYY-MM-DD'), nights);
  };

  // ---- disabledDate：禁用过期日期 + 90 天外 + 不可售日期 ----
  const disabledDate = (d: Dayjs) => {
    const dateStr = d.format('YYYY-MM-DD');
    return (
      d.isBefore(today, 'day') ||
      d.isAfter(maxDate, 'day') ||
      unavailableDates.has(dateStr)
    );
  };

  // ---- cellRender：两行居中，不展示任何价格 ----
  const dateCellRender = (d: Dayjs) => {
    const dateStr = d.format('YYYY-MM-DD');
    const dayNum = d.date(); // 当月第几天 (1–31)
    const item = calendar.find((c) => c.bookingDate === dateStr);

    // ① 无房态记录：仅日期数字（该日未开放预订）
    if (!item) {
      return (
        <div className="date-cell">
          <span className="date-day">{dayNum}</span>
          <span className="date-unavail">未开</span>
        </div>
      );
    }

    // ② 不可售（关房 / 满房 / 库存 0）：日期数字 + 红色"未开"
    if (item.status !== 1 || item.available_stock <= 0) {
      return (
        <div className="date-cell date-cell--full">
          <span className="date-day">{dayNum}</span>
          <span className="date-unavail">未开</span>
        </div>
      );
    }

    // ③ 可售：两行 — 日期数字 + 余X间
    return (
      <div className="date-cell date-cell--ok">
        <span className="date-day">{dayNum}</span>
        <span className="date-stock">余{item.available_stock}间</span>
      </div>
    );
  };

  // ---- 底部汇总（仅显示入住晚数） ----
  const nights = dates ? dates[1].diff(dates[0], 'day') : 0;

  return (
    <div className="calendar-panel">
      <RangePicker
        value={dates as any}
        onChange={handleChange}
        disabledDate={disabledDate}
        cellRender={dateCellRender as any}
        getPopupContainer={(trigger) => trigger.parentElement || document.body}
        popupStyle={{ zIndex: 1050 }}
        style={{ width: '100%' }}
        placeholder={['入住日期', '离店日期']}
      />
      {loading && (
        <span style={{ fontSize: 12, color: '#999' }}>加载房态中…</span>
      )}
      {nights > 0 && (
        <div className="calendar-summary">
          共 <strong>{nights}</strong> 晚
        </div>
      )}
    </div>
  );
}
