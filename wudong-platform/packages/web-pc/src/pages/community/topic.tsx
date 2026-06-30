import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Tag, Typography, Skeleton, Empty, message, Space, Button } from 'antd';
import { EyeOutlined, HeartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const api = axios.create({ baseURL: '/api/v1' });

const TopicPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<any>(null);
  const [travelogues, setTravelogues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get('/topics'),
      api.get(`/travelogues?page=1&pageSize=50`),
    ]).then(([topRes, tRes]) => {
      const topics = topRes.data?.data || topRes.data || [];
      const topic = Array.isArray(topics) ? topics.find((t: any) => String(t.id) === String(id)) : null;
      setTopic(topic);
      const all = tRes.data?.data?.list || [];
      setTravelogues(all.filter((t: any) => String(t.topicId) === String(id)));
    }).catch(() => message.error('加载失败'))
    .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ maxWidth: 1200, margin: '0 auto', padding: 40 }}><Skeleton active paragraph={{ rows: 6 }} /></div>;
  if (!topic) return <Empty description="话题不存在" style={{ padding: 80 }} />;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/community')} style={{ padding: 0, marginBottom: 16, color: '#666' }}>返回社区</Button>
      <Card style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '24px' } }}>
        <Title level={3} style={{ margin: 0 }}># {topic.name}</Title>
        <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>共 {travelogues.length} 篇游记</Text>
      </Card>
      {travelogues.length === 0 ? <Empty description="该话题下暂无游记" /> : (
        <Row gutter={[16, 24]}>
          {travelogues.map((t: any) => (
            <Col xs={24} sm={12} md={8} lg={6} key={t.id}>
              <Card hoverable onClick={() => navigate(`/community/travelogue/${t.id}`)}
                style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                cover={<div style={{ height: 180, background: '#f5f5f5', overflow: 'hidden' }}>
                  {t.coverImage ? <img src={t.coverImage} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).style.display = 'none'; }} />
                  : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#d9d9d9' }}>📸</div>}
                </div>}
                styles={{ body: { padding: '12px 14px' } }}>
                <Text strong style={{ fontSize: 13, display: 'block' }} ellipsis={{ tooltip: t.title }}>{t.title}</Text>
                <Space style={{ marginTop: 4 }} size={12}>
                  <Text style={{ fontSize: 11, color: '#BFBFBF' }}><EyeOutlined /> {t.viewCount || 0}</Text>
                  <Text style={{ fontSize: 11, color: '#BFBFBF' }}><HeartOutlined /> {t.likeCount || 0}</Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
export default TopicPage;
