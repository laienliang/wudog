import { useState, useEffect } from 'react';
import { Table, Tag, Select, Button, Space, message, Popconfirm } from 'antd';
import request from '../../utils/request';

const statusMap = {
  pending: { color: 'default', text: '待支付' },
  paid: { color: 'processing', text: '已支付' },
  confirmed: { color: 'blue', text: '已确认' },
  shipped: { color: 'cyan', text: '已发货' },
  completed: { color: 'success', text: '已完成' },
  cancelled: { color: 'error', text: '已取消' },
  refunding: { color: 'warning', text: '退款中' },
  refunded: { color: 'warning', text: '已退款' },
};

const nextStatus = {
  pending: [{ label: '确认', value: 'confirmed' }],
  paid: [{ label: '确认', value: 'confirmed' }],
  confirmed: [{ label: '发货', value: 'shipped' }],
  shipped: [{ label: '完成', value: 'completed' }],
};

export default function OrdersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [status, setStatus] = useState('');

  const fetchData = async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const params = { page, pageSize, type: 'product' };
      if (status) params.status = status;
      const res = await request.get('/admin/orders', { params });
      setData(res.data.list || []);
      setPagination({ current: page, pageSize, total: res.data.total || 0 });
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [status]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await request.put(`/admin/orders/status/${id}`, { status: newStatus });
      message.success('状态更新成功');
      fetchData(pagination.current, pagination.pageSize);
    } catch (e) {
      message.error(e.response?.data?.message || '操作失败');
    }
  };

  const columns = [
    { title: '订单号', dataIndex: 'order_no', width: 180 },
    { title: '用户ID', dataIndex: 'user_id', width: 80 },
    { title: '金额', dataIndex: 'total_amount', width: 100, render: (v) => `¥${Number(v).toFixed(2)}` },
    { title: '实付', dataIndex: 'pay_amount', width: 100, render: (v) => v ? `¥${Number(v).toFixed(2)}` : '-' },
    {
      title: '状态', dataIndex: 'status', width: 100,
      render: (v) => {
        const s = statusMap[v] || { color: 'default', text: v };
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    { title: '下单时间', dataIndex: 'created_at', width: 170, render: (t) => t ? new Date(t).toLocaleString('zh-CN') : '-' },
    {
      title: '操作', width: 200,
      render: (_, record) => {
        const actions = nextStatus[record.status];
        if (!actions) return null;
        return (
          <Space>
            {actions.map((a) => (
              <Popconfirm key={a.value} title={`确定${a.label}？`} onConfirm={() => handleStatusChange(record.id, a.value)}>
                <Button size="small" type="primary">{a.label}</Button>
              </Popconfirm>
            ))}
            <Popconfirm title="确定取消？" onConfirm={() => handleStatusChange(record.id, 'cancelled')}>
              <Button size="small" danger>取消</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <h2>订单管理</h2>
      <div style={{ marginBottom: 16 }}>
        <Select placeholder="订单状态" allowClear style={{ width: 160 }} value={status || undefined} onChange={(v) => { setStatus(v || ''); setPagination({ ...pagination, current: 1 }); }}>
          {Object.entries(statusMap).map(([k, v]) => (
            <Select.Option key={k} value={k}>{v.text}</Select.Option>
          ))}
        </Select>
      </div>
      <Table
        columns={columns} dataSource={data} rowKey="id" loading={loading}
        pagination={{ ...pagination, onChange: (p, ps) => fetchData(p, ps) }}
      />
    </div>
  );
}
