import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, message, Empty, Spin, Space, Typography } from 'antd';
const { Text } = Typography;
import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

const statusMap: Record<string, { color: string; label: string }> = {
  pending_pay: { color: 'orange', label: '待支付' },
  paid: { color: 'blue', label: '已支付' },
  confirmed: { color: 'cyan', label: '已确认' },
  completed: { color: 'green', label: '已完成' },
  cancelled: { color: 'default', label: '已取消' },
  refunded: { color: 'red', label: '已退款' },
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders', { params: { page: 1, pageSize: 50 } });
      setOrders(res.data?.data?.list || []);
    } catch { message.error('加载订单失败'); }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handlePay = async (orderId: number) => {
    try {
      await api.post(`/orders/${orderId}/pay`);
      message.success('支付成功！');
      fetchOrders();
    } catch { message.error('支付失败'); }
  };

  const handleCancel = async (orderId: number) => {
    try {
      await api.post(`/orders/${orderId}/cancel`);
      message.success('已取消');
      fetchOrders();
    } catch { message.error('取消失败'); }
  };
  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;

  const typeConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
    clothing: { icon: "👕", color: "#1F5FA8", bg: "#E8F4FD", label: "商品" },
    food_meal: { icon: "🍽️", color: "#E85D2F", bg: "#FFF1EA", label: "餐位" },
    food_product: { icon: "🛒", color: "#6B8E3D", bg: "#EDF7ED", label: "特产" },
    accommodation: { icon: "🏠", color: "#1F5FA8", bg: "#E8F4FD", label: "住宿" },
    travel: { icon: "🚗", color: "#9B59B6", bg: "#F0E6FF", label: "旅游" },
  };

  const getItemThumb = (record: any) => {
    if (record.orderType === 'food_meal' && (!record.items?.length)) return 'http://localhost:3000/images/restaurant/rest1.jpg';

    const item = record.items?.[0];
    if (item?.productImage) return item.productImage;
    // Fallback: map room type names to images
    const name = item?.productName || '';
    const imgMap: Record<string, string> = {
      '苗族木屋大床房': 'http://localhost:3000/images/room-types/room-1.jpg',
      '苗族木屋双床房': 'http://localhost:3000/images/room-types/room-2.jpg',
      '家庭套房': 'http://localhost:3000/images/room-types/room-3.jpg',
      '梯田全景大床房': 'http://localhost:3000/images/room-types/room-4.jpg',
      '梯田全景双床房': 'http://localhost:3000/images/room-types/room-5.jpg',
      '吊脚楼特色房': 'http://localhost:3000/images/room-types/room-6.jpg',
      '吊脚楼通铺房': 'http://localhost:3000/images/room-types/room-7.jpg',
      '苗绣主题大床房': 'http://localhost:3000/images/room-types/room-8.jpg',
      '苗绣主题双床房': 'http://localhost:3000/images/room-types/room-9.jpg',
      '临溪大床房': 'http://localhost:3000/images/room-types/room-10.jpg',
      '苗绣手提包': 'http://localhost:3000/images/tibao.jpg',
      '苗家腊肉': 'http://localhost:3000/images/food/bacon.jpg',
      '苗寨一日游': 'http://localhost:3000/images/scenic/route-1.jpg',
      '苗寨深度两日游': 'http://localhost:3000/images/scenic/route-2.jpg',
    };
    for (const [key, url] of Object.entries(imgMap)) {
      if (name.includes(key)) return url;
    }
    return null;
  };

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', width: 140, render: (v: string) => <Text copyable style={{ fontSize: 12, fontFamily: 'monospace' }}>{String(v).slice(-12)}</Text> },
    {
      title: '商品', width: 220,
      render: (_: any, r: any) => {
        const item = r.items?.[0];
        const img = getItemThumb(r);
        const name = item?.productName || '-';
        const typeConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
          clothing: { icon: '👕', color: '#1F5FA8', bg: '#E8F4FD', label: '商品' },
          food_meal: { icon: '🍽️', color: '#E85D2F', bg: '#FFF1EA', label: '餐位' },
          food_product: { icon: '🛒', color: '#6B8E3D', bg: '#EDF7ED', label: '特产' },
          accommodation: { icon: '🏠', color: '#1F5FA8', bg: '#E8F4FD', label: '住宿' },
          travel: { icon: '🚗', color: '#9B59B6', bg: '#F0E6FF', label: '旅游' },
        };
        const cfg = typeConfig[r.orderType] || { icon: '📦', color: '#8C8C8C', bg: '#F5F5F5', label: '' };
        return (
          <Space>
            {img ? (
              <img src={img} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid #f0f0f0' }}
                onError={e => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: 6, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{cfg.icon}</div>
            )}
            <div style={{ minWidth: 0 }}>
              <Text style={{ fontSize: 13, fontWeight: 500, display: 'block' }} ellipsis={{ tooltip: name }}>{name}</Text>
              <Text type="secondary" style={{ fontSize: 11 }}>{cfg.label}</Text>
            </div>
          </Space>
        );
      },
    },
    { title: '金额', dataIndex: 'payAmount', width: 90, align: 'right', render: (v: number) => <span style={{ color: '#E85D2F', fontWeight: 700, fontSize: 15 }}>¥{Number(v).toFixed(2)}</span> },
    {
      title: '状态', dataIndex: 'status', width: 80, align: 'center',
      render: (v: string) => <Tag color={statusMap[v]?.color} style={{ borderRadius: 4, fontSize: 11, lineHeight: '20px' }}>{statusMap[v]?.label || v}</Tag>,
    },
    { title: '时间', dataIndex: 'createdAt', width: 90, render: (v: string) => <Text type="secondary" style={{ fontSize: 11 }}>{String(v).slice(0, 10)}</Text> },
    {
      title: '操作', width: 180,
      render: (_: any, record: any) => (
        <>
          {record.status === 'pending_pay' && (
            <Space>
              <Button type="primary" size="middle" onClick={() => handlePay(record.id)}
                style={{ background: '#52c41a', borderColor: '#52c41a', fontWeight: 600, borderRadius: 6, height: 36, paddingInline: 20 }}>
                💳 去支付
              </Button>
              <Button size="small" onClick={() => handleCancel(record.id)}>取消</Button>
            </Space>
          )}
          {record.status === 'paid' && <Tag color="green" style={{ padding: '4px 12px' }}>✅ 已支付</Tag>}
          {record.status === 'completed' && <Tag color="green" style={{ padding: '4px 12px' }}>✅ 已完成</Tag>}
          {record.status === 'cancelled' && <Tag style={{ padding: '4px 12px' }}>已取消</Tag>}
          {record.status === 'confirmed' && <Tag color="blue" style={{ padding: '4px 12px' }}>已确认</Tag>}
        </>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
      <h2 style={{ marginBottom: 16 }}>📋 我的订单</h2>
      <Table dataSource={orders} columns={columns} rowKey="id" pagination={false} scroll={{ x: 800 }} />
    </div>
  );
};

export default OrdersPage;
