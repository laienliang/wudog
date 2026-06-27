import { useState, useEffect } from 'react';
import { Table, Select, Space, Tag, message } from 'antd';
import request from '../utils/request';

const orderTypes = ['product', 'restaurant', 'homestay', 'ticket', 'tour'];
const orderStatuses = ['pending', 'paid', 'confirmed', 'shipped', 'completed', 'cancelled', 'refunding', 'refunded'];

const typeMap = {
  product: { color: 'blue', text: '商城' },
  restaurant: { color: 'volcano', text: '餐饮' },
  homestay: { color: 'green', text: '民宿' },
  ticket: { color: 'purple', text: '门票' },
  tour: { color: 'orange', text: '路线' },
};

const statusMap = {
  pending: { color: 'default', text: '待支付' },
  paid: { color: 'processing', text: '已支付' },
  confirmed: { color: 'success', text: '已确认' },
  shipped: { color: 'cyan', text: '已发货' },
  completed: { color: 'success', text: '已完成' },
  cancelled: { color: 'default', text: '已取消' },
  refunding: { color: 'warning', text: '退款中' },
  refunded: { color: 'default', text: '已退款' },
};

export default function AdminOrdersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 50;

  const fetchData = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, pageSize };
      if (filterType) params.type = filterType;
      if (filterStatus) params.status = filterStatus;
      const res = await request.get('/admin/orders', { params });
      setData(res.data?.list || []);
      setTotal(res.data?.total || 0);
      setPage(p);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { fetchData(1); }, [filterType, filterStatus]);

  const handleStatus = async (id, status) => {
    try {
      await request.put(`/admin/orders/status/${id}`, { status });
      message.success('状态更新成功');
      fetchData(page);
    } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '订单号', dataIndex: 'order_no', width: 180, ellipsis: true },
    { title: '用户ID', dataIndex: 'user_id', width: 70 },
    { title: '类型', dataIndex: 'type', width: 80, render: (v) => <Tag color={typeMap[v]?.color}>{typeMap[v]?.text || v}</Tag> },
    { title: '总金额', dataIndex: 'total_amount', width: 80, render: (v) => `¥${v}` },
    { title: '实付', dataIndex: 'pay_amount', width: 80, render: (v) => v ? `¥${v}` : '-' },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text || v}</Tag> },
    { title: '创建时间', dataIndex: 'created_at', width: 160, render: (v) => new Date(v).toLocaleString() },
    { title: '操作', width: 280, render: (_, record) => (
      <Space wrap size={[4, 4]}>
        {record.status === 'paid' && (
          <><a style={{ color: '#52c41a' }} onClick={() => handleStatus(record.id, 'confirmed')}>确认</a>
            <a style={{ color: '#e74c3c' }} onClick={() => handleStatus(record.id, 'cancelled')}>取消</a></>
        )}
        {record.status === 'confirmed' && (
          <a style={{ color: '#1677ff' }} onClick={() => handleStatus(record.id, 'shipped')}>发货</a>
        )}
        {record.status === 'shipped' && (
          <a style={{ color: '#52c41a' }} onClick={() => handleStatus(record.id, 'completed')}>完成</a>
        )}
        {record.status === 'pending' && (
          <a style={{ color: '#e74c3c' }} onClick={() => handleStatus(record.id, 'cancelled')}>取消</a>
        )}
      </Space>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>全局订单</h2>
        <Space>
          <Select placeholder="筛选类型" allowClear style={{ width: 120 }} value={filterType} onChange={(v) => setFilterType(v || null)}
            options={orderTypes.map(t => ({ label: typeMap[t]?.text, value: t }))} />
          <Select placeholder="筛选状态" allowClear style={{ width: 120 }} value={filterStatus} onChange={(v) => setFilterStatus(v || null)}
            options={orderStatuses.map(s => ({ label: statusMap[s]?.text, value: s }))} />
        </Space>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
        pagination={{ current: page, pageSize, total, onChange: (p) => fetchData(p), showTotal: (t) => `共 ${t} 条` }} />
    </div>
  );
}
