import React, { useState, useRef } from 'react';
import { Card, Space, Typography, Tag, Select, Empty, Image } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import dayjs from 'dayjs';
import { orderApi } from '../../../services/api';

const { Text } = Typography;

const STATUS_TAG: Record<string, { color: string; text: string }> = {
  pending_pay: { color: 'orange', text: '待支付' },
  paid: { color: 'processing', text: '已支付' },
  confirmed: { color: 'blue', text: '已确认' },
  completed: { color: 'success', text: '已完成' },
  cancelled: { color: 'default', text: '已取消' },
};

const OrdersTab: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const columns: ProColumns<any>[] = [
    { title: '#', width: 45, align: 'center', render: (_: any, _r: any, i: number) => <Tag style={{ borderRadius: 8, minWidth: 20, textAlign: 'center', fontSize: 11 }}>{i + 1}</Tag> },
    { title: '订单号', dataIndex: 'orderNo', width: 160, render: (v) => <Text copyable style={{ fontSize: 12 }}>{v || '-'}</Text> },
    {
      title: '商品信息', width: 240, search: false,
      render: (_, record) => {
        const items = record.items || [];
        if (items.length === 0) return <Text type="secondary">-</Text>;
        const first = items[0];
        return (
          <Space>
            {first.productImage ? (
              <Image src={first.productImage} width={40} height={40} style={{ borderRadius: 4, objectFit: 'cover' }}
                fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='%23f5f5f5'/%3E"
              />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: 4, background: '#f5f5f5' }} />
            )}
            <div>
              <Text style={{ fontSize: 13 }}>{first.productName || '-'}</Text>
              {items.length > 1 && <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>+{items.length - 1}件商品</Text>}
            </div>
          </Space>
        );
      },
    },
    { title: '金额', dataIndex: 'totalAmount', width: 80, align: 'right', render: (v) => <Text style={{ color: '#E85D2F', fontWeight: 600 }}>¥{Number(v).toFixed(2)}</Text> },
    { title: '状态', dataIndex: 'status', width: 80, align: 'center', render: (v) => { const c = STATUS_TAG[v] || { color: 'default', text: v }; return <Tag color={c.color}>{c.text}</Tag>; } },
    { title: '下单时间', dataIndex: 'createdAt', width: 150, render: (v) => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-' },
  ];

  return (
    <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '16px 24px' } }}>
      <ProTable actionRef={actionRef} columns={columns} rowKey="id" search={false}
        request={async (params) => {
          try {
            const res = await orderApi.list({ page: params.current || 1, pageSize: params.pageSize || 10, orderType: 'travel', status: statusFilter });
            const data = res?.data || res;
            return { data: data.list || [], success: true, total: data.pagination?.total || 0 };
          } catch { return { data: [], success: false }; }
        }}
        toolbar={{
          filter: <Space><span style={{ fontSize: 13, color: '#666' }}>订单状态：</span>
            <Select placeholder="全部状态" allowClear style={{ width: 140 }} value={statusFilter} onChange={(v) => { setStatusFilter(v); actionRef.current?.reload(); }}
              options={[{ label: '全部状态', value: undefined }, { label: '⏳ 待支付', value: 'pending_pay' }, { label: '✅ 已支付', value: 'paid' }, { label: '🔵 已确认', value: 'confirmed' }, { label: '🎉 已完成', value: 'completed' }, { label: '❌ 已取消', value: 'cancelled' }].filter(Boolean)} />
          </Space>,
        }}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无出行订单" /> }}
      />
    </Card>
  );
};
export default OrdersTab;
