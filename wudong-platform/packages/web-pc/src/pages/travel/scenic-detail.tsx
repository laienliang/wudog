import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Tag, Typography, Button, Image, Skeleton, message, Space, Rate } from 'antd';
import { StarFilled, ArrowLeftOutlined, ShoppingCartOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const api = axios.create({ baseURL: '/api/v1' });
const C = { primary: '#1F5FA8', price: '#E85D2F' };

const REVIEW_TAGS = ['#风景优美', '#值得推荐', '#干净卫生', '#服务热情', '#交通便利', '#性价比高', '#适合拍照', '#亲子游首选'];

const ScenicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scenic, setScenic] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    Promise.all([
      api.get(`/scenic-spots/${id}`),
      api.get('/accommodation-reviews?page=1&pageSize=10'),
    ]).then(([sRes, rRes]) => {
      setScenic(sRes.data?.data || sRes.data);
      const allReviews = rRes.data?.data?.list || [];
      setReviews(allReviews.filter((r: any) => String(r.product_id) === String(id)).slice(0, 3));
    }).catch(() => { message.error('加载失败'); navigate('/travel'); })
    .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Skeleton active paragraph={{ rows: 6 }} /></div>;
  if (!scenic) return null;

  const tickets = scenic.ticketTypes || [];
  const minPrice = tickets.length ? Math.min(...tickets.map((t: any) => Number(t.price))) : 0;

  const updateQty = (ticketId: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[ticketId] || 0;
      const next = Math.max(0, Math.min(99, current + delta));
      return { ...prev, [ticketId]: next };
    });
  };

  const totalAmount = tickets.reduce((sum: number, t: any) => {
    return sum + (quantities[t.id] || 0) * Number(t.price);
  }, 0);

  const totalCount = Object.values(quantities).reduce((sum: number, q) => sum + q, 0);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/travel')} style={{ padding: 0, marginBottom: 16, color: C.primary }}>返回列表</Button>
      <Row gutter={[48, 32]}>
        {/* 左侧：图片 */}
        <Col xs={24} md={10}>
          <Image src={scenic.coverImage} style={{ width: '100%', borderRadius: 12 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" />
        </Col>

        {/* 右侧：信息区 */}
        <Col xs={24} md={14}>
          <Title level={3} style={{ marginBottom: 8 }}>{scenic.name}</Title>
          <div style={{ background: '#FFF1EA', borderRadius: 8, padding: '16px 20px', marginBottom: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.price }}>
              ¥{minPrice}<span style={{ fontSize: 14, color: '#BFBFBF', fontWeight: 400, marginLeft: 8 }}>起</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#8C8C8C' }}>
              <span style={{ marginRight: 20 }}><StarFilled style={{ color: '#FAAD14' }} /> {scenic.rating} 分</span>
              <span>📍 {scenic.address}</span>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <Tag color="blue" style={{ borderRadius: 4 }}>🕒 {scenic.openingHours}</Tag>
            <Tag color="green" style={{ borderRadius: 4 }}>{scenic.status === 1 ? '营业中' : '已关闭'}</Tag>
          </div>

          {/* 景区介绍 */}
          <Card title="景区介绍" style={{ borderRadius: 12, marginBottom: 16 }} styles={{ body: { padding: 20 } }}>
            <Text style={{ lineHeight: 2, color: '#595959', fontSize: 14 }}>{scenic.description || '暂无介绍'}</Text>
          </Card>

          {/* 预订须知 */}
          <Card title="📋 预订须知" style={{ borderRadius: 12, marginBottom: 16 }}>
            <div style={{ lineHeight: 2.2, fontSize: 13, color: '#595959' }}>
              <div><Text strong>🕐 开放时间：</Text>{scenic.openingHours}</div>
              <div><Text strong>🎫 入园方式：</Text>无需换票，凭二维码直接入园</div>
              <div><Text strong>❌ 退改规则：</Text>未使用随时可退，过期自动退款</div>
              <div><Text strong>📱 电子票：</Text>购买后发送至手机，扫码入园</div>
            </div>
          </Card>

          {/* 日期选择 */}
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>游览日期</Text>
            <input type="date" value={visitDate}
              min={new Date().toISOString().slice(0, 10)}
              max={new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)}
              onChange={e => setVisitDate(e.target.value)}
              style={{ padding: '6px 12px', border: '1px solid #D9D9D9', borderRadius: 6, fontSize: 14, width: 200 }} />
          </div>

          {/* 选择票种（带数量步进器） */}
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 12 }}>选择票种</Text>
            {tickets.length ? tickets.map((t: any) => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 8, border: '1px solid #F0F0F0', marginBottom: 8 }}>
                <div>
                  <Text strong style={{ fontSize: 14 }}>{t.name}</Text>
                  <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 2 }}>
                    <Text style={{ color: C.price, fontWeight: 600 }}>¥{Number(t.price).toFixed(2)}</Text>
                    <Text> · 库存 {t.stock} 张 · {t.validDays || 1}天有效</Text>
                  </div>
                </div>
                <Space>
                  <Button type="text" size="small" icon={<MinusOutlined />} onClick={() => updateQty(t.id, -1)} disabled={!quantities[t.id]} />
                  <Text strong style={{ width: 24, textAlign: 'center', fontSize: 15 }}>{quantities[t.id] || 0}</Text>
                  <Button type="text" size="small" icon={<PlusOutlined />} onClick={() => updateQty(t.id, 1)} />
                </Space>
              </div>
            )) : <Text type="secondary">暂无票种</Text>}
            {/* 预订按钮（始终显示） */}
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#F0F5FF', borderRadius: 10, border: '1px solid #D6E4FF' }}>
              <div>
                <Text style={{ fontSize: 13, color: '#595959' }}>合计 </Text>
                <Text style={{ color: C.price, fontSize: 22, fontWeight: 700 }}>¥{totalAmount.toFixed(2)}</Text>
                <Text style={{ fontSize: 12, color: '#BFBFBF', marginLeft: 4 }}>{totalCount} 张</Text>
              </div>
              <Button type="primary" size="large" icon={<ShoppingCartOutlined />}
                disabled={totalCount === 0}
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  if (!token) { message.warning('请先登录'); return; }
                  try {
                    const orderItems = tickets.filter((t: any) => (quantities[t.id] || 0) > 0).map((t: any) => ({
                      productId: t.id, productName: t.name, quantity: quantities[t.id],
                      unitPrice: t.price, productType: 'ticket',
                      productImage: scenic.coverImage || '',
                    }));
                    const res = await api.post('/orders', {
                      orderType: 'travel', merchantId: 1,
                      items: orderItems,
                      remark: `${scenic.name} 门票 ${visitDate}`,
                    }, { headers: { Authorization: 'Bearer ' + token } });
                    message.success('下单成功！已跳转至订单页');
                    navigate('/orders');
                  } catch { message.error('下单失败'); }
                }}
                style={{ height: 44, borderRadius: 8, fontWeight: 600, fontSize: 15, background: totalCount > 0 ? C.primary : '#BFBFBF', borderColor: totalCount > 0 ? C.primary : '#BFBFBF', paddingInline: 24 }}>
                {totalCount > 0 ? '立即预订' : '请先选择数量'}
              </Button>
            </div>
          </div>

          {/* 游客评价 */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0, color: '#1A1A1A', fontWeight: 600 }}>游客评价</Title>
              <span style={{ fontSize: 13, color: C.primary, cursor: 'pointer' }}>查看全部 →</span>
            </div>
            {reviews.length === 0 ? (
              <Text type="secondary">暂无评价</Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {reviews.map((review, i) => (
                  <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: '#FAFAFA', border: '1px solid #F0F0F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <Space>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1F5FA8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>
                          {(review.user_name || '匿').charAt(0)}
                        </div>
                        <Text style={{ fontSize: 13, fontWeight: 600 }}>{review.user_name || '匿名用户'}</Text>
                      </Space>
                      <Rate disabled value={Number(review.rating)} style={{ fontSize: 12 }} />
                    </div>
                    <Text style={{ fontSize: 13, color: '#595959', lineHeight: 1.7 }}>{review.content}</Text>
                    {i === 0 && (
                      <Space style={{ marginTop: 6 }} size={4}>
                        {REVIEW_TAGS.slice(0, 4).map(tag => (
                          <span key={tag} style={{ padding: '1px 8px', borderRadius: 10, background: '#F0F5FF', color: '#1F5FA8', fontSize: 11 }}>{tag}</span>
                        ))}
                      </Space>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>
      </Row>

      <div style={{ height: 20 }}></div>
    </div>
  );
};

export default ScenicDetail;
