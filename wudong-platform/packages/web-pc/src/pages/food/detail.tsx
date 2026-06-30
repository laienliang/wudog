import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Tag, Spin, Empty, Rate, message, Button, Modal, DatePicker, Select, InputNumber, Form, Input, Row, Col } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, ClockCircleOutlined, StarFilled } from '@ant-design/icons';
import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

const RestaurantDetail: React.FC = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [dishes, setDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => { if (id) fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [rRes, sRes, dRes] = await Promise.all([
        api.get(`/restaurants/${id}`),
        api.get(`/restaurants/${id}/slots`),
        api.get(`/restaurants/${id}/dishes`),
      ]);
      setRestaurant(rRes.data?.data || rRes.data);
      setSlots(sRes.data?.data || sRes.data || []);
      setDishes(dRes.data?.data || dRes.data || []);
    } catch { message.error('加载失败'); }
    setLoading(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  if (!restaurant) return <Empty description="餐厅不存在" style={{ padding: 80 }} />;

  return (<>
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      <Card style={{ borderRadius: 12, overflow: 'hidden' }}>
        <img src={restaurant.coverImage} style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }} />
        <h1 style={{ marginTop: 16 }}>{restaurant.name}</h1>
        <Rate disabled value={restaurant.rating} /> <span style={{ color: '#FAAD14' }}>{restaurant.rating}</span>
        <Descriptions column={1} style={{ marginTop: 16 }}>
          <Descriptions.Item label={<><EnvironmentOutlined /> 地址</>}>{restaurant.address}</Descriptions.Item>
          <Descriptions.Item label={<><PhoneOutlined /> 电话</>}>{restaurant.phone}</Descriptions.Item>
          <Descriptions.Item label={<><ClockCircleOutlined /> 营业时间</>}>{restaurant.openingHours}</Descriptions.Item>
        </Descriptions>
        {(restaurant.cuisineTags || []).map((t: string) => <Tag key={t} color="#1F5FA8">{t}</Tag>)}
        <p style={{ marginTop: 16, color: '#595959' }}>{restaurant.description}</p>
        <Button type="primary" size="large" onClick={() => setBookingOpen(true)} style={{ marginTop: 16, background: '#1F5FA8' }}>预订餐位</Button>
      </Card>

      {dishes.length > 0 && (
        <Card title="🍽️ 推荐菜品" style={{ marginTop: 16, borderRadius: 12 }}>
          <Row gutter={[16, 16]}>
            {dishes.map((d: any) => (
              <Col xs={12} sm={8} md={6} key={d.id}>
                <div style={{ textAlign: 'center', padding: 12 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{d.isSignature ? '⭐' : '🍴'}</div>
                  <div style={{ fontWeight: 600 }}>{d.name} {d.isSignature && <Tag color="red">招牌</Tag>}</div>
                  <div style={{ color: '#E85D2F', fontWeight: 700 }}>¥{d.price}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>{d.description}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      <Card title="餐位时段" style={{ marginTop: 16, borderRadius: 12 }}>
        {slots.map((s: any) => (
          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span>{s.name}</span>
            <span style={{ color: '#E85D2F', fontWeight: 700 }}>¥{s.price}/位</span>
          </div>
        ))}
      </Card>
    </div>

    <Modal title="预订餐位" open={bookingOpen} onCancel={() => setBookingOpen(false)} footer={null}>
      <Form layout="vertical" onFinish={async (values) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) { message.warning('请先登录'); return; }
          await api.post('/restaurants/booking', {
            slotId: values.slotId, date: values.date?.format('YYYY-MM-DD'),
            guests: values.guests, merchantId: restaurant.merchantId,
            contactName: values.contactName, contactPhone: values.contactPhone,
          }, { headers: { Authorization: 'Bearer ' + token } });
          message.success('预订成功！已生成订单');
          setBookingOpen(false);
          setTimeout(() => window.location.href = '/orders', 1000);
        } catch { message.error('预订失败，请重试'); }
      }}>
        <Form.Item label="预订日期" name="date" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
        <Form.Item label="用餐时段" name="slotId" rules={[{ required: true }]}>
          <Select options={slots.map((s: any) => ({ label: `${s.name} ¥${s.price}/位`, value: s.id }))} />
        </Form.Item>
        <Form.Item label="用餐人数" name="guests" rules={[{ required: true }]}><InputNumber min={1} max={50} style={{ width: '100%' }} /></Form.Item>
        <Form.Item label="联系人" name="contactName" rules={[{ required: true, message: '请输入联系人姓名' }]}><Input placeholder="您的姓名" /></Form.Item>
        <Form.Item label="联系电话" name="contactPhone" rules={[{ required: true, message: '请输入联系电话' }]}><Input placeholder="手机号码" /></Form.Item>
        <Button type="primary" htmlType="submit" block style={{ background: '#1F5FA8' }}>提交预订</Button>
      </Form>
    </Modal>
  </>);
};

export default RestaurantDetail;
