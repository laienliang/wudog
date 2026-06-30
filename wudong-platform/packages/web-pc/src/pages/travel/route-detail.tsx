import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Tag, Typography, Button, Image, Skeleton, message, Space, InputNumber } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const api = axios.create({ baseURL: '/api/v1' });
const C = { primary: '#1F5FA8', price: '#E85D2F' };

const HIGHLIGHTS = ['🏞️ 精选景区', '🥘 含特色餐', '🚌 专车接送', '🎫 门票全含', '👨‍🏫 专业导游'];

const RouteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [people, setPeople] = useState(1);
  const [travelDate, setTravelDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    api.get(`/routes/${id}`).then(r => setRoute(r.data?.data || r.data))
      .catch(() => { message.error('加载失败'); navigate('/travel'); })
      .finally(() => setLoading(false));
  }, [id]);

  const parseItinerary = () => {
    if (!route?.itinerary) return [];
    if (Array.isArray(route.itinerary)) return route.itinerary;
    try { return JSON.parse(route.itinerary); } catch { return []; }
  };

  const highlightText = (text: string) => {
    const keywords = ['梯田景区', '博物馆', '古村落', '吊脚楼', '长桌宴', '蜡染', '银饰', '苗寨'];
    let result = text;
    for (const kw of keywords) {
      result = result.split(kw).join(`@@BOLD@@${kw}@@END@@`);
    }
    const parts = result.split('@@END@@');
    return parts.map((part, i) => {
      if (part.includes('@@BOLD@@')) {
        const [before, word] = part.split('@@BOLD@@');
        return <span key={i}>{before}<Text strong style={{ color: C.primary }}>{word}</Text></span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Skeleton active paragraph={{ rows: 6 }} /></div>;
  if (!route) return null;

  const itinerary = parseItinerary();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 60px' }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/travel')} style={{ padding: 0, marginBottom: 16, color: '#666' }}>返回列表</Button>

      {/* ===== Hero Section（等高布局） ===== */}
      <Row gutter={[40, 24]}>
        <Col xs={24} md={11}>
          <div style={{ width: '100%', maxWidth: 500, aspectRatio: '100/115', borderRadius: 12, overflow: 'hidden', background: '#f5f5f5' }}>
            <img src={route.coverImage} alt={route.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { (e.target as HTMLImageElement).src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='; }} />
          </div>
        </Col>
        <Col xs={24} md={13}>
          <Title style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3 }}>{route.name}</Title>

          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <Tag color="blue" style={{ borderRadius: 4, fontSize: 13, padding: '2px 12px' }}>{route.duration}</Tag>
            <Tag color="orange" style={{ borderRadius: 4, fontSize: 13, padding: '2px 12px' }}>最多 {route.maxPeople} 人</Tag>
          </div>

          {/* 价格 */}
          <div style={{ margin: '16px 0' }}>
            <Text style={{ color: C.price, fontSize: 32, fontWeight: 700 }}>¥{Number(route.price).toFixed(2)}</Text>
            <Text style={{ fontSize: 14, color: '#BFBFBF', marginLeft: 4 }}>/人</Text>
          </div>

          {/* 亮点标签 */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {HIGHLIGHTS.slice(0, 4).map((h, i) => (
              <span key={i} style={{ padding: '4px 14px', borderRadius: 20, background: '#F0F5FF', color: '#1F5FA8', fontSize: 13, fontWeight: 500 }}>{h}</span>
            ))}
          </div>

          {/* 简介 */}
          <Card style={{ borderRadius: 10, background: '#FAFAFA', border: '1px solid #F0F0F0' }} styles={{ body: { padding: '14px 18px' } }}>
            <Text style={{ color: '#595959', fontSize: 14, lineHeight: 1.8 }}>{route.description || '暂无介绍'}</Text>
          </Card>

          {/* 费用包含 */}
          <Card style={{ borderRadius: 10, marginTop: 12, background: '#FFFBE6', border: '1px solid #FFE58F' }} styles={{ body: { padding: '12px 18px' } }}>
            <Text strong style={{ fontSize: 13, color: '#8C6B00' }}>💰 费用包含</Text>
            <div style={{ fontSize: 12, color: '#8C6B00', marginTop: 4, lineHeight: 1.6 }}>
              景区门票 · 特色餐食 · 专业导游服务 · 全程专车接送 · 旅游保险
            </div>
          </Card>

          {/* 预订选择 */}
          <Card style={{ borderRadius: 10, marginTop: 16, border: '1px solid #E8E8E8' }} styles={{ body: { padding: '16px 18px' } }}>
            <div style={{ marginBottom: 12 }}>
              <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>出发日期</Text>
              <input type="date" value={travelDate}
                min={new Date().toISOString().slice(0, 10)}
                style={{ padding: '6px 12px', border: '1px solid #D9D9D9', borderRadius: 6, fontSize: 14, width: '100%' }}
                onChange={e => setTravelDate(e.target.value)} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>预订人数</Text>
              <Space>
                <Button type="text" size="small" onClick={() => setPeople(Math.max(1, people - 1))} disabled={people <= 1}>−</Button>
                <Text strong style={{ width: 32, textAlign: 'center', fontSize: 16 }}>{people}</Text>
                <Button type="text" size="small" onClick={() => setPeople(Math.min(route.maxPeople || 99, people + 1))} disabled={people >= (route.maxPeople || 99)}>+</Button>
                <Text type="secondary" style={{ fontSize: 12, marginLeft: 4 }}>最多 {route.maxPeople} 人</Text>
              </Space>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F0F0F0' }}>
              <div>
                <Text style={{ fontSize: 12, color: '#8C8C8C' }}>合计 </Text>
                <Text style={{ color: C.price, fontSize: 22, fontWeight: 700 }}>¥{(Number(route.price) * people).toFixed(2)}</Text>
                <Text style={{ fontSize: 12, color: '#BFBFBF', marginLeft: 4 }}>{people} 人</Text>
              </div>
              <Button type="primary" size="large" icon={<ShoppingCartOutlined />}
                onClick={async () => {
                  try {
                    const res = await api.post('/orders', {
                      orderType: 'travel', merchantId: 1,
                      items: [{ productType: 'route', productId: route.id, productName: route.name, productImage: route.coverImage || '', unitPrice: Number(route.price), quantity: people }],
                      remark: route.name + ' ' + travelDate + ' ' + people + '人',
                    });
                    message.success('预订成功！已跳转至订单页');
                    navigate('/orders');
                  } catch { message.error('预订失败，请重试'); }
                }}
                style={{ height: 42, borderRadius: 8, fontSize: 15, fontWeight: 600, background: C.primary, borderColor: C.primary, paddingInline: 24 }}>
                立即预订
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ===== 行程安排（垂直时间轴） ===== */}
      <Card title={<span style={{ fontSize: 17, fontWeight: 600 }}>📋 详细行程</span>} style={{ marginTop: 32, borderRadius: 12 }}>
        {itinerary.length > 0 ? itinerary.map((day: any, i: number) => (
          <div key={i}>
            {/* 第X天标题 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, marginTop: i > 0 ? 36 : 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>{day.day || i + 1}</div>
              <Text strong style={{ fontSize: 17, color: '#1A1A1A' }}>{day.title || ''}</Text>
              {day.meal && <Tag color="default" style={{ borderRadius: 4, fontSize: 11, marginLeft: 4 }}>🍽️ {day.meal}</Tag>}
            </div>

            {/* 景点标签 */}
            {day.spots?.length > 0 && (
              <Space style={{ marginBottom: 16, marginLeft: 48 }} wrap>
                {day.spots.map((s: string, j: number) => <Tag key={j} color="blue" style={{ borderRadius: 4, fontSize: 12, padding: '2px 10px' }}>📍 {s}</Tag>)}
              </Space>
            )}

            {/* 时间轴 */}
            <div style={{ marginLeft: 48 }}>
              {(day.description || '').split('\n').filter(Boolean).map((line: string, k: number) => {
                const match = line.match(/^【([0-9:]+-[0-9:]+)】/);
                const time = match ? match[1] : null;
                const content = time ? line.replace(/^【[^】]+】/, '') : line;
                return (
                  <div key={k} style={{ display: 'flex', position: 'relative', paddingBottom: 16 }}>
                    {/* 左侧时间 */}
                    <div style={{ width: 80, flexShrink: 0, textAlign: 'right', paddingRight: 16 }}>
                      {time && <Text style={{ fontSize: 12, color: '#BFBFBF', fontWeight: 500 }}>{time}</Text>}
                    </div>
                    {/* 竖线+圆点 */}
                    <div style={{ width: 20, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: time ? C.primary : '#E8E8E8', zIndex: 1, flexShrink: 0 }} />
                      {k < day.description.split('\n').filter(Boolean).length - 1 && (
                        <div style={{ width: 2, flex: 1, background: time ? '#E8F0FF' : '#F5F5F5', marginTop: 4 }} />
                      )}
                    </div>
                    {/* 右侧内容 */}
                    <div style={{ flex: 1, paddingTop: -4 }}>
                      <Text style={{ fontSize: 14, color: '#595959', lineHeight: 1.8 }}>{highlightText(content)}</Text>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 小贴士 */}
            {day.tips && (
              <div style={{ marginTop: 8, marginLeft: 48, padding: '10px 14px', background: '#FFFBE6', borderRadius: 8, border: '1px solid #FFE58F' }}>
                <Text style={{ fontSize: 12, color: '#8C6B00' }}>💡 {day.tips}</Text>
              </div>
            )}
          </div>
        )) : <Text type="secondary">暂无详细行程安排</Text>}
      </Card>
    </div>
  );
};

export default RouteDetail;
