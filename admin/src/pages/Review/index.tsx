/* ============================================================
   评价管理页
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\Review\index.tsx
   ============================================================ */
import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Input, Rate, Tag, Space, Popconfirm, message } from 'antd';
import { EditOutlined, EyeInvisibleOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAdminReviews, replyReview, toggleReviewStatus, deleteReview } from '../../api/lodging';

export default function ReviewPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [replyModal, setReplyModal] = useState<{ id: number; reply: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const r = await getAdminReviews({ page, pageSize: 20 }); setData(r.list || []); setTotal(r.total || 0); } catch {}
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleReply = async () => {
    if (!replyModal) return;
    try { await replyReview(replyModal.id, replyModal.reply); } catch {}
    message.success('已回复'); setReplyModal(null); fetchData();
  };
  const handleToggle = async (id: number, status: number) => {
    try { await toggleReviewStatus(id, status === 1 ? 0 : 1); } catch {}
    message.success('状态已切换'); fetchData();
  };
  const handleDelete = async (id: number) => { try { await deleteReview(id); } catch {} message.success('已删除'); fetchData(); };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '民宿ID', dataIndex: 'homestay_id', width: 80 },
    { title: '评分', dataIndex: 'rating', render: (v: number) => <Rate disabled value={v} style={{ fontSize: 14 }} /> },
    { title: '内容', dataIndex: 'content', ellipsis: true },
    { title: '房东回复', dataIndex: 'owner_reply', ellipsis: true, render: (v: string) => v || <span style={{ color: '#ccc' }}>暂无</span> },
    { title: '状态', dataIndex: 'status', render: (v: number) => <Tag color={v === 1 ? 'green' : 'default'}>{v === 1 ? '显示' : '隐藏'}</Tag> },
    {
      title: '操作', render: (_: any, r: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => setReplyModal({ id: r.id, reply: r.owner_reply || '' })}>回复</Button>
          <Button size="small" icon={r.status === 1 ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => handleToggle(r.id, r.status)}>
            {r.status === 1 ? '隐藏' : '显示'}
          </Button>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>评价管理</h2>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ total, current: page, onChange: setPage }} />
      <Modal title="房东回复" open={!!replyModal} onOk={handleReply} onCancel={() => setReplyModal(null)}>
        <Input.TextArea rows={4} value={replyModal?.reply || ''}
          onChange={(e) => setReplyModal(p => p ? { ...p, reply: e.target.value } : null)}
          placeholder="请输入回复内容" />
      </Modal>
    </div>
  );
}
