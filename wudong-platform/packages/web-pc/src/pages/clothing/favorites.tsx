import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Empty, message, Button } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../services/api';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从 localStorage 读取收藏的商品ID列表（去重）
    const favIds: number[] = [...new Set(JSON.parse(localStorage.getItem('wudong_favorites') || '[]'))];
    if (favIds.length === 0) { setLoading(false); return; }

    // 逐个获取商品详情
    Promise.allSettled(favIds.map((id: number) => productApi.detail(id)))
      .then(results => {
        const list = results
          .filter((r: any) => r.status === 'fulfilled')
          .map((r: any) => r.value.data?.data || r.value.data)
          .filter(Boolean);
        setProducts(list);
      })
      .catch(() => message.error('加载失败'))
      .finally(() => setLoading(false));
  }, []);

  const removeFavorite = (id: number) => {
    const favIds = JSON.parse(localStorage.getItem('wudong_favorites') || '[]');
    const updated = favIds.filter((fid: number) => fid !== id);
    localStorage.setItem('wudong_favorites', JSON.stringify(updated));
    setProducts(products.filter(p => p.id !== id));
    message.success('已取消收藏');
  };

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Empty description="还没有收藏的商品" />
        <Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/clothing')}>去逛逛</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <h2 style={{ marginBottom: 24 }}>❤️ 我的收藏</h2>
      <Row gutter={[16, 24]}>
        {products.map((p: any) => (
          <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
            <Card
              hoverable
              cover={<div style={{ height: 200, background: '#f5f5f5' }}><img alt={p.name} src={p.mainImage || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
              onClick={() => navigate(`/clothing/${p.id}`)}
              actions={[<HeartOutlined key="remove" style={{ color: '#FF4D4F' }} onClick={(e) => { e.stopPropagation(); removeFavorite(p.id); }} />]}
            >
              <Card.Meta title={p.name} description={<span style={{ color: '#E85D2F', fontSize: 18, fontWeight: 700 }}>¥{p.price}</span>} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FavoritesPage;
