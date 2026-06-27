import { useState, useEffect } from 'react';
import { Table, Button, Select, Space, Tag, message, Modal, Input } from 'antd';
import request from '../../utils/request';

const statusMap = {
  pending: { color: 'processing', text: '待确认' },
  confirmed: { color: 'success', text: '已确认' },
  rejected: { color: 'error', text: '已拒绝' },
  cancelled: { color: 'default', text: '已取消' },
  completed: { color: 'blue', text: '已完成' },
};

export default function BookingsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterRestaurantId, setFilterRestaurantId] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, id: null });
  const [rejectReason, setRejectReason] = useState('');

  const fetchRestaurants = async () => {
    try {
      const res = await request.get('/api/restaurant/admin/list');
      setRestaurants(res.data || []);
    } catch { /* */ }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterRestaurantId) params.restaurant_id = filterRestaurantId;
      const res = await request.get('/api/restaurant-booking/admin/list', { params });
      setData(res.data?.list || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchRestaurants(); fetchData(); }, []);
  useEffect(() => { fetchData(); }, [filterStatus, filterRestaurantId]);

  const handleStatus = async (id, status, merchant_remark) => {
    try {
      await request.put(`/api/restaurant-booking/status/${id}`, { status, ...(merchant_remark ? { merchant_remark } : {}) });
      message.success('状态更新成功');
      fetchData();
    } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '餐厅', dataIndex: 'restaurantName', ellipsis: true },
    { title: '预订日期', dataIndex: 'bookingDate', width: 110 },
    { title: '时段', dataIndex: 'slotName', width: 140 },
    { title: '人数', dataIndex: 'guestCount', width: 60 },
    { title: '联系人', dataIndex: 'contactName', width: 80 },
    { title: '电话', dataIndex: 'contactPhone', width: 120 },
    { title: '备注', dataIndex: 'remark', width: 100, ellipsis: true, render: (v) => v || '-' },
    {
      title: '状态', dataIndex: 'status', width: 80,
      render: (v) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text || v}</Tag>,
    },
    { title: '商家备注', dataIndex: 'merchantRemark', width: 100, ellipsis: true, render: (v) => v || '-' },
    {
      title: '操作', width: 200, key: 'actions',
      render: (_, record) => {
        if (record.status === 'pending') return (
          <Space>
            <Button type="link" size="small" onClick={() => handleStatus(record.id, 'confirmed')}>确认</Button>
            <Button type="link" size="small" danger onClick={() => setRejectModal({ open: true, id: record.id })}>拒绝</Button>
          </Space>
        );
        if (record.status === 'confirmed') return (
          <Button type="link" size="small" onClick={() => handleStatus(record.id, 'completed')}>完成</Button>
        );
        return '-';
      },
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>预订管理</h2>
        <Space>
          <Select
            placeholder="筛选餐厅" allowClear style={{ width: 200 }}
            value={filterRestaurantId} onChange={(v) => setFilterRestaurantId(v || null)}
            options={restaurants.map(r => ({ label: r.name, value: r.id }))}
          />
          <Select
            placeholder="筛选状态" allowClear style={{ width: 120 }}
            value={filterStatus} onChange={(v) => setFilterStatus(v || null)}
            options={[
              { label: '待确认', value: 'pending' }, { label: '已确认', value: 'confirmed' },
              { label: '已拒绝', value: 'rejected' }, { label: '已取消', value: 'cancelled' },
              { label: '已完成', value: 'completed' },
            ]}
          />
        </Space>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      <Modal title="拒绝原因" open={rejectModal.open} onOk={() => { handleStatus(rejectModal.id, 'rejected', rejectReason); setRejectModal({ open: false, id: null }); setRejectReason(''); }} onCancel={() => setRejectModal({ open: false, id: null })}>
        <Input.TextArea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="请输入拒绝原因" />
      </Modal>
    </div>
  );
}
