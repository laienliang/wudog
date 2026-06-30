import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Spin, Tag, Empty, Typography, Image, Tabs } from 'antd';
import { ShoppingOutlined, DollarOutlined, StarOutlined, OrderedListOutlined, ShopOutlined, HomeOutlined, CompassOutlined, CoffeeOutlined, FireOutlined } from '@ant-design/icons';
import { productApi, orderApi } from '../../services/api';
import axios from 'axios';

const { Text } = Typography;
const COLORS = { primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838', danger: '#D94A4A', textSecondary: '#8C8C8C', price: '#E85D2F' };
const api = axios.create({ baseURL: '/api/v1' });

/* ============================================================
   全模块数据统计
   ============================================================ */
const AllStats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    Promise.all([
      productApi.list({ page: 1, pageSize: 100 }),
      orderApi.list({ page: 1, pageSize: 100 }),
      api.get('/food-products?page=1&pageSize=100'),
      api.get('/room-types/all'),
      api.get('/ticket-types/all'),
      api.get('/restaurants/all'),
      api.get('/homestays/all'),
      api.get('/scenic-spots/all'),
    ]).then(([pRes, oRes, fRes, rRes, tRes, restRes, hRes, sRes]) => {
      const products = pRes.data?.list || pRes.data?.data?.list || [];
      const orders = oRes.data?.list || oRes.data?.data?.list || [];
      const foods = fRes.data?.data?.list || fRes.data?.list || [];
      const roomTypes = Array.isArray(rRes.data?.data) ? rRes.data.data : (Array.isArray(rRes.data) ? rRes.data : []);
      const tickets = Array.isArray(tRes.data?.data) ? tRes.data.data : (Array.isArray(tRes.data) ? tRes.data : []);
      const restaurants = Array.isArray(restRes.data?.data) ? restRes.data.data : (Array.isArray(restRes.data) ? restRes.data : []);
      const homestays = Array.isArray(hRes.data?.data) ? hRes.data.data : (Array.isArray(hRes.data) ? hRes.data : []);
      const scenicSpots = Array.isArray(sRes.data?.data) ? sRes.data.data : (Array.isArray(sRes.data) ? sRes.data : []);

      const paid = orders.filter((o: any) => ['paid', 'confirmed', 'completed'].includes(o.status));
      const totalSales = paid.reduce((s: number, o: any) => s + Number(o.payAmount || 0), 0);

      setData({
        products: products.length, orders: orders.length, sales: totalSales,
        foods: foods.length, roomTypes: roomTypes.length, tickets: tickets.length,
        restaurants: restaurants.length, homestays: homestays.length, scenicSpots: scenicSpots.length,
        topProducts: [...products].sort((a: any, b: any) => (b.sales || 0) - (a.sales || 0)).slice(0, 5),
        topFoods: [...foods].sort((a: any, b: any) => (b.stock || 0) - (a.stock || 0)).slice(0, 5),
        topRoomTypes: [...roomTypes].sort((a: any, b: any) => (b.quantity || 0) - (a.quantity || 0)).slice(0, 5),
        topTickets: [...tickets].sort((a: any, b: any) => (b.price || 0) - (a.price || 0)).slice(0, 5),
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>;

  const cardStyle = { borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };

  return (
    <div style={{ padding: 0 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {[
          { t: '商品数', v: data.products, icon: <ShoppingOutlined />, c: COLORS.primary, bg: '#E8F4FD' },
          { t: '餐厅数', v: data.restaurants, icon: <CoffeeOutlined />, c: COLORS.warning, bg: '#FFF7E6' },
          { t: '民宿数', v: data.homestays, icon: <HomeOutlined />, c: COLORS.success, bg: '#EDF7ED' },
          { t: '景区数', v: data.scenicSpots, icon: <CompassOutlined />, c: '#9B59B6', bg: '#F4F0FF' },
        ].map(item => (
          <Col xs={12} md={6} key={item.t}>
            <Card hoverable style={cardStyle}>
              <Statistic title={<Text type="secondary" style={{ fontSize: 13 }}>{item.t}</Text>} value={item.v}
                prefix={<span style={{ width: 36, height: 36, borderRadius: 8, background: item.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: item.c, marginRight: 10 }}>{item.icon}</span>}
                valueStyle={{ color: item.c, fontWeight: 700, fontSize: 24 }} />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {[
          { t: '农产品数', v: data.foods, icon: <CoffeeOutlined />, c: COLORS.success, bg: '#EDF7ED' },
          { t: '房型数', v: data.roomTypes, icon: <HomeOutlined />, c: COLORS.primary, bg: '#E8F4FD' },
          { t: '票种数', v: data.tickets, icon: <OrderedListOutlined />, c: COLORS.warning, bg: '#FFF7E6' },
          { t: '总销售额', v: data.sales, icon: <DollarOutlined />, c: COLORS.price, bg: '#FFF1F0', p: 2, s: '¥' },
        ].map((item: any) => (
          <Col xs={12} md={6} key={item.t}>
            <Card hoverable style={cardStyle}>
              <Statistic title={<Text type="secondary" style={{ fontSize: 13 }}>{item.t}</Text>} value={item.v} precision={item.p} suffix={item.s}
                prefix={<span style={{ width: 36, height: 36, borderRadius: 8, background: item.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: item.c, marginRight: 10 }}>{item.icon}</span>}
                valueStyle={{ color: item.c, fontWeight: 700, fontSize: 24 }} />
            </Card>
          </Col>
        ))}
      </Row>
      <Card style={cardStyle} styles={{ body: { padding: 0 } }}>
        <div style={{ padding: '16px 24px 0', fontWeight: 600, fontSize: 14 }}>🔥 热销 Top5</div>
        <Tabs defaultActiveKey="clothing" style={{ margin: 0, padding: '0 24px' }}
          items={[
            {
              key: 'clothing', label: <span><ShoppingOutlined /> 衣·商品</span>,
              children: <div style={{ padding: '16px 0' }}>
                <Table dataSource={data.topProducts} rowKey="id" pagination={false}
                  locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" /> }}
                  columns={[
                    { title: '#', width: 50, render: (_, __, i) => <Tag style={{ borderRadius: 8, minWidth: 22, textAlign: 'center' }}>{i + 1}</Tag> },
                    { title: '商品', dataIndex: 'name', width: 200, render: (v, r) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {r.mainImage ? <Image src={r.mainImage} width={36} height={36} style={{ borderRadius: 6, objectFit: 'cover' }}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" /> : null}
                        <Text strong>{v}</Text>
                      </div>
                    )},
                    { title: '售价', dataIndex: 'price', align: 'right' as const, render: (v) => <Text style={{ color: COLORS.price, fontWeight: 700 }}>¥{Number(v).toFixed(2)}</Text> },
                    { title: '销量', dataIndex: 'sales', align: 'center' as const, render: (v) => <Text strong>{v}</Text> },
                    { title: '评分', dataIndex: 'rating', align: 'center' as const, render: (v) => <span><StarOutlined style={{ color: '#FAAD14', marginRight: 4 }} />{v}</span> },
                  ]} />
              </div>
            },
            {
              key: 'food', label: <span><CoffeeOutlined /> 食·农产品</span>,
              children: <div style={{ padding: '16px 0' }}>
                <Table dataSource={data.topFoods} rowKey="id" pagination={false}
                  locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" /> }}
                  columns={[
                    { title: '#', width: 50, render: (_, __, i) => <Tag style={{ borderRadius: 8, minWidth: 22, textAlign: 'center' }}>{i + 1}</Tag> },
                    { title: '商品', dataIndex: 'name', width: 200, render: (v, r) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {r.mainImage ? <Image src={r.mainImage} width={36} height={36} style={{ borderRadius: 6, objectFit: 'cover' }}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" /> : null}
                        <Text strong>{v}</Text>
                      </div>
                    )},
                    { title: '价格', dataIndex: 'price', align: 'right' as const, render: (v) => <Text style={{ color: COLORS.price, fontWeight: 700 }}>¥{Number(v).toFixed(2)}</Text> },
                    { title: '库存', dataIndex: 'stock', align: 'center' as const, render: (v) => <Text strong>{v}</Text> },
                    { title: '单位', dataIndex: 'unit', align: 'center' as const, render: (v) => <Text code>{v || '-'}</Text> },
                  ]} />
              </div>
            },
            {
              key: 'accommodation', label: <span><HomeOutlined /> 住·房型</span>,
              children: <div style={{ padding: '16px 0' }}>
                <Table dataSource={data.topRoomTypes} rowKey="id" pagination={false}
                  locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" /> }}
                  columns={[
                    { title: '#', width: 50, render: (_, __, i) => <Tag style={{ borderRadius: 8, minWidth: 22, textAlign: 'center' }}>{i + 1}</Tag> },
                    { title: '房型', dataIndex: 'name', width: 200, render: (v, r) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {r.images?.[0] ? <Image src={r.images[0]} width={36} height={36} style={{ borderRadius: 6, objectFit: 'cover' }}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" /> : null}
                        <Text strong>{v}</Text>
                      </div>
                    )},
                    { title: '床型', dataIndex: 'bedType', align: 'center' as const, render: (v) => v || '-' },
                    { title: '平日价', dataIndex: 'price', align: 'right' as const, render: (v) => <Text style={{ color: COLORS.price, fontWeight: 700 }}>¥{Number(v).toFixed(2)}</Text> },
                    { title: '房量', dataIndex: 'quantity', align: 'center' as const, render: (v) => <Text strong>{v}</Text> },
                  ]} />
              </div>
            },
            {
              key: 'travel', label: <span><CompassOutlined /> 行·门票</span>,
              children: <div style={{ padding: '16px 0' }}>
                <Table dataSource={data.topTickets} rowKey="id" pagination={false}
                  locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" /> }}
                  columns={[
                    { title: '#', width: 50, render: (_, __, i) => <Tag style={{ borderRadius: 8, minWidth: 22, textAlign: 'center' }}>{i + 1}</Tag> },
                    { title: '票种', dataIndex: 'name', width: 200, render: (v) => <Text strong>{v}</Text> },
                    { title: '价格', dataIndex: 'price', align: 'right' as const, render: (v) => <Text style={{ color: COLORS.price, fontWeight: 700 }}>¥{Number(v).toFixed(2)}</Text> },
                    { title: '库存', dataIndex: 'stock', align: 'center' as const, render: (v) => <Text strong>{v ?? '不限'}</Text> },
                    { title: '有效期', dataIndex: 'validDays', align: 'center' as const, render: (v) => v ? `${v}天` : '-' },
                  ]} />
              </div>
            },
          ]}
        />
      </Card>
    </div>
  );
};

/* ============================================================
   主组件
   ============================================================ */
const Statistics: React.FC = () => {
  return <AllStats />;
};

export default Statistics;
