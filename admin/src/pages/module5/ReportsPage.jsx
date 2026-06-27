import { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Modal, message, Select } from 'antd';
import request from '../../utils/request';

const statusMap = {
  pending: { color: 'processing', text: '待处理' },
  handled: { color: 'success', text: '已处理（删除内容）' },
  dismissed: { color: 'default', text: '已驳回' },
};

const typeMap = {
  note: { color: 'blue', text: '游记' },
  comment: { color: 'cyan', text: '评论' },
};

export default function ReportsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [status, setStatus] = useState('');

  const fetchData = async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const params = { page, pageSize };
      if (status) params.status = status;
      const res = await request.get('/api/report/list', { params });
      setData(res.data.list);
      setPagination({ current: page, pageSize, total: res.data.total });
    } catch { /* */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [status]);

  const handleAction = (id, action) => {
    if (action === 'handle') {
      Modal.confirm({
        title: '确认处理该举报？',
        content: '处理后将删除被举报内容',
        okText: '确认删除内容',
        okType: 'danger',
        onOk: async () => {
          await request.put(`/api/report/handle/${id}`, { action: 'handle', handle_result: '内容违规，已删除' });
          message.success('已处理（删除内容）');
          fetchData(pagination.current, pagination.pageSize);
        },
      });
    } else if (action === 'dismiss') {
      Modal.confirm({
        title: '驳回举报原因',
        content: <textarea id="dismiss-result" rows={3} placeholder="请输入驳回原因" style={{ width: '100%' }} />,
        onOk: async () => {
          const result = document.getElementById('dismiss-result').value || '举报不成立';
          await request.put(`/api/report/handle/${id}`, { action: 'dismiss', handle_result: result });
          message.success('已驳回举报');
          fetchData(pagination.current, pagination.pageSize);
        },
      });
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '举报人ID', dataIndex: 'reporter_id', width: 90 },
    {
      title: '目标类型', dataIndex: 'target_type', width: 80,
      render: (t) => <Tag color={typeMap[t]?.color}>{typeMap[t]?.text}</Tag>,
    },
    { title: '目标ID', dataIndex: 'target_id', width: 80 },
    { title: '举报原因', dataIndex: 'reason', ellipsis: true },
    {
      title: '状态', dataIndex: 'status', width: 140,
      render: (s) => <Tag color={statusMap[s]?.color}>{statusMap[s]?.text}</Tag>,
    },
    { title: '处理结果', dataIndex: 'handle_result', ellipsis: true, width: 150 },
    { title: '举报时间', dataIndex: 'created_at', width: 170,
      render: (t) => new Date(t).toLocaleString(),
    },
    {
      title: '操作', width: 140,
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button size="small" type="primary" danger onClick={() => handleAction(record.id, 'handle')}>删除内容</Button>
              <Button size="small" onClick={() => handleAction(record.id, 'dismiss')}>驳回</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>举报处理</h2>
      <Space style={{ marginBottom: 16 }}>
        <Select placeholder="状态筛选" allowClear style={{ width: 140 }} value={status} onChange={setStatus}
          options={[
            { value: 'pending', label: '待处理' },
            { value: 'handled', label: '已处理' },
            { value: 'dismissed', label: '已驳回' },
          ]} />
        <Button type="primary" onClick={() => fetchData()}>刷新</Button>
      </Space>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
        pagination={pagination}
        onChange={(p) => fetchData(p.current, p.pageSize)} />
    </div>
  );
}
