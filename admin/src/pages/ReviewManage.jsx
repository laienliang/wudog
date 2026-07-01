import { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, message, Popconfirm, Tag } from 'antd';
import { getReviewList, replyReview, deleteReview } from '../utils/api';

export default function ReviewManage() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    loadReviews();
    const timer = setInterval(loadReviews, 10000);
    return () => clearInterval(timer);
  }, [page]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await getReviewList({ page, pageSize });
      setReviews(res.data?.list || []);
      setTotal(res.data?.total || 0);
    } catch { setReviews([]); }
    finally { setLoading(false); }
  };

  const handleReply = async () => {
    if (!replyText.trim()) { message.warning('请输入回复内容'); return; }
    setReplying(true);
    try {
      await replyReview(replyModal.id, { reply: replyText.trim() });
      message.success('回复成功');
      setReplyModal(null);
      setReplyText('');
      loadReviews();
    } catch { message.error('回复失败'); }
    finally { setReplying(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      message.success('删除成功');
      loadReviews();
    } catch { message.error('删除失败'); }
  };

  const columns = [
    { title: '用户ID', dataIndex: 'user_id', width: 80 },
    { title: '商品ID', dataIndex: 'product_id', width: 80 },
    { title: '订单ID', dataIndex: 'order_id', width: 80 },
    {
      title: '评分', dataIndex: 'rating', width: 120,
      render: (v) => <span style={{ color: '#fadb14' }}>{'★'.repeat(v)}{'☆'.repeat(5 - v)}</span>,
    },
    { title: '评价内容', dataIndex: 'content', ellipsis: true },
    {
      title: '商家回复', dataIndex: 'reply', width: 200,
      render: (v) => v ? <Tag color="green" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</Tag> : <Tag>未回复</Tag>,
    },
    {
      title: '时间', dataIndex: 'created_at', width: 160,
      render: (v) => v ? new Date(v).toLocaleString() : '-',
    },
    {
      title: '操作', width: 140,
      render: (_, record) => (
        <span style={{ display: 'flex', gap: 8 }}>
          <a onClick={() => { setReplyModal(record); setReplyText(record.reply || ''); }}>
            {record.reply ? '修改回复' : '回复'}
          </a>
          <Popconfirm title="确定删除该评价？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>评价管理</h3>
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page, pageSize, total,
          onChange: setPage,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
      <Modal
        title="回复评价"
        open={!!replyModal}
        onOk={handleReply}
        onCancel={() => { setReplyModal(null); setReplyText(''); }}
        confirmLoading={replying}
        okText="提交"
        cancelText="取消"
      >
        <div style={{ marginBottom: 8, color: '#666', fontSize: 13 }}>
          评价内容：{replyModal?.content || '用户未填写'}
        </div>
        <Input.TextArea
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          placeholder="输入回复内容..."
          rows={4}
        />
      </Modal>
    </div>
  );
}
