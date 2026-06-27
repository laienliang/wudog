import { useState, useEffect } from 'react';
import { Table, Tag, Button, Select, Space, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/request';

const statusMap = {
  draft: { color: 'default', text: '草稿' },
  reviewing: { color: 'processing', text: '待审核' },
  published: { color: 'success', text: '已通过' },
  rejected: { color: 'error', text: '已驳回' },
  removed: { color: 'warning', text: '已下架' },
};

export default function NotesPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [status, setStatus] = useState('');

  const fetchData = async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const params = { page, pageSize };
      if (status) params.status = status;
      const res = await request.get('/api/travel-note/list', { params });
      setData(res.data.list);
      setPagination({ ...pagination, current: page, pageSize, total: res.data.total });
    } catch { /* */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [status]);

  const handleReview = (id, action) => {
    if (action === 'reject') {
      Modal.confirm({
        title: '驳回原因',
        content: <textarea id="reject-reason" rows={3} placeholder="请输入驳回原因" style={{ width: '100%' }} />,
        onOk: async () => {
          const reason = document.getElementById('reject-reason').value;
          await request.put(`/api/travel-note/review/${id}`, { action: 'reject', reject_reason: reason });
          message.success('已驳回');
          fetchData(pagination.current, pagination.pageSize);
        },
      });
    } else {
      Modal.confirm({
        title: '确认通过该游记？',
        onOk: async () => {
          await request.put(`/api/travel-note/review/${id}`, { action: 'approve' });
          message.success('已通过');
          fetchData(pagination.current, pagination.pageSize);
        },
      });
    }
  };

  const handleRemove = (id, title) => {
    Modal.confirm({
      title: `确认下架"${title}"？`,
      content: '下架后内容将不对外展示',
      okText: '确认下架',
      okType: 'danger',
      onOk: async () => {
        await request.put(`/api/travel-note/remove/${id}`);
        message.success('已下架');
        fetchData(pagination.current, pagination.pageSize);
      },
    });
  };

  const handleDelete = (id, title) => {
    Modal.confirm({
      title: `确认删除"${title}"？`,
      content: '删除后不可恢复',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await request.delete(`/api/travel-note/delete/${id}`);
        message.success('已删除');
        fetchData(pagination.current, pagination.pageSize);
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '作者', dataIndex: 'author_nickname', width: 100 },
    { title: '话题', dataIndex: 'topic_name', width: 100 },
    { title: '状态', dataIndex: 'status', width: 80,
      render: (s) => <Tag color={statusMap[s]?.color}>{statusMap[s]?.text}</Tag>,
    },
    { title: '举报', dataIndex: 'report_count', width: 60 },
    { title: '发布时间', dataIndex: 'created_at', width: 170,
      render: (t) => new Date(t).toLocaleString(),
    },
    { title: '操作', width: 340,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/module5/notes/${record.id}`)}>查看</Button>
          {record.status === 'reviewing' && (
            <>
              <Button size="small" type="primary" onClick={() => handleReview(record.id, 'approve')}>通过</Button>
              <Button size="small" danger onClick={() => handleReview(record.id, 'reject')}>驳回</Button>
            </>
          )}
          {record.status === 'published' && (
            <Button size="small" danger onClick={() => handleRemove(record.id, record.title)}>下架</Button>
          )}
          <Button size="small" danger onClick={() => handleDelete(record.id, record.title)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>游记管理</h2>
      <Space style={{ marginBottom: 16 }}>
        <Select placeholder="状态筛选" allowClear style={{ width: 120 }} value={status} onChange={setStatus}
          options={Object.entries(statusMap).map(([k, v]) => ({ value: k, label: v.text }))} />
        <Button type="primary" onClick={() => fetchData()}>刷新</Button>
      </Space>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
        pagination={pagination}
        onChange={(p) => fetchData(p.current, p.pageSize)} />
    </div>
  );
}
