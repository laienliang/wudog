/* ============================================================
   预订下单页 — 选择日期 + 填写入住人 + 提交下单
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\pages\Book\index.tsx
   ============================================================ */
import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, InputNumber, Button, DatePicker, Descriptions, message, Divider } from 'antd';
import dayjs from 'dayjs';
import RoomCalendar from '../../components/Calendar';
import { createOrder } from '../../api/lodging';
import './style.css';

const { RangePicker } = DatePicker;

export default function BookPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const nav = useNavigate();

  const homestayId = Number(searchParams.get('homestayId') || '0');
  const roomName = searchParams.get('roomName') || '';
  const basePrice = Number(searchParams.get('price') || '0');

  useEffect(() => {
    if (!homestayId || !roomId || isNaN(Number(roomId))) {
      message.error('参数错误，缺少民宿或房型信息');
      nav('/');
    }
  }, [homestayId, roomId, nav]);

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [nights, setNights] = useState(() => {
    const cin = searchParams.get('checkIn');
    const cout = searchParams.get('checkOut');
    if (cin && cout) {
      const n = dayjs(cout).diff(dayjs(cin), 'day');
      return n > 0 ? n : 0;
    }
    return 0;
  });
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();
  const roomCount = Form.useWatch('room_count', form) || 1;

  const totalPrice = useMemo(
    () => nights * basePrice * roomCount,
    [nights, basePrice, roomCount],
  );

  const handleDateChange = (cin: string, cout: string, n: number) => {
    setCheckIn(cin);
    setCheckOut(cout);
    setNights(n);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('checkIn', cin);
      next.set('checkOut', cout);
      return next;
    });
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (!checkIn || !checkOut) {
      message.warning('请选择入住和离店日期');
      return;
    }
    setSubmitting(true);
    try {
      const res = await createOrder({
        homestay_id: homestayId,
        room_id: Number(roomId),
        check_in_date: checkIn,
        check_out_date: checkOut,
        room_count: values.room_count || 1,
        contact_name: values.contact_name,
        contact_phone: values.contact_phone,
        guest_count: values.guest_count || 1,
      });
      message.success('下单成功！');
      nav(`/detail/${homestayId}`);
    } catch (err: any) {
      message.error(err.message || '下单失败');
    }
    setSubmitting(false);
  };

  return (
    <div className="book-page">
      <h2>预订：{roomName}</h2>
      <div className="book-layout">
        <Card title="选择入住日期">
          <RoomCalendar
            roomId={Number(roomId)}
            initialCheckIn={searchParams.get('checkIn') || ''}
            initialCheckOut={searchParams.get('checkOut') || ''}
            onDateChange={handleDateChange}
          />
        </Card>

        <Card title="订单信息">
          <Form form={form} layout="vertical" initialValues={{ room_count: 1, guest_count: 1 }}>
            <Form.Item label="预订间数" name="room_count" rules={[{ required: true }]}>
              <InputNumber min={1} max={10} />
            </Form.Item>
            <Form.Item label="入住人姓名" name="contact_name" rules={[{ required: true, message: '请填写入住人姓名' }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item label="联系电话" name="contact_phone" rules={[{ required: true, message: '请填写联系电话' }]}>
              <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item label="入住人数" name="guest_count">
              <InputNumber min={1} max={20} />
            </Form.Item>
          </Form>

          <Divider />
          <Descriptions column={1} size="small">
            <Descriptions.Item label="入住日期">{checkIn || '—'}</Descriptions.Item>
            <Descriptions.Item label="离店日期">{checkOut || '—'}</Descriptions.Item>
            <Descriptions.Item label="入住晚数">{nights || 0} 晚</Descriptions.Item>
            <Descriptions.Item label="单价">¥{basePrice} /晚</Descriptions.Item>
            <Descriptions.Item label="预计总价">
              <span style={{ fontSize: 24, fontWeight: 700, color: '#E85D2F' }}>
                ¥{totalPrice}
              </span>
            </Descriptions.Item>
          </Descriptions>

          <Button type="primary" size="large" block loading={submitting} onClick={handleSubmit} style={{ marginTop: 24 }}>
            提交订单
          </Button>
        </Card>
      </div>
    </div>
  );
}
