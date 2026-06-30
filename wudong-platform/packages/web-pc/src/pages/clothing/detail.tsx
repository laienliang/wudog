import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Tag, Spin, Divider, List, Rate, InputNumber, message, Image, Space, Typography, Empty } from 'antd';
import { ShoppingCartOutlined, ThunderboltOutlined, HeartOutlined, HeartFilled, StarFilled } from '@ant-design/icons';
import { productApi, orderApi } from '../../services/api';

const { Title, Paragraph, Text } = Typography;

const ClothingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [skus, setSkus] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedSku, setSelectedSku] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, skusRes, revRes] = await Promise.all([
        productApi.detail(Number(id)),
        productApi.skus(Number(id)),
        productApi.reviews(Number(id), { page: 1, pageSize: 5 }),
      ]);
      setProduct(prodRes.data?.data || prodRes.data);
      const skuData = skusRes.data?.data || skusRes.data || [];
      setSkus(skuData);
      if (skuData.length > 0) setSelectedSku(skuData[0]);
      setReviews(revRes.data?.data?.list || revRes.data?.data || revRes.data || []);
    } catch (e) { message.error('加载失败'); }
    setLoading(false);

    // 数据加载完成后，检查收藏状态
    const favIds: number[] = JSON.parse(localStorage.getItem('wudong_favorites') || '[]');
    setFavorited(favIds.includes(Number(id)));
  };

  const addToCart = () => {
    if (!selectedSku) { message.warning('请选择规格'); return; }
    const cart = JSON.parse(localStorage.getItem('wudong_cart') || '[]');
    const idx = cart.findIndex((item: any) => item.skuId === selectedSku.id);
    if (idx >= 0) {
      cart[idx].quantity += quantity;
    } else {
      cart.push({
        productId: product.id, skuId: selectedSku.id, name: product.name,
        price: selectedSku.price || product.price, image: product.mainImage, quantity,
      });
    }
    localStorage.setItem('wudong_cart', JSON.stringify(cart));
    message.success('已加入购物车');
  };

  const buyNow = () => {
    if (!selectedSku) { message.warning('请选择规格'); return; }
    // 跳转到订单创建（需要登录）
    const token = localStorage.getItem('token');
    if (!token) { message.warning('请先登录'); navigate('/login'); return; }
    // 直接创建订单
    orderApi.create({
      orderType: 'clothing', merchantId: product.merchantId || 1,
      items: [{ productType: 'clothing', productId: product.id, productName: product.name, productImage: product.mainImage, skuId: selectedSku.id, skuName: selectedSku.name, unitPrice: selectedSku.price || product.price, quantity }],
    }).then(() => {
      message.success('下单成功');
    }).catch(() => message.error('下单失败'));
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  if (!product) return <Empty description="商品不存在" style={{ padding: 100 }} />;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Row gutter={[48, 32]}>
        {/* 左侧：主图 */}
        <Col xs={24} md={10}>
          <Image.PreviewGroup>
            <Image
              src={product.mainImage || 'https://via.placeholder.com/500x500?text=暂无图片'}
              style={{ width: '100%', borderRadius: 12 }}
              fallback="https://via.placeholder.com/500x500?text=暂无图片"
            />
          </Image.PreviewGroup>
        </Col>

        {/* 右侧：商品信息 */}
        <Col xs={24} md={14}>
          <Title level={3} style={{ marginBottom: 8 }}>{product.name}</Title>
          {product.subtitle && <Text type="secondary" style={{ fontSize: 14, display: 'block', marginBottom: 16 }}>{product.subtitle}</Text>}

          <div style={{ background: '#FFF1EA', borderRadius: 8, padding: '16px 20px', marginBottom: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#E85D2F' }}>
              ¥{selectedSku?.price || product.price}
              {product.marketPrice && <span style={{ fontSize: 14, color: '#BFBFBF', textDecoration: 'line-through', marginLeft: 12 }}>¥{product.marketPrice}</span>}
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#8C8C8C' }}>
              <span style={{ marginRight: 20 }}><StarFilled style={{ color: '#FAAD14' }} /> {product.rating || 5.0} 分</span>
              <span>已售 {product.sales || 0} 件</span>
            </div>
          </div>

          {/* SKU 选择 */}
          {skus.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: '#595959', marginBottom: 8 }}>规格选择：</div>
              <Space wrap>
                {skus.map((sku: any) => (
                  <Tag
                    key={sku.id}
                    color={selectedSku?.id === sku.id ? '#1F5FA8' : 'default'}
                    style={{ padding: '4px 16px', fontSize: 14, cursor: 'pointer', borderRadius: 4 }}
                    onClick={() => setSelectedSku(sku)}
                  >{sku.name}</Tag>
                ))}
              </Space>
            </div>
          )}

          {/* 数量 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ color: '#595959' }}>数量：</span>
            <InputNumber min={1} max={999} value={quantity} onChange={v => setQuantity(v || 1)} />
          </div>

          {/* 按钮 */}
          <Space size={16}>
            <Button type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={addToCart} style={{ height: 44, borderRadius: 8, background: '#1F5FA8' }}>
              加入购物车
            </Button>
            <Button size="large" icon={<ThunderboltOutlined />} onClick={buyNow} style={{ height: 44, borderRadius: 8, borderColor: '#E85D2F', color: '#E85D2F' }}>
              立即购买
            </Button>
            <Button
              type="text"
              size="large"
              icon={favorited ? <HeartFilled style={{ color: '#FF4D4F' }} /> : <HeartOutlined />}
              onClick={() => {
                let favIds: number[] = JSON.parse(localStorage.getItem('wudong_favorites') || '[]');
                const pid = product.id;
                if (favorited) {
                  favIds = favIds.filter((fid: number) => fid !== pid);
                } else {
                  if (!favIds.includes(pid)) favIds.push(pid);
                }
                localStorage.setItem('wudong_favorites', JSON.stringify(favIds));
                setFavorited(!favorited);
              }}
              style={{ fontSize: 20 }}
            />
          </Space>
        </Col>
      </Row>

      {/* 工艺介绍 + 传承人信息 */}
      <Row gutter={[24, 24]} style={{ marginTop: 40 }}>
        <Col span={24}>
          <Card title="工艺介绍" style={{ borderRadius: 12 }}>
            <Paragraph>{product.craftDescription || product.description || '暂无介绍'}</Paragraph>
          </Card>
        </Col>
      </Row>

      {/* 评价列表 */}
      <div style={{ marginTop: 40 }}>
        <Title level={4}>商品评价</Title>
        {reviews.length === 0 ? (
          <Empty description="暂无评价" />
        ) : (
          <List
            dataSource={reviews}
            renderItem={(item: any) => (
              <List.Item>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <Rate disabled value={item.rating} style={{ fontSize: 14 }} />
                    <span style={{ fontSize: 12, color: '#8C8C8C' }}>{item.createdAt}</span>
                  </div>
                  <Paragraph style={{ margin: 0 }}>{item.content}</Paragraph>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ClothingDetail;
