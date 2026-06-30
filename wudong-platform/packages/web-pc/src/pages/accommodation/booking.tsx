import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, Space, message, Descriptions, Divider, Skeleton } from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const api = axios.create({ baseURL: '/api/v1' });
const COLORS = { primary: '#1F5FA8', price: '#E85D2F' };

const AccommodationBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [homestay, setHomestay] = useState<any>(null);
  const [roomType, setRoomType] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [orderResult, setOrderResult] = useState<any>(null);

  const roomTypeId = searchParams.get('roomTypeId');

  useEffect(() => {
    api.get(`/homestays/${id}`).then(r => {
      const h = r.data?.data || r.data;
      setHomestay(h);
      const rt = h.roomTypes?.find((r: any) => String(r.id) === roomTypeId);
      if (rt) setRoomType(rt);
    }).catch(() => { message.error('加载失败'); navigate('/accommodation'); })
    .finally(() => setLoading(false));
  }, [id, roomTypeId]);

  const calcNights = () => {
    if (!checkIn || !checkOut) return 0;
    const d1 = new Date(checkIn), d2 = new Date(checkOut);
    return Math.max(0, Math.ceil((d2.getTime() - d1.getTime()) / 86400000));
  };

  const nights = calcNights();
  const totalAmount = roomType ? Number(roomType.price) * nights : 0;

  const handleSubmit = async () => {
    if (!roomType) { message.error('请选择房型'); return; }
    if (!checkIn || !checkOut) { message.error('请选择入住和离店日期'); return; }
    if (nights <= 0) { message.error('离店日期必须晚于入住日期'); return; }
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const res = await api.post('/orders', {
        orderType: 'accommodation',
        merchantId: homestay.merchantId || 1,
        items: [{
          productType: 'room_type',
          productId: roomType.id,
          productName: roomType.name,
          productImage: roomType.images?.[0] || homestay?.coverImage || '',
          unitPrice: Number(roomType.price),
          quantity: nights,
        }],
        remark: `${homestay.name} ${roomType.name} 入住${checkIn} 离店${checkOut} 联系人${values.name} ${values.phone}`,
      });
      const orderData = res.data?.data || res.data;
      setOrderResult(orderData);
      message.success('预订成功！');
    } catch (err: any) {
      if (err.errorFields) return;
      message.error('提交失败，请重试');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ maxWidth: 800, margin: '0 auto', padding: 40 }}><Skeleton active paragraph={{ rows: 6 }} /></div>;

  if (orderResult) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 40, textAlign: 'center' }}>
        <Card style={{ borderRadius: 12, padding: 40 }}>
          <Title level={3} style={{ color: COLORS.primary }}>✅ 预订成功！</Title>
          <Descriptions column={1} style={{ marginTop: 24 }}>
            <Descriptions.Item label="订单号"><Text copyable strong>{orderResult.orderNo || orderResult?.data?.orderNo || '-'}</Text></Descriptions.Item>
            <Descriptions.Item label="民宿">{homestay.name}</Descriptions.Item>
            <Descriptions.Item label="房型">{roomType?.name}</Descriptions.Item>
            <Descriptions.Item label="入住">{checkIn}</Descriptions.Item>
            <Descriptions.Item label="离店">{checkOut}</Descriptions.Item>
            <Descriptions.Item label="总金额"><Text style={{ color: COLORS.price, fontWeight: 700, fontSize: 18 }}>¥{Number(totalAmount).toFixed(2)}</Text></Descriptions.Item>
          </Descriptions>
          <Space style={{ marginTop: 24 }}>
            <Button onClick={() => navigate('/accommodation')}>返回民宿列表</Button>
            <Button type="primary" onClick={() => navigate('/orders')} style={{ background: COLORS.primary }}>查看订单</Button>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ padding: 0, marginBottom: 16, color: COLORS.primary }}>
        返回
      </Button>

      <Card title={<Space><HomeOutlined style={{ color: COLORS.primary }} />预订民宿</Space>}
        style={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

        <Descriptions column={1} style={{ marginBottom: 16 }}>
          <Descriptions.Item label="民宿">{homestay?.name}</Descriptions.Item>
          <Descriptions.Item label="房型">{roomType?.name || '未选择'}</Descriptions.Item>
          {roomType && <Descriptions.Item label="单价"><Text style={{ color: COLORS.price, fontWeight: 600 }}>¥{Number(roomType.price).toFixed(2)}/晚</Text></Descriptions.Item>}
        </Descriptions>

        <Divider />
        <Text strong style={{ fontSize: 15 }}>选择日期</Text>
        <div style={{ margin: '12px 0', display: 'flex', gap: 16 }}>
          <div>
            <Text type="secondary" style={{ fontSize: 13 }}>入住日期</Text><br />
            <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
              style={{ padding: '6px 12px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 14, marginTop: 4 }} />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 13 }}>离店日期</Text><br />
            <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
              style={{ padding: '6px 12px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 14, marginTop: 4 }} />
          </div>
          {nights > 0 && <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 6 }}>
            <Text type="secondary">共 <Text strong>{nights}</Text> 晚</Text>
          </div>}
        </div>

        <Divider />
        <Text strong style={{ fontSize: 15 }}>入住人信息</Text>
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item name="name" label="联系人" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" style={{ maxWidth: 300 }} />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input placeholder="请输入手机号" maxLength={11} style={{ maxWidth: 300 }} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="如有特殊要求请备注" style={{ maxWidth: 400 }} />
          </Form.Item>
        </Form>

        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text style={{ fontSize: 14 }}>合计：</Text>
            <Text style={{ color: COLORS.price, fontWeight: 700, fontSize: 22 }}>¥{totalAmount.toFixed(2)}</Text>
          </div>
          <Button type="primary" size="large" loading={submitting} onClick={handleSubmit}
            style={{ background: COLORS.primary, borderColor: COLORS.primary, borderRadius: 8, height: 44, paddingInline: 32 }}>
            提交订单
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AccommodationBooking;
