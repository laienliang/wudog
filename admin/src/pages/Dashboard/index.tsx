import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { HomeOutlined, AppstoreOutlined, ShoppingCartOutlined, StarOutlined } from '@ant-design/icons';
import { getHomestays } from '../../api/lodging';
import { get } from '../../utils/request';

export default function DashboardPage() {
  const [stats, setStats] = useState({ homestay: 0, room: 0, order: 0, review: 0 });

  useEffect(() => {
    (async () => {
      const [hs, rm, od, rv] = await Promise.allSettled([
        getHomestays({ page: 1, pageSize: 1 }),
        get('/api/lodging/rooms', { page: 1, pageSize: 1 }),
        get('/api/lodging/orders', { page: 1, pageSize: 1 }),
        get('/api/lodging/reviews', { page: 1, pageSize: 1 }),
      ]);
      setStats({
        homestay: hs.status === 'fulfilled' ? (hs.value as any)?.total || 0 : 0,
        room: rm.status === 'fulfilled' ? (rm.value as any)?.total || 0 : 0,
        order: od.status === 'fulfilled' ? (od.value as any)?.total || 0 : 0,
        review: rv.status === 'fulfilled' ? (rv.value as any)?.total || 0 : 0,
      });
    })();
  }, []);

  return (
    <div>
      <h2>仪表盘</h2>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="民宿总数" value={stats.homestay} prefix={<HomeOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="房型总数" value={stats.room} prefix={<AppstoreOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="订单总数" value={stats.order} prefix={<ShoppingCartOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="评价总数" value={stats.review} prefix={<StarOutlined />} /></Card>
        </Col>
      </Row>
    </div>
  );
}
