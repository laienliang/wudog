import React, { useState, useEffect } from 'react';
import { List, Tag, Typography, Empty, Spin, message as Msg, Badge, Tabs, Button, Space, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BellOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const api = axios.create({ baseURL: '/api/v1' });

const MessagePage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { Msg.warning('请先登录'); navigate('/'); return; }
    api.get('/messages', { headers: { Authorization: 'Bearer ' + token } })
      .then(res => setMessages(res.data?.data || res.data || []))
      .catch(() => Msg.error('加载失败'))
      .finally(() => setLoading(false));
  }, []);

  const handleClick = async (item: any) => {
    setDetail(item);
    if (!item.isRead) {
      try { await api.put(`/admin/messages/${item.id}/read`); } catch {}
      setMessages(prev => prev.map(m => m.id === item.id ? { ...m, isRead: 1 } : m));
    }
  };

  const unread = messages.filter(m => !m.isRead).length;

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
        <Title level={4} style={{ margin: 0 }}>📮 消息中心</Title>
        {unread > 0 && <Badge count={unread} style={{ backgroundColor: '#D94A4A' }} />}
      </div>

      {messages.length === 0 ? (
        <Empty description="暂无消息" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Tabs items={[
          { key: 'all', label: `全部(${messages.length})`, children: renderList(messages, handleClick) },
          { key: 'unread', label: `未读(${unread})`, children: renderList(messages.filter(m => !m.isRead), handleClick) },
        ]} />
      )}

      <Modal title={detail?.title || '消息详情'} open={!!detail} onCancel={() => setDetail(null)}
        footer={<Button onClick={() => setDetail(null)}>关闭</Button>} width={560}>
        {detail && (
          <div>
            <div style={{ marginBottom: 12, color: '#999', fontSize: 12 }}>
              {dayjs(detail.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              <Tag style={{ marginLeft: 8 }}>{detail.type === 'system' ? '系统消息' : '通知'}</Tag>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{detail.content}</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

function renderList(data: any[], onClick: (item: any) => void) {
  return (
    <List
      dataSource={data}
      renderItem={(item: any) => (
        <List.Item style={{ padding: '14px 16px', cursor: 'pointer', background: item.isRead ? '#fff' : '#F0F5FF', borderRadius: 8, marginBottom: 8 }}
          onClick={() => onClick(item)}>
          <List.Item.Meta
            avatar={<div style={{ fontSize: 24 }}>{item.type === 'system' ? '📢' : '💬'}</div>}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                  {!item.isRead && <Badge status="processing" color="#1F5FA8" />}
                  <Text strong style={{ fontSize: 14 }}>{item.title}</Text>
                </Space>
                <Text type="secondary" style={{ fontSize: 11 }}>{dayjs(item.createdAt).format('MM-DD HH:mm')}</Text>
              </div>
            }
            description={<Text type="secondary" ellipsis style={{ fontSize: 13, maxWidth: 500 }}>{item.content || '-'}</Text>}
          />
        </List.Item>
      )}
    />
  );
}

export default MessagePage;
