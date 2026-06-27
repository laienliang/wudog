import { useState, useEffect } from 'react';
import { Table, Select, Space, Tag, message, Modal } from 'antd';
import request from '../utils/request';

const statusMap = {
  pending: { color: 'processing', text: '待审核' },
  approved: { color: 'success', text: '已通过' },
  rejected: { color: 'default', text: '已拒绝' },
};

export default function MerchantApplicationsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const pageSize = 50;

  const fetchData = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, pageSize };
      if (filterStatus) params.status = filterStatus;
      const res = await request.get('/admin/merchant-applications', { params });
      setData(res.data?.list || []);
      setTotal(res.data?.total || 0);
      setPage(p);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { fetchData(1); }, [filterStatus]);

  const handleReview = async (id, action) => {
    try {
      await request.post(`/admin/merchant-applications/review/${id}`, { action });
      message.success(action === 'approve' ? '已通过' : '已拒绝');
      fetchData(page);
    } catch { /* */ }
  };

  const openDetail = (record) => { setDetail(record); setDetailOpen(true); };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '店铺名', dataIndex: 'shop_name', ellipsis: true },
    { title: '模块', dataIndex: 'module', width: 80 },
    { title: '业务类型', dataIndex: 'business_type', width: 100 },
    { title: '联系人', dataIndex: 'contact_name', width: 80 },
    { title: '电话', dataIndex: 'contact_phone', width: 120 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text || v}</Tag> },
    { title: '申请时间', dataIndex: 'created_at', width: 160, render: (v) => new Date(v).toLocaleString() },
    { title: '操作', width: 200, render: (_, record) => (
      <Space>
        <a onClick={() => openDetail(record)}>详情</a>
        {record.status === 'pending' && (
          <>
            <a style={{ color: '#52c41a' }} onClick={() => handleReview(record.id, 'approve')}>通过</a>
            <a style={{ color: '#e74c3c' }} onClick={() => handleReview(record.id, 'reject')}>拒绝</a>
          </>
        )}
      </Space>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>商家入驻审核</h2>
        <Select placeholder="筛选状态" allowClear style={{ width: 120 }} value={filterStatus} onChange={(v) => setFilterStatus(v || null)}
          options={[{ label: '待审核', value: 'pending' }, { label: '已通过', value: 'approved' }, { label: '已拒绝', value: 'rejected' }]} />
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
        pagination={{ current: page, pageSize, total, onChange: (p) => fetchData(p), showTotal: (t) => `共 ${t} 条` }} />

      <Modal title="申请详情" open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null}>
        {detail && (
          <div>
            <p><strong>店铺名:</strong> {detail.shop_name}</p>
            <p><strong>模块:</strong> {detail.module}</p>
            <p><strong>业务类型:</strong> {detail.business_type}</p>
            <p><strong>联系人:</strong> {detail.contact_name}</p>
            <p><strong>电话:</strong> {detail.contact_phone}</p>
            {detail.materials && <p><strong>材料:</strong> {JSON.stringify(detail.materials)}</p>}
            {detail.review_remark && <p><strong>审核备注:</strong> {detail.review_remark}</p>}
            <p><strong>状态:</strong> <Tag color={statusMap[detail.status]?.color}>{statusMap[detail.status]?.text}</Tag></p>
          </div>
        )}
      </Modal>
    </div>
  );
}
