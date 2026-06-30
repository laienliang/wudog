import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Tag, Typography, Skeleton, Empty, message, Space, Image, Button, Tabs } from 'antd';
import { EyeOutlined, HeartOutlined, ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const api = axios.create({ baseURL: '/api/v1' });

const UserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [travelogues, setTravelogues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/travelogues?page=1&pageSize=50`).then(r => {
      const list = r.data?.data?.list || [];
      setTravelogues(list.filter((t: any) => String(t.userId) === String(id)));
    }).catch(() => message.error('加载失败'))
    .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ maxWidth: 1000, margin: '0 auto', padding: 40 }}><Skeleton active paragraph={{ rows: 6 }} /></div>;

  const userName = travelogues[0]?.user_name || '用户';

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/community')} style={{ padding: 0, marginBottom: 16, color: '#666' }}>返回社区</Button>

      <Card style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '32px', textAlign: 'center' } }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#1F5FA8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}><UserOutlined /></div>
        <Title level={4} style={{ margin: 0 }}>{userName}</Title>
        <Text type="secondary">ID: {id}</Text>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 48 }}>
          <div><Text strong style={{ fontSize: 20 }}>{travelogues.length}</Text><div style={{ fontSize: 12, color: '#8C8C8C' }}>游记</div></div>
          <div><Text strong style={{ fontSize: 20 }}>0</Text><div style={{ fontSize: 12, color: '#8C8C8C' }}>粉丝</div></div>
          <div><Text strong style={{ fontSize: 20 }}>0</Text><div style={{ fontSize: 12, color: '#8C8C8C' }}>关注</div></div>
        </div>
      </Card>

      <Title level={5} style={{ marginBottom: 16 }}>TA的游记</Title>
      {travelogues.length === 0 ? <Empty description="暂无游记" /> : (
        <Row gutter={[16, 24]}>
          {travelogues.map((t: any) => (
            <Col xs={24} sm={12} md={8} key={t.id}>
              <Card hoverable onClick={() => navigate(`/community/travelogue/${t.id}`)}
                style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                cover={<div style={{ height: 180, background: '#f5f5f5' }}><Image src={t.coverImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} fallback="" preview={false} /></div>}
                styles={{ body: { padding: '12px 14px' } }}>
                <Text strong style={{ fontSize: 13, display: 'block' }} ellipsis={{ tooltip: t.title }}>{t.title}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>{t.createdAt?.slice(0, 10)}</Text>
                <div style={{ marginTop: 4, display: 'flex', gap: 12, fontSize: 11, color: '#BFBFBF' }}>
                  <span><EyeOutlined /> {t.viewCount || 0}</span>
                  <span><HeartOutlined /> {t.likeCount || 0}</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
export default UserPage;
