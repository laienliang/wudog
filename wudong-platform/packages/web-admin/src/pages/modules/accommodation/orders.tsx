import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, Row, Col, Statistic, Space, Typography, Tag, Select, Empty, Input, Button, Tooltip } from 'antd';
import { OrderedListOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, MinusCircleOutlined, SearchOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { accommodationApi } from '../../../services/accommodation';

const { Text } = Typography;
const { Search } = Input;
const COLORS = { primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838', danger: '#D94A4A' };

const STATUS_TAG: Record<string, { color: string; text: string }> = {
  pending_pay: { color: 'orange', text: '待支付' },
  paid: { color: 'processing', text: '已支付' },
  confirmed: { color: 'blue', text: '已确认' },
  completed: { color: 'success', text: '已完成' },
  cancelled: { color: 'default', text: '已取消' },
  refunded: { color: 'default', text: '已退款' },
};

// Card config: key = status value for filter, or array for multiple
const CARD_CONFIG: { key: string | string[] | undefined; title: string; statuses: string[]; icon: React.ReactNode; color: string; bg: string }[] = [
  { key: undefined, title: '全部订单', statuses: [], icon: <OrderedListOutlined />, color: COLORS.primary, bg: '#E8F4FD' },
  { key: 'pending', title: '待处理', statuses: ['pending_pay'], icon: <ClockCircleOutlined />, color: COLORS.warning, bg: '#FFF7E6' },
  { key: 'active', title: '进行中', statuses: ['paid', 'confirmed'], icon: <CheckCircleOutlined />, color: '#52C41A', bg: '#F6FFED' },
  { key: 'completed', title: '已完成', statuses: ['completed'], icon: <CheckCircleOutlined />, color: COLORS.success, bg: '#EDF7ED' },
  { key: 'cancelled', title: '已取消', statuses: ['cancelled'], icon: <MinusCircleOutlined />, color: '#BFBFBF', bg: '#FAFAFA' },
];

const OrdersTab: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [statusFilter, setStatusFilter] = useState<string | string[] | undefined>(undefined);
  const [searchText, setSearchText] = useState('');
  const [stats, setStats] = useState({ total: 0, pending: 0, active: 0, completed: 0, cancelled: 0 });

  const loadStats = useCallback(async () => {
    try {
      const [all, pending, paid, confirmed, completed, cancelled] = await Promise.all([
        accommodationApi.listOrders({ page: 1, pageSize: 1 }),
        accommodationApi.listOrders({ page: 1, pageSize: 1, status: 'pending_pay' }),
        accommodationApi.listOrders({ page: 1, pageSize: 1, status: 'paid' }),
        accommodationApi.listOrders({ page: 1, pageSize: 1, status: 'confirmed' }),
        accommodationApi.listOrders({ page: 1, pageSize: 1, status: 'completed' }),
        accommodationApi.listOrders({ page: 1, pageSize: 1, status: 'cancelled' }),
      ]);
      const g = (r: any) => r?.data?.pagination?.total || 0;
      setStats({
        total: g(all),
        pending: g(pending),
        active: g(paid) + g(confirmed),
        completed: g(completed),
        cancelled: g(cancelled),
      });
    } catch {}
  }, []);
  useEffect(() => { loadStats(); }, [loadStats]);

  const handleCardClick = (card: typeof CARD_CONFIG[0]) => {
    setStatusFilter(card.key);
    actionRef.current?.reload();
  };

  const getActiveCardKey = () => {
    if (statusFilter === undefined) return undefined;
    const found = CARD_CONFIG.find(c => {
      if (Array.isArray(c.key)) return c.key.join(',') === (statusFilter as string[]).join(',');
      return c.key === statusFilter;
    });
    return found?.key;
  };
  const activeKey = getActiveCardKey();

  const columns: ProColumns<any>[] = [
    { title: '#', width: 45, align: 'center', render: (_: any, _r: any, i: number) => <Tag style={{ borderRadius: 8, minWidth: 20, textAlign: 'center', fontSize: 11, lineHeight: '18px', padding: '0 4px' }}>{i + 1}</Tag> },
    { title: '订单号', dataIndex: 'orderNo', width: 170, render: (v) => <Text copyable style={{ fontSize: 12, fontFamily: 'monospace' }}>{v}</Text> },
    { title: '民宿', dataIndex: 'homestay_name', width: 130, render: (v) => v || '-', ellipsis: true },
    { title: '房型', dataIndex: 'room_name', width: 130, render: (v) => v || '-', ellipsis: true },
    { title: '金额', dataIndex: 'totalAmount', width: 80, align: 'right', render: (v) => <Text style={{ color: COLORS.danger, fontWeight: 600, fontSize: 14 }}>¥{Number(v).toFixed(2)}</Text> },
    {
      title: '状态', dataIndex: 'status', width: 80, align: 'center',
      render: (v) => {
        const cfg = STATUS_TAG[v] || { color: 'default', text: v };
        return <Tag color={cfg.color} style={{ borderRadius: 4, fontSize: 11, lineHeight: '20px', paddingInline: 6 }}>{cfg.text}</Tag>;
      },
    },
    { title: '时间', dataIndex: 'createdAt', width: 85, align: 'center', render: (v) => v ? <Text type="secondary" style={{ fontSize: 11 }}>{String(v).slice(0, 10)}</Text> : '-' },
    {
      title: '操作', width: 110, align: 'center',
      render: (_, r) => (
        <Space size={0}>
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} style={{ color: COLORS.primary }} />
          </Tooltip>
          {r.status === 'pending_pay' && (
            <Tooltip title="确认支付">
              <Button type="text" size="small" icon={<CheckOutlined />} style={{ color: COLORS.success }} />
            </Tooltip>
          )}
          {r.status === 'confirmed' && (
            <Tooltip title="确认完成">
              <Button type="text" size="small" icon={<CheckCircleOutlined />} style={{ color: COLORS.success }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (<>
    {/* ===== 统计卡片（5个） ===== */}
    <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
      {CARD_CONFIG.map(item => {
        const isActive = activeKey === item.key;
        const statKey = item.key === undefined ? 'total' : item.key as string;
        return (
          <Col xs={12} sm={8} md={4} key={item.title}>
            <Card hoverable onClick={() => handleCardClick(item)}
              style={{
                borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                border: isActive ? `2px solid ${item.color}` : '1px solid #F0F0F0',
                boxShadow: isActive ? `0 2px 8px ${item.color}30` : '0 1px 4px rgba(0,0,0,0.06)',
                overflow: 'hidden', position: 'relative',
              }}>
              <div style={{ position: 'absolute', top: -10, right: -10, width: 72, height: 72, borderRadius: '50%', background: item.bg, opacity: 0.5 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: item.color, flexShrink: 0 }}>{item.icon}</div>
                <div style={{ minWidth: 0 }}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{item.title}</Text>
                  <div style={{ fontSize: 22, fontWeight: 700, color: item.color, lineHeight: 1.2 }}>{(stats as any)[statKey] ?? 0}</div>
                </div>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>

    {/* ===== 表格 ===== */}
    <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '16px 24px' } }}>
      <ProTable actionRef={actionRef} columns={columns} rowKey="id" search={false}
        request={async () => {
          try {
            const params: any = { page: 1, pageSize: 100 };
            // If filter is an array of statuses, fetch all and filter client-side
            if (Array.isArray(statusFilter)) {
              const res = await accommodationApi.listOrders({ page: 1, pageSize: 100 });
              let list = (res?.data?.list || []);
              list = list.filter((r: any) => statusFilter.includes(r.status));
              if (searchText) list = list.filter((r: any) => r.orderNo?.includes(searchText) || r.homestay_name?.includes(searchText));
              return { data: list, success: true, total: list.length };
            }
            if (statusFilter) params.status = statusFilter;
            const res = await accommodationApi.listOrders(params);
            let list = res?.data?.list || [];
            if (searchText) list = list.filter((r: any) => r.orderNo?.includes(searchText) || r.homestay_name?.includes(searchText));
            return { data: list, success: true, total: list.length };
          } catch { return { data: [], success: false }; }
        }}
        toolbar={{
          filter: (
            <Space wrap>
              <Search placeholder="搜索订单号/民宿名" allowClear style={{ width: 220 }}
                value={searchText} onChange={e => setSearchText(e.target.value)}
                onSearch={() => actionRef.current?.reload()} onPressEnter={() => actionRef.current?.reload()} />
              <Select placeholder="订单状态" allowClear style={{ width: 140 }}
                value={Array.isArray(statusFilter) ? undefined : statusFilter}
                onChange={(v) => { setStatusFilter(v); actionRef.current?.reload(); }}
                options={[
                  { label: '全部状态', value: undefined },
                  { label: '⏳ 待支付', value: 'pending_pay' },
                  { label: '💳 已支付', value: 'paid' },
                  { label: '🔵 已确认', value: 'confirmed' },
                  { label: '🎉 已完成', value: 'completed' },
                  { label: '❌ 已取消', value: 'cancelled' },
                ].filter(Boolean)} />
            </Space>
          ),
        }}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无住宿订单" /> }}
      />
    </Card>
  </>);
};

export default OrdersTab;
