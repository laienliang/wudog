import React, { useState } from 'react';
import { Card, Tag, Typography, Empty, Image, Tabs } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { productApi } from '../../services/api';
import axios from 'axios';

const { Text } = Typography;
const COLORS = { primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838', danger: '#D94A4A', textSecondary: '#8C8C8C', price: '#E85D2F' };
const api = axios.create({ baseURL: '/api/v1' });

/* ============================================================
   衣·商品SKU库存
   ============================================================ */
const ClothingTab: React.FC = () => {
  const columns: ProColumns<any>[] = [
    { title: '#', width: 45, render: (_: any, __: any, i: number) => <Tag style={{ borderRadius: 8, minWidth: 20, textAlign: 'center' }}>{i + 1}</Tag> },
    { title: '商品ID', dataIndex: 'productId', width: 70, align: 'center', render: (v) => <Text style={{ fontSize: 13 }}>{v}</Text> },
    {
      title: '商品名', dataIndex: 'productName', width: 150, ellipsis: true,
      render: (v, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Image src={r.image} width={32} height={32} style={{ borderRadius: 4, objectFit: 'cover', border: '1px solid #f0f0f0' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" />
          <Text style={{ fontSize: 13 }}>{v || r.name || '-'}</Text>
        </div>
      ),
    },
    { title: '款式', dataIndex: 'name', width: 100, render: (v) => v ? <Text style={{ fontSize: 13 }}>{v}</Text> : <Text type="secondary">-</Text> },
    { title: '价格', dataIndex: 'price', width: 100, align: 'right', render: (v) => <Text style={{ color: COLORS.price, fontWeight: 700 }}>¥{Number(v).toFixed(2)}</Text> },
    {
      title: '库存', dataIndex: 'stock', width: 80, align: 'center', sorter: true,
      render: (v) => (<span><Text style={{ color: v < 10 ? COLORS.danger : undefined, fontWeight: v < 10 ? 700 : 400 }}>{v}</Text>{v < 10 ? <Tag color="error" style={{ marginLeft: 4, borderRadius: 4 }}>不足</Tag> : null}</span>),
    },
    { title: '销量', dataIndex: 'sales', width: 70, align: 'center', render: (v) => <Text style={{ fontWeight: 500 }}>{v ?? 0}</Text> },
  ];

  return (
    <ProTable columns={columns} rowKey="id" search={false} options={{ density: true, reload: true }}
      request={async () => {
        const res = await productApi.list({ page: 1, pageSize: 100 });
        const products = res.data?.list || res.data?.data?.list || [];
        const skus: any[] = [];
        for (const p of products) {
          try {
            const sRes = await productApi.skus(p.id);
            const list = sRes.data?.data || sRes.data || [];
            list.forEach((s: any) => skus.push({ ...s, productId: p.id, productName: p.name, sales: p.sales }));
          } catch { /* ignore */ }
        }
        return { data: skus, success: true };
      }}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无商品SKU" /> }}
    />
  );
};

/* ============================================================
   食·农产品库存
   ============================================================ */
const FoodTab: React.FC = () => {
  const columns: ProColumns<any>[] = [
    { title: '#', width: 45, render: (_: any, __: any, i: number) => <Tag style={{ borderRadius: 8, minWidth: 20, textAlign: 'center' }}>{i + 1}</Tag> },
    { title: 'ID', dataIndex: 'id', width: 60, align: 'center' },
    {
      title: '商品名', dataIndex: 'name', width: 160,
      render: (v, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Image src={r.mainImage} width={32} height={32} style={{ borderRadius: 4, objectFit: 'cover' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" />
          <Text style={{ fontSize: 13 }}>{v}</Text>
        </div>
      ),
    },
    { title: '单位', dataIndex: 'unit', width: 80, render: (v) => <Text code>{v || '-'}</Text> },
    { title: '价格', dataIndex: 'price', width: 100, align: 'right', render: (v) => <Text style={{ color: COLORS.price, fontWeight: 700 }}>¥{Number(v).toFixed(2)}</Text> },
    {
      title: '库存', dataIndex: 'stock', width: 80, align: 'center', sorter: true,
      render: (v) => (<span><Text style={{ color: v < 20 ? COLORS.danger : undefined, fontWeight: v < 20 ? 700 : 400 }}>{v}</Text>{v < 20 ? <Tag color="error" style={{ marginLeft: 4, borderRadius: 4 }}>不足</Tag> : null}</span>),
    },
    { title: '状态', dataIndex: 'status', width: 70, align: 'center', render: (v) => v === 1 ? <Tag color="success" style={{ borderRadius: 4 }}>上架</Tag> : <Tag style={{ borderRadius: 4 }}>下架</Tag> },
  ];

  return (
    <ProTable columns={columns} rowKey="id" search={false} options={{ density: true, reload: true }}
      request={async () => {
        const res = await api.get('/food-products?page=1&pageSize=100');
        const body = res.data;
        const list = body?.data?.list || body?.data?.data?.list || [];
        return { data: list, success: true };
      }}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无农产品" /> }}
    />
  );
};

/* ============================================================
   住·房型库存
   ============================================================ */
const AccommodationTab: React.FC = () => {
  const columns: ProColumns<any>[] = [
    { title: '#', width: 45, render: (_: any, __: any, i: number) => <Tag style={{ borderRadius: 8, minWidth: 20, textAlign: 'center' }}>{i + 1}</Tag> },
    { title: 'ID', dataIndex: 'id', width: 60, align: 'center' },
    {
      title: '房型名', dataIndex: 'name', width: 160,
      render: (v, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {r.images?.[0] ? <Image src={r.images[0]} width={32} height={32} style={{ borderRadius: 4, objectFit: 'cover' }} fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" /> : null}
          <Text style={{ fontSize: 13 }}>{v}</Text>
        </div>
      ),
    },
    { title: '床型', dataIndex: 'bedType', width: 100, render: (v) => v || '-' },
    { title: '平日价', dataIndex: 'price', width: 100, align: 'right', render: (v) => <Text style={{ color: COLORS.price, fontWeight: 700 }}>¥{Number(v).toFixed(2)}</Text> },
    { title: '周末价', dataIndex: 'weekendPrice', width: 100, align: 'right', render: (v) => v ? <Text style={{ color: COLORS.price }}>¥{Number(v).toFixed(2)}</Text> : '-' },
    {
      title: '房量', dataIndex: 'quantity', width: 80, align: 'center', sorter: true,
      render: (v) => (<span><Text style={{ color: v < 5 ? COLORS.danger : undefined, fontWeight: v < 5 ? 700 : 400 }}>{v}</Text>{v < 5 ? <Tag color="error" style={{ marginLeft: 4, borderRadius: 4 }}>少</Tag> : null}</span>),
    },
  ];

  return (
    <ProTable columns={columns} rowKey="id" search={false} options={{ density: true, reload: true }}
      request={async () => {
        const res = await api.get('/room-types/all');
        const body = res.data;
        const list = body?.data || body?.list || [];
        return { data: Array.isArray(list) ? list : [], success: true };
      }}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无房型数据" /> }}
    />
  );
};

/* ============================================================
   行·门票库存
   ============================================================ */
const TravelTab: React.FC = () => {
  const columns: ProColumns<any>[] = [
    { title: '#', width: 45, render: (_: any, __: any, i: number) => <Tag style={{ borderRadius: 8, minWidth: 20, textAlign: 'center' }}>{i + 1}</Tag> },
    { title: 'ID', dataIndex: 'id', width: 60, align: 'center' },
    { title: '票种名', dataIndex: 'name', width: 160, render: (v) => <Text style={{ fontSize: 13 }}>{v}</Text> },
    { title: '所属景区', dataIndex: 'scenicName', width: 120, render: (v) => <Tag color="blue" style={{ borderRadius: 4 }}>{v || '-'}</Tag> },
    { title: '价格', dataIndex: 'price', width: 100, align: 'right', render: (v) => <Text style={{ color: COLORS.price, fontWeight: 700 }}>¥{Number(v).toFixed(2)}</Text> },
    {
      title: '库存', dataIndex: 'stock', width: 80, align: 'center', sorter: true,
      render: (v) => v !== null && v !== undefined ? <span><Text style={{ color: v < 20 ? COLORS.danger : undefined, fontWeight: v < 20 ? 700 : 400 }}>{v}</Text>{v < 20 ? <Tag color="error" style={{ marginLeft: 4, borderRadius: 4 }}>不足</Tag> : null}</span> : <Text type="secondary">不限</Text>,
    },
    { title: '有效期', dataIndex: 'validDays', width: 80, align: 'center', render: (v) => v ? `${v}天` : '-' },
  ];

  return (
    <ProTable columns={columns} rowKey="id" search={false} options={{ density: true, reload: true }}
      request={async () => {
        const res = await api.get('/ticket-types/all');
        const body = res.data;
        const list = body?.data || body?.list || [];
        // Enrich with scenic name
        const enriched = Array.isArray(list) ? await Promise.all(list.map(async (t: any) => {
          try {
            const sr = await api.get(`/scenic-spots/${t.scenicId}`);
            const sBody = sr.data;
            const scenic = sBody?.data || sBody;
            return { ...t, scenicName: scenic?.name || '-' };
          } catch { return { ...t, scenicName: '-' }; }
        })) : [];
        return { data: enriched, success: true };
      }}
      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无门票数据" /> }}
    />
  );
};

/* ============================================================
   主组件 - Tab 切换
   ============================================================ */
const Inventory: React.FC = () => {
  const [activeKey, setActiveKey] = useState('clothing');

  return (
    <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: 0 } }}>
      <Tabs activeKey={activeKey} onChange={setActiveKey} style={{ margin: 0, padding: '0 24px' }}
        items={[
          { key: 'clothing', label: '👕 衣·商品SKU', children: <div style={{ padding: '16px 0' }}><ClothingTab /></div> },
          { key: 'food', label: '🍜 食·农产品', children: <div style={{ padding: '16px 0' }}><FoodTab /></div> },
          { key: 'accommodation', label: '🏠 住·房型', children: <div style={{ padding: '16px 0' }}><AccommodationTab /></div> },
          { key: 'travel', label: '🚗 行·门票', children: <div style={{ padding: '16px 0' }}><TravelTab /></div> },
        ]}
      />
    </Card>
  );
};

export default Inventory;
