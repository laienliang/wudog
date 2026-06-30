import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Empty, message, Button, InputNumber, Space, Typography, Divider, Row, Col, Rate, List } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const api = axios.create({ baseURL: '/api/v1' });

const FoodProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => { if (id) fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [pRes, rRes] = await Promise.all([
        api.get(`/food-products/${id}`),
        api.get(`/products/${id}/reviews`),
      ]);
      const prod = pRes.data?.data || pRes.data;
      setProduct(prod);
      const revData = rRes.data?.data?.list || rRes.data?.data || rRes.data || [];
      setReviews(Array.isArray(revData) ? revData : []);
      // 加载推荐商品（同分类优先）
      const recRes = await api.get(`/food-products?page=1&pageSize=20`);
      const all = recRes.data?.data?.list || [];
      let recs = all.filter((p: any) => String(p.id) !== String(id));
      recs.sort((a: any, b: any) => {
        const aSame = a.categoryId === prod?.categoryId ? 0 : 1;
        const bSame = b.categoryId === prod?.categoryId ? 0 : 1;
        return aSame - bSame;
      });
      setRelated(recs.slice(0, 4));
    } catch { message.error('加载失败'); }
    setLoading(false);
  };

  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('wudong_cart') || '[]');
    const idx = cart.findIndex((item: any) => item.productId === product.id && item.productType === 'food');
    if (idx >= 0) cart[idx].quantity += quantity;
    else cart.push({ productId: product.id, productType: 'food', name: product.name, price: product.price, image: product.mainImage, quantity, unit: product.unit });
    localStorage.setItem('wudong_cart', JSON.stringify(cart));
    message.success('已加入购物车');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  if (!product) return <Empty description="商品不存在" style={{ padding: 80 }} />;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      {/* 商品信息 */}
      <Card style={{ borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          <img src={product.mainImage} alt={product.name} style={{ width: 400, height: 400, objectFit: 'cover', borderRadius: 12 }}
            onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="%23f5f5f5"/%3E'; }} />
          <div style={{ flex: 1 }}>
            <Title level={3}>{product.name}</Title>
            <div style={{ background: '#FFF1EA', borderRadius: 8, padding: '16px 20px', marginBottom: 16 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: '#E85D2F' }}>¥{product.price}</span>
              <span style={{ fontSize: 14, color: '#999', marginLeft: 8 }}>/ {product.unit}</span>
              <span style={{ marginLeft: 24, fontSize: 13, color: '#8C8C8C' }}>库存: {product.stock}</span>
            </div>
            {product.description && <Paragraph style={{ color: '#595959', fontSize: 15, lineHeight: 1.8 }}>{product.description}</Paragraph>}
            <Divider />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span>数量：</span>
              <InputNumber min={1} max={product.stock || 999} value={quantity} onChange={v => setQuantity(v || 1)} />
              <span style={{ fontSize: 12, color: '#999' }}>{product.stock} {product.unit}</span>
            </div>
            <Button type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={addToCart} style={{ height: 44, borderRadius: 8, background: '#1F5FA8' }}>加入购物车</Button>
          </div>
        </div>
      </Card>

      {/* 评价区 */}
      {reviews.length > 0 && (
        <Card title="💬 商品评价" style={{ marginTop: 16, borderRadius: 12 }}>
          <List dataSource={reviews} renderItem={(item: any) => (
            <List.Item>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Rate disabled value={item.rating} style={{ fontSize: 13 }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.user_name || '匿名'}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</Text>
                </div>
                <Paragraph style={{ margin: 0, color: '#595959' }}>{item.content}</Paragraph>
              </div>
            </List.Item>
          )} />
        </Card>
      )}

      {/* 推荐商品 */}
      {related.length > 0 && (
        <Card title="🛒 同分类推荐" style={{ marginTop: 16, borderRadius: 12 }}>
          <Row gutter={[16, 16]}>
            {related.map((p: any) => (
              <Col xs={12} sm={8} md={6} key={p.id}>
                <Card hoverable onClick={() => navigate(`/food/product/${p.id}`)}
                  style={{ borderRadius: 8, overflow: 'hidden' }}
                  bodyStyle={{ padding: '10px 12px' }}>
                  <img src={p.mainImage} alt={p.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4 }}
                    onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="%23f5f5f5"/%3E'; }} />
                  <div style={{ marginTop: 8, fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ color: '#E85D2F', fontWeight: 700, fontSize: 15 }}>¥{p.price} <span style={{ fontSize: 11, color: '#999', fontWeight: 400 }}>/ {p.unit}</span></div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
};

export default FoodProductDetail;
