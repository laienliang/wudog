import { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import request from '../../utils/request';

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchData = async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const res = await request.get('/admin/users', { params: { page, pageSize } });
      setData(res.data.list || []);
      setPagination({ current: page, pageSize, total: res.data.total || 0 });
    } catch { /* */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '昵称', dataIndex: 'nickname' },
    { title: '注册时间', dataIndex: 'created_at', width: 170,
      render: (t) => t ? new Date(t).toLocaleString('zh-CN') : '-',
    },
    { title: '游记数', dataIndex: 'note_count', width: 80 },
    { title: '评论数', dataIndex: 'comment_count', width: 80 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>用户管理</h2>
        <Button onClick={fetchData}>刷新</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
        pagination={{ ...pagination, onChange: (p, ps) => fetchData(p, ps) }} />
      {data.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
          暂无用户数据（需对接用户系统后展示）
        </div>
      )}
    </div>
  );
}
