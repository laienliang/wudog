import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tag, Typography, Skeleton, Empty, message, Space, Input, List, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const { Search } = Input;
const api = axios.create({ baseURL: '/api/v1' });

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [travelogues, setTravelogues] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/travelogues?page=1&pageSize=50'),
      api.get('/topics'),
    ]).then(([tRes, topRes]) => {
      setTravelogues(tRes.data?.data?.list || []);
      setTopics(topRes.data?.data || topRes.data || []);
    }).catch(() => message.error('加载失败'))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ maxWidth: 1200, margin: '0 auto', padding: 40 }}><Skeleton active paragraph={{ rows: 8 }} /></div>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Row gutter={[32, 24]}>
        {/* 左侧：瀑布流 */}
        <Col xs={24} lg={18}>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>📸 社区分享</Title>
            <Space>
              <Button type="primary" icon={<EditOutlined />} onClick={() => navigate('/community/create')}
                style={{ background: '#1F5FA8', borderRadius: 8, fontWeight: 500 }}>
                发表游记
              </Button>
              <Search placeholder="搜索游记..." style={{ width: 280 }} />
            </Space>
          </div>
          {travelogues.length === 0 ? <Empty description="暂无游记" /> : (
            <Row gutter={[16, 16]}>
              {travelogues.map((t: any) => (
                <Col xs={24} sm={12} md={8} key={t.id}>
                  <Card hoverable onClick={() => navigate(`/community/travelogue/${t.id}`)}
                    style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    cover={<div style={{ height: 200, background: '#f5f5f5', overflow: 'hidden' }}>
                      <img src={t.coverImage} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>}
                    styles={{ body: { padding: '14px 16px' } }}>
                    <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</Text>
                    <Space style={{ marginBottom: 4 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#1F5FA8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>{(t.user_name || '匿').charAt(0)}</div>
                      <Text style={{ fontSize: 12, color: '#8C8C8C' }}>{t.user_name || '匿名'}</Text>
                    </Space>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#BFBFBF' }}>
                      <span><EyeOutlined /> {t.viewCount || 0}</span>
                      <span><HeartOutlined /> {t.likeCount || 0}</span>
                      <span><MessageOutlined /> {t.commentCount || 0}</span>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>

        {/* 右侧：话题列表 */}
        <Col xs={24} lg={6}>
          <Card title="🏷️ 热门话题" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <List dataSource={topics} renderItem={(item: any) => (
              <List.Item onClick={() => navigate(`/community/topic/${item.id}`)} style={{ cursor: 'pointer', padding: '10px 0' }}>
                <Tag color="blue" style={{ borderRadius: 4 }}>#{item.name}</Tag>
              </List.Item>
            )} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default CommunityPage;
