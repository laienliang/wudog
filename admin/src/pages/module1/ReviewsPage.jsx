import { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Input, Space, message, Popconfirm, Rate } from 'antd';
import request from '../../utils/request';

export default function ReviewsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchData = async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const res = await request.get('/api/product-review/admin/list', { params: { page, pageSize } });
      setData(res.data.list || []);
      setPagination({ current: page, pageSize, total: res.data.total || 0 });
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleReply = async () => {
    if (!replyText.trim()) { message.warning('请输入回复内容'); return; }
    try {
      await request.put(`/api/product-review/reply/${replyModal.id}`, { reply: replyText });
      message.success('回复成功');
      setReplyModal(null);
      setReplyText('');
      fetchData(pagination.current, pagination.pageSize);
    } catch { /* */ }
  };

  const handleDelete = async (id) => {
    try {
      await request.delete(`/api/product-review/delete/${id}`);
      message.success('删除成功');
      fetchData(pagination.current, pagination.pageSize);
    } catch { /* */ }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '商品ID', dataIndex: 'productId', width: 80 },
    { title: '用户ID', dataIndex: 'userId', width: 80 },
    {
      title: '评分', dataIndex: 'rating', width: 150,
      render: (v) => <Rate disabled value={v} style={{ fontSize: 16 }} />,
    },
    { title: '内容', dataIndex: 'content', ellipsis: true, width: 200 },
    { title: '图片', dataIndex: 'images', width: 80, render: (v) => v?.length ? `${v.length}张` : '-' },
    {
      title: '匿名', dataIndex: 'isAnonymous', width: 60,
      render: (v) => <Tag color={v ? 'blue' : 'default'}>{v ? '是' : '否'}</Tag>,
    },
    { title: '商家回复', dataIndex: 'merchantReply', width: 150, ellipsis: true, render: (v) => v || '-' },
    { title: '时间', dataIndex: 'createdAt', width: 170, render: (t) => t ? new Date(t).toLocaleString('zh-CN') : '-' },
    {
      title: '操作', width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => { setReplyModal(record); setReplyText(record.merchantReply || ''); }}>
            {record.merchantReply ? '编辑回复' : '回复'}
          </Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>评价管理</h2>
      <Table
        columns={columns} dataSource={data} rowKey="id" loading={loading}
        pagination={{ ...pagination, onChange: (p, ps) => fetchData(p, ps) }}
      />
      <Modal title="回复评价" open={!!replyModal} onOk={handleReply} onCancel={() => setReplyModal(null)}>
        <Input.TextArea rows={4} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="输入回复内容" />
      </Modal>
    </div>
  );
}
