import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Space, Tag, Modal, message, Descriptions } from 'antd';
import request from '../../utils/request';

const statusMap = {
  draft: { color: 'default', text: '草稿' },
  reviewing: { color: 'processing', text: '待审核' },
  published: { color: 'success', text: '已通过' },
  rejected: { color: 'error', text: '已驳回' },
};

export default function NoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request.get(`/api/travel-note/detail/${id}`).then((res) => {
      setDetail(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleReview = (action) => {
    if (action === 'reject') {
      Modal.confirm({
        title: '驳回原因',
        content: <textarea id="reject-reason" rows={3} placeholder="请输入驳回原因" style={{ width: '100%' }} />,
        onOk: async () => {
          const reason = document.getElementById('reject-reason').value;
          await request.put(`/api/travel-note/review/${id}`, { action: 'reject', reject_reason: reason });
          message.success('已驳回');
          navigate('/module5/notes');
        },
      });
    } else {
      Modal.confirm({
        title: '确认通过该游记？',
        onOk: async () => {
          await request.put(`/api/travel-note/review/${id}`, { action: 'approve' });
          message.success('已通过');
          navigate('/module5/notes');
        },
      });
    }
  };

  if (loading) return <div>加载中...</div>;
  if (!detail) return <div>游记不存在</div>;

  return (
    <div>
      <Button onClick={() => navigate('/module5/notes')} style={{ marginBottom: 16 }}>← 返回列表</Button>
      <h2>{detail.title}</h2>
      <Descriptions column={2} style={{ margin: '16px 0' }}>
        <Descriptions.Item label="作者">{detail.author_nickname}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={statusMap[detail.status]?.color}>{statusMap[detail.status]?.text}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="话题">{detail.topic_name || '无'}</Descriptions.Item>
        <Descriptions.Item label="发布时间">{new Date(detail.created_at).toLocaleString()}</Descriptions.Item>
        {detail.reject_reason && (
          <Descriptions.Item label="驳回原因" span={2}>
            <span style={{ color: 'red' }}>{detail.reject_reason}</span>
          </Descriptions.Item>
        )}
      </Descriptions>
      {detail.images?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {detail.images.map((url, i) => (
              <img key={i} src={url} alt={`图片${i + 1}`} style={{
                maxWidth: 200, maxHeight: 200, objectFit: 'cover',
                borderRadius: 8, border: '1px solid #eee',
              }} />
            ))}
          </div>
        </div>
      )}
      <div style={{ border: '1px solid #f0f0f0', padding: 20, borderRadius: 8, marginTop: 16, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
        {detail.content}</div>
      {detail.status === 'reviewing' && (
        <Space style={{ marginTop: 24 }}>
          <Button type="primary" onClick={() => handleReview('approve')}>通过</Button>
          <Button danger onClick={() => handleReview('reject')}>驳回</Button>
        </Space>
      )}
      <Space style={{ marginTop: 24 }}>
        <Button danger onClick={() => {
          Modal.confirm({
            title: `确认删除"${detail.title}"？`,
            content: '删除后不可恢复',
            okText: '确认删除',
            okType: 'danger',
            onOk: async () => {
              await request.delete(`/api/travel-note/delete/${id}`);
              message.success('已删除');
              navigate('/module5/notes');
            },
          });
        }}>删除游记</Button>
      </Space>
    </div>
  );
}
