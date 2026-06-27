import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import request from '../../utils/request';

export default function CommentsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchData = async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const params = { page, pageSize };
      if (keyword) params.keyword = keyword;
      const res = await request.get('/api/comment/list', { params });
      setData(res.data.list || []);
      setPagination({ current: page, pageSize, total: res.data.total || 0 });
    } catch { /* */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除该评论？',
      content: '删除后不可恢复',
      onOk: async () => {
        try {
          await request.delete(`/api/comment/delete/${id}`);
          message.success('已删除');
          fetchData(pagination.current, pagination.pageSize);
        } catch (e) {
          message.error(e.response?.data?.message || '操作失败');
        }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '内容', dataIndex: 'content', ellipsis: true },
    { title: '评论者ID', dataIndex: 'user_id', width: 90 },
    { title: '游记ID', dataIndex: 'note_id', width: 80 },
    { title: '点赞', dataIndex: 'like_count', width: 60 },
    { title: '举报', dataIndex: 'report_count', width: 60 },
    { title: '时间', dataIndex: 'created_at', width: 170,
      render: (t) => new Date(t).toLocaleString('zh-CN'),
    },
    { title: '操作', width: 80,
      render: (_, record) => (
        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>评论管理</h2>
        <div>
          <Input.Search placeholder="搜索评论..." style={{ width: 200, marginRight: 8 }}
            value={keyword} onChange={(e) => setKeyword(e.target.value)}
            onSearch={() => { setPagination({ current: 1, pageSize: 20, total: 0 }); fetchData(1); }} />
          <Button onClick={() => fetchData()}>刷新</Button>
        </div>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
        pagination={pagination}
        onChange={(p) => fetchData(p.current, p.pageSize)} />
    </div>
  );
}
