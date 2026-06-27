import { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';
import request from '../utils/request';

const actionColors = {
  admin_login: 'blue',
  order_status: 'green',
  status: 'orange',
};

export default function OperationLogsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 50;

  const fetchData = async (p = 1) => {
    setLoading(true);
    try {
      const res = await request.get('/admin/operation-logs', { params: { page: p, pageSize } });
      setData(res.data?.list || []);
      setTotal(res.data?.total || 0);
      setPage(p);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '操作人', dataIndex: 'operator_name', width: 100 },
    { title: '动作', dataIndex: 'action', width: 120, render: (v) => <Tag color={actionColors[v] || 'default'}>{v}</Tag> },
    { title: '对象类型', dataIndex: 'target_type', width: 100, render: (v) => v || '-' },
    { title: '对象ID', dataIndex: 'target_id', width: 70, render: (v) => v || '-' },
    { title: '内容', dataIndex: 'content', ellipsis: true },
    { title: 'IP', dataIndex: 'ip', width: 130 },
    { title: '时间', dataIndex: 'created_at', width: 160, render: (v) => new Date(v).toLocaleString() },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>操作日志</h2>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
        pagination={{ current: page, pageSize, total, onChange: (p) => fetchData(p), showTotal: (t) => `共 ${t} 条` }} />
    </div>
  );
}
