/* ============================================================
   订单管理页
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\Order\index.tsx
   ============================================================ */
import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Tag, Select, Space, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import QrVerify from '../../components/QrVerify';
import { getAdminOrders, updateOrderStatus, deleteOrder } from '../../api/lodging';

const STATUS_MAP: Record<string, { color: string; text: string }> = {
  pending_payment: { color: 'default', text: '待支付' },
  paid: { color: 'blue', text: '已支付' },
  confirmed: { color: 'cyan', text: '已确认' },
  checking_in: { color: 'orange', text: '入住中' },
  completed: { color: 'green', text: '已完成' },
  cancelled: { color: 'red', text: '已取消' },
  refunding: { color: 'volcano', text: '退款中' },
  refunded: { color: 'purple', text: '已退款' },
};

const NEXT_STATUS: Record<string, string[]> = {
  pending_payment: ['paid', 'cancelled'],
  paid: ['confirmed', 'cancelled'],
  confirmed: ['checking_in', 'cancelled'],
  checking_in: ['completed'],
  refunding: ['refunded'],
};

export default function OrderPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const r = await getAdminOrders({ page, pageSize: 20, status: statusFilter }); setData(r.list || []); setTotal(r.total || 0); } catch {}
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try { await updateOrderStatus(id, newStatus); } catch {}
    message.success('状态更新'); fetchData();
  };
  const handleDelete = async (id: number) => { try { await deleteOrder(id); } catch {} message.success('已删除'); fetchData(); };

  const columns = [
    { title: '订单号', dataIndex: 'order_no', width: 160 },
    { title: '入住人', dataIndex: 'contact_name' },
    { title: '电话', dataIndex: 'contact_phone' },
    { title: '入住日期', dataIndex: 'check_in_date' },
    { title: '离店日期', dataIndex: 'check_out_date' },
    { title: '总价', dataIndex: 'total_price', render: (v: number) => `¥${v}` },
    { title: '状态', dataIndex: 'status', render: (s: string) => {
      const m = STATUS_MAP[s] || { color: 'default', text: s };
      return <Tag color={m.color}>{m.text}</Tag>;
    }},
    { title: '核销码', dataIndex: 'check_in_code' },
    {
      title: '操作', render: (_: any, r: any) => (
        <Space>
          {NEXT_STATUS[r.status]?.length > 0 && (
            <Select size="small" style={{ width: 100 }} placeholder="变更状态"
              onChange={(v) => handleStatusChange(r.id, v)}
              options={NEXT_STATUS[r.status].map(s => ({ label: STATUS_MAP[s]?.text || s, value: s }))}
            />
          )}
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <h2 style={{ margin: 0 }}>订单管理</h2>
          <Select style={{ width: 120 }} placeholder="状态筛选" allowClear value={statusFilter}
            onChange={setStatusFilter}
            options={Object.entries(STATUS_MAP).map(([k, v]) => ({ label: v.text, value: k }))} />
        </Space>
        <QrVerify />
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ total, current: page, onChange: setPage }} />
    </div>
  );
}
