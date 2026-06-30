import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Skeleton, Empty, message, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { StarFilled } from '@ant-design/icons';
import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

const FoodPage: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, pRes, cRes] = await Promise.all([
        api.get('/restaurants'),
        api.get('/food-products'),
        api.get('/food-categories'),
      ]);
      setRestaurants(rRes.data?.data?.list || []);
      setProducts(pRes.data?.data?.list || []);
      setCategories(cRes.data?.data || cRes.data || []);
    } catch { message.error('加载失败'); }
    setLoading(false);
  };

  const filtered = activeCat ? products.filter((p: any) => p.categoryId === activeCat) : products;

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Skeleton active paragraph={{ rows: 4 }} /></div>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Tabs defaultActiveKey="restaurants" items={[
        {
          key: 'restaurants', label: '🍽️ 餐厅美食',
          children: restaurants.length === 0 ? <Empty description="暂无餐厅" /> : (
            <Row gutter={[16, 24]}>
              {restaurants.map((r: any) => (
                <Col xs={24} sm={12} md={8} key={r.id}>
                  <Card hoverable onClick={() => navigate(`/food/restaurant/${r.id}`)}
                    style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    cover={<div style={{ height: 200, background: '#f5f5f5' }}><img src={r.coverImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}>
                    <Card.Meta title={r.name} description={<span><StarFilled style={{ color: '#FAAD14' }} /> {r.rating} · {r.address}</span>} />
                  </Card>
                </Col>
              ))}
            </Row>
          ),
        },
        {
          key: 'products', label: '🛒 农产品特产',
          children: <>
            <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Tag color={activeCat === null ? '#1F5FA8' : 'default'} style={{ cursor: 'pointer', padding: '4px 12px' }} onClick={() => setActiveCat(null)}>全部分类</Tag>
              {categories.map((c: any) => (
                <Tag key={c.id} color={activeCat === c.id ? '#1F5FA8' : 'default'} style={{ cursor: 'pointer', padding: '4px 12px' }} onClick={() => setActiveCat(Number(c.id))}>{c.name}</Tag>
              ))}
            </div>
            {filtered.length === 0 ? <Empty description="暂无商品" /> : (
              <Row gutter={[16, 24]}>
                {filtered.map((p: any) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
                    <Card hoverable onClick={() => navigate(`/food/product/${p.id}`)}
                      style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                      cover={<div style={{ height: 200, background: '#f5f5f5' }}><img src={p.mainImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}>
                      <Card.Meta title={p.name} description={<span style={{ color: '#E85D2F', fontSize: 18, fontWeight: 700 }}>¥{p.price} <span style={{ fontSize: 12, color: '#999', fontWeight: 400 }}>/ {p.unit}</span></span>} />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </>,
        },
      ]} />
    </div>
  );
};

export default FoodPage;
