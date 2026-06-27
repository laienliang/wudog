import { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Tag, message } from 'antd';
import request from '../../utils/request';

const statusMap = {
  unused: { color: 'processing', text: '未使用' },
  used: { color: 'success', text: '已核销' },
  refunded: { color: 'default', text: '已退款' },
  expired: { color: 'warning', text: '已过期' },
};

export default function ETicketsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 50;

  const fetchData = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, pageSize };
      if (filterStatus) params.status = filterStatus;
      const res = await request.get('/api/e-ticket/admin/list', { params });
      setData(res.data?.list || []);
      setTotal(res.data?.total || 0);
      setPage(p);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { fetchData(1); }, [filterStatus]);

  const handleVerify = async () => {
    if (!verifyCode.trim()) { message.warning('请输入电子票号'); return; }
    try {
      await request.post('/api/e-ticket/verify', { ticket_code: verifyCode.trim() });
      message.success('核销成功');
      setVerifyCode('');
      fetchData(page);
    } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '票号', dataIndex: 'ticketCode', width: 180, ellipsis: true },
    { title: '票种ID', dataIndex: 'ticketTypeId', width: 70 },
    { title: '用户ID', dataIndex: 'userId', width: 70 },
    { title: '游玩日期', dataIndex: 'visitDate', width: 110 },
    { title: '游客', dataIndex: 'visitorName', width: 80 },
    { title: '数量', dataIndex: 'quantity', width: 50 },
    { title: '单价', dataIndex: 'price', width: 70, render: (v) => `¥${v}` },
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text || v}</Tag> },
    { title: '核销时间', dataIndex: 'usedAt', width: 160, render: (v) => v ? new Date(v).toLocaleString() : '-' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>电子票核销</h2>
        <Space>
          <Select placeholder="筛选状态" allowClear style={{ width: 120 }} value={filterStatus} onChange={(v) => setFilterStatus(v || null)}
            options={[{ label: '未使用', value: 'unused' }, { label: '已核销', value: 'used' }, { label: '已退款', value: 'refunded' }, { label: '已过期', value: 'expired' }]} />
        </Space>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Input placeholder="输入电子票号核销" value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)}
          onPressEnter={handleVerify} style={{ width: 300 }} />
        <Button type="primary" onClick={handleVerify}>核销</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
        pagination={{ current: page, pageSize, total, onChange: (p) => fetchData(p), showTotal: (t) => `共 ${t} 条` }} />
    </div>
  );
}
