import { useState, useEffect } from 'react';
import { Table, Button, Select, Space, Tag, message, Popconfirm } from 'antd';
import request from '../../utils/request';

const statusMap = {
  pending: { color: 'processing', text: '待支付' },
  paid: { color: 'cyan', text: '已支付' },
  confirmed: { color: 'success', text: '已确认' },
  cancelled: { color: 'default', text: '已取消' },
  refunding: { color: 'warning', text: '退款中' },
  refunded: { color: 'default', text: '已退款' },
  completed: { color: 'blue', text: '已完成' },
};

export default function OrdersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [homestays, setHomestays] = useState([]);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterHomestayId, setFilterHomestayId] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 50;
  const homestayMap = {};
  homestays.forEach(h => { homestayMap[h.id] = h.name; });

  const fetchHomestays = async () => {
    try {
      const res = await request.get('/api/homestay/admin/list');
      setHomestays(res.data || []);
    } catch { /* */ }
  };

  const fetchData = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, pageSize };
      if (filterStatus) params.status = filterStatus;
      if (filterHomestayId) params.homestay_id = filterHomestayId;
      const res = await request.get('/api/homestay-booking/admin/list', { params });
      setData(res.data?.list || []);
      setTotal(res.data?.total || 0);
      setPage(p);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchHomestays(); fetchData(); }, []);
  useEffect(() => { fetchData(1); }, [filterStatus, filterHomestayId]);

  const handleStatus = async (id, status) => {
    try {
      await request.put(`/api/homestay-booking/status/${id}`, { status });
      message.success('状态更新成功');
      fetchData(page);
    } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '民宿', dataIndex: 'homestayId', width: 100, render: (v) => homestayMap[v] || v },
    { title: '房型', dataIndex: 'roomTypeId', width: 80 },
    { title: '入住', dataIndex: 'checkInDate', width: 110 },
    { title: '离店', dataIndex: 'checkOutDate', width: 110 },
    { title: '晚数', dataIndex: 'nights', width: 50 },
    { title: '间数', dataIndex: 'roomCount', width: 50 },
    { title: '入住人', dataIndex: 'guestName', width: 80 },
    { title: '电话', dataIndex: 'guestPhone', width: 120 },
    { title: '金额', dataIndex: 'totalAmount', width: 80, render: (v) => `¥${v}` },
    {
      title: '状态', dataIndex: 'status', width: 80,
      render: (v) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text || v}</Tag>,
    },
    {
      title: '操作', width: 240, key: 'actions',
      render: (_, record) => {
        if (record.status === 'pending') return (
          <Space>
            <Popconfirm title="确认该预订？" onConfirm={() => handleStatus(record.id, 'confirmed')}>
              <Button type="link" size="small">确认</Button>
            </Popconfirm>
            <Popconfirm title="确定取消？" onConfirm={() => handleStatus(record.id, 'cancelled')}>
              <Button type="link" size="small" danger>取消</Button>
            </Popconfirm>
          </Space>
        );
        if (record.status === 'paid') return (
          <Space>
            <Popconfirm title="确认该预订？" onConfirm={() => handleStatus(record.id, 'confirmed')}>
              <Button type="link" size="small">确认</Button>
            </Popconfirm>
            <Popconfirm title="确定取消？" onConfirm={() => handleStatus(record.id, 'cancelled')}>
              <Button type="link" size="small" danger>取消</Button>
            </Popconfirm>
            <Popconfirm title="确定发起退款？" onConfirm={() => handleStatus(record.id, 'refunding')}>
              <Button type="link" size="small" danger>退款</Button>
            </Popconfirm>
          </Space>
        );
        if (record.status === 'confirmed') return (
          <Space>
            <Popconfirm title="确认完成？" onConfirm={() => handleStatus(record.id, 'completed')}>
              <Button type="link" size="small">完成</Button>
            </Popconfirm>
            <Popconfirm title="确定取消？" onConfirm={() => handleStatus(record.id, 'cancelled')}>
              <Button type="link" size="small" danger>取消</Button>
            </Popconfirm>
            <Popconfirm title="确定发起退款？" onConfirm={() => handleStatus(record.id, 'refunding')}>
              <Button type="link" size="small" danger>退款</Button>
            </Popconfirm>
          </Space>
        );
        if (record.status === 'refunding') return (
          <Popconfirm title="确认已退款？" onConfirm={() => handleStatus(record.id, 'refunded')}>
            <Button type="link" size="small">已退款</Button>
          </Popconfirm>
        );
        return '-';
      },
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>订单管理</h2>
        <Space>
          <Select
            placeholder="筛选民宿" allowClear style={{ width: 200 }}
            value={filterHomestayId} onChange={(v) => setFilterHomestayId(v || null)}
            options={homestays.map(h => ({ label: h.name, value: h.id }))}
          />
          <Select
            placeholder="筛选状态" allowClear style={{ width: 120 }}
            value={filterStatus} onChange={(v) => setFilterStatus(v || null)}
            options={[
              { label: '待支付', value: 'pending' }, { label: '已支付', value: 'paid' },
              { label: '已确认', value: 'confirmed' }, { label: '已取消', value: 'cancelled' },
              { label: '退款中', value: 'refunding' }, { label: '已退款', value: 'refunded' },
              { label: '已完成', value: 'completed' },
            ]}
          />
        </Space>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
        pagination={{ current: page, pageSize, total, onChange: (p) => fetchData(p), showTotal: (t) => `共 ${t} 条` }} />
    </div>
  );
}
