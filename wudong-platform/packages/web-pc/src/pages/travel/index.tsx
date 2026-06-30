import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Skeleton, Empty, message, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { StarFilled } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;
const api = axios.create({ baseURL: '/api/v1' });

const TravelPage: React.FC = () => {
  const navigate = useNavigate();
  const [scenicSpots, setScenicSpots] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, rRes] = await Promise.all([
        api.get('/scenic-spots'),
        api.get('/routes'),
      ]);
      setScenicSpots(sRes.data?.data?.list || []);
      setRoutes(rRes.data?.data?.list || []);
    } catch { message.error('加载失败'); }
    setLoading(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Skeleton active paragraph={{ rows: 4 }} /></div>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Tabs defaultActiveKey="scenic" items={[
        {
          key: 'scenic', label: '🏔️ 景区门票',
          children: scenicSpots.length === 0 ? <Empty description="暂无景区" /> : (
            <Row gutter={[16, 24]}>
              {scenicSpots.map((s: any) => (
                <Col xs={24} sm={12} md={8} key={s.id}>
                  <Card hoverable onClick={() => navigate(`/travel/scenic/${s.id}`)}
                    style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    cover={<div style={{ height: 200, background: '#f5f5f5' }}><img src={s.coverImage} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}>
                    <Card.Meta title={s.name} description={
                      <div>
                        <div style={{ marginBottom: 4 }}>
                          <StarFilled style={{ color: '#FAAD14' }} /> <Text style={{ fontSize: 13 }}>{s.rating}</Text>
                        </div>
                        <div style={{ fontSize: 12, color: '#8C8C8C', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</div>
                        <div style={{ fontSize: 12, color: '#8C8C8C' }}>🕒 {s.openingHours}</div>
                      </div>
                    } />
                  </Card>
                </Col>
              ))}
            </Row>
          ),
        },
        {
          key: 'routes', label: '🗺️ 路线套餐',
          children: routes.length === 0 ? <Empty description="暂无路线" /> : (
            <Row gutter={[16, 24]}>
              {routes.map((r: any) => (
                <Col xs={24} sm={12} md={8} key={r.id}>
                  <Card hoverable onClick={() => navigate(`/travel/route/${r.id}`)}
                    style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    cover={<div style={{ height: 200, background: '#f5f5f5' }}><img src={r.coverImage} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}>
                    <Card.Meta title={r.name} description={
                      <div>
                        <div style={{ marginBottom: 4 }}>
                          <Tag color="blue">{r.duration}</Tag>
                          <Text style={{ fontSize: 12, color: '#8C8C8C' }}>最多 {r.maxPeople} 人</Text>
                        </div>
                        <div style={{ color: '#E85D2F', fontSize: 18, fontWeight: 700 }}>
                          ¥{r.price} <Text style={{ fontSize: 12, color: '#999', fontWeight: 400 }}>/人</Text>
                        </div>
                      </div>
                    } />
                  </Card>
                </Col>
              ))}
            </Row>
          ),
        },
      ]} />
    </div>
  );
};

export default TravelPage;
