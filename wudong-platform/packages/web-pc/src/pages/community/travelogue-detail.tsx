import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Tag, Typography, Button, Image, Skeleton, message, Space, Input, Divider, List, Empty } from 'antd';
import { ArrowLeftOutlined, HeartFilled, HeartOutlined, MessageOutlined, EyeOutlined, ShareAltOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const { TextArea } = Input;
const api = axios.create({ baseURL: '/api/v1' });
const C = { primary: '#1F5FA8', price: '#E85D2F' };

const TravelogueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [travelogue, setTravelogue] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [commentText, setCommentText] = useState('');

  const submitComment = async () => {
    if (!commentText.trim()) { message.warning('请输入评论内容'); return; }
    try {
      await api.post('/comments', { targetType: 'travelogue', targetId: Number(id), content: commentText.trim(), userId: 1 });
      message.success('评论已发表');
      setCommentText('');
      const res = await api.get(`/travelogues/${id}`);
      const d = res.data?.data || res.data;
      setComments(d.comments || []);
    } catch { message.error('发表失败'); }
  };

  useEffect(() => {
    if (!id) return;
    api.get(`/travelogues/${id}`).then(r => {
      const d = r.data?.data || r.data;
      setTravelogue(d); setComments(d.comments || []);
    }).catch(() => { message.error('加载失败'); navigate('/community'); })
    .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ maxWidth: 1200, margin: '0 auto', padding: 40 }}><Skeleton active paragraph={{ rows: 8 }} /></div>;
  if (!travelogue) return null;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/community')}
        style={{ marginBottom: 16, color: '#666', fontWeight: 500, padding: 0 }}>返回社区</Button>

      <Row gutter={[32, 24]}>
        {/* ===== 左侧：主内容 ===== */}
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }} styles={{ body: { padding: 0 } }}>
            {/* 封面大图 16:9 */}
            <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#f5f5f5' }}>
              <img src={travelogue.coverImage} alt={travelogue.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>

            <div style={{ padding: '28px 32px 24px' }}>
              {/* 标题 */}
              <Title style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3 }}>{travelogue.title}</Title>

              {/* 元数据 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => navigate(`/community/user/${travelogue.userId}`)}>
                    {(travelogue.user_name || '匿').charAt(0)}
                  </div>
                  <Text style={{ fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
                    onClick={() => navigate(`/community/user/${travelogue.userId}`)}>{travelogue.user_name || '用户'}</Text>
                </div>
                <Text type="secondary" style={{ fontSize: 13 }}>· {travelogue.createdAt?.slice(0, 10)}</Text>
                <Text type="secondary" style={{ fontSize: 13 }}>·</Text>
                <span style={{ fontSize: 12, color: '#8C8C8C' }}><EyeOutlined /> {travelogue.viewCount || 0}</span>
                <span style={{ fontSize: 12, color: '#8C8C8C' }}><HeartOutlined /> {travelogue.likeCount || 0}</span>
                <span style={{ fontSize: 12, color: '#8C8C8C' }}><MessageOutlined /> {comments.length}</span>
              </div>

              {/* 位置标签 */}
              {travelogue.location && (
                <Tag color="default" style={{ borderRadius: 20, marginTop: 12, padding: '2px 12px', fontSize: 12 }}>
                  <EnvironmentOutlined /> {travelogue.location}
                </Tag>
              )}

              {/* 正文 */}
              <Divider style={{ margin: '20px 0' }} />
              <div style={{ lineHeight: 2, fontSize: 15, color: '#3D3D3D', whiteSpace: 'pre-wrap', letterSpacing: 0.3 }}>
                {travelogue.content}
              </div>

              {/* 多图网格 */}
              {travelogue.images?.length > 0 && (
                <Row gutter={[8, 8]} style={{ marginTop: 20 }}>
                  {travelogue.images.map((img: string, i: number) => (
                    <Col xs={12} md={8} key={i}>
                      <Image src={img} style={{ width: '100%', borderRadius: 8 }} fallback="" />
                    </Col>
                  ))}
                </Row>
              )}

              {/* 点赞栏 */}
              <div style={{ textAlign: 'center', marginTop: 32, marginBottom: 8 }}>
                <Button
                  icon={liked ? <HeartFilled /> : <HeartOutlined />}
                  size="large"
                  onClick={() => setLiked(!liked)}
                  style={{
                    borderRadius: 24, height: 44, paddingInline: 32,
                    background: liked ? '#FF4D4F' : '#fff',
                    borderColor: '#FF4D4F', color: liked ? '#fff' : '#FF4D4F',
                    fontSize: 15, fontWeight: 500,
                    boxShadow: liked ? '0 4px 12px rgba(255,77,79,0.3)' : 'none',
                  }}>
                  {liked ? '已点赞 ' : '点赞 '}{travelogue.likeCount + (liked ? 1 : 0)}
                </Button>
              </div>
            </div>
          </Card>

          {/* 评论区域 */}
          <Card style={{ borderRadius: 12, marginTop: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '20px 24px' } }}>
            <Title level={5} style={{ marginBottom: 16, fontSize: 16 }}>💬 评论 ({comments.length})</Title>

            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>我</div>
              <div style={{ flex: 1 }}>
                <TextArea rows={2} placeholder="来写点什么吧，抢沙发～" style={{ borderRadius: 8, marginBottom: 10, resize: 'none' }}
                  value={commentText} onChange={e => setCommentText(e.target.value)} />
                <Button type="primary" onClick={submitComment}
                  style={{ background: C.primary, borderColor: C.primary, borderRadius: 8, float: 'right' }}>发表评论</Button>
              </div>
            </div>

            <List
              dataSource={comments}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>暂无评论<br /><Text type="secondary" style={{ fontSize: 12 }}>快来抢沙发吧 🛋️</Text></span>} />}}
              renderItem={(item: any) => (
                <List.Item style={{ padding: '14px 0' }}>
                  <List.Item.Meta
                    avatar={<div style={{ width: 34, height: 34, borderRadius: '50%', background: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{(item.user_name || '匿').charAt(0)}</div>}
                    title={<Space><Text strong style={{ fontSize: 14 }}>{item.user_name || '用户'}</Text><Text type="secondary" style={{ fontSize: 11 }}>{item.createdAt?.slice(0, 10)}</Text></Space>}
                    description={<Text style={{ fontSize: 14, color: '#595959', lineHeight: 1.6 }}>{item.content}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* ===== 右侧：侧边栏 ===== */}
        <Col xs={24} lg={8}>
          <div style={{ position: 'sticky', top: 24 }}>
            {/* 作者卡片 */}
            <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px', cursor: 'pointer' }}
                  onClick={() => navigate(`/community/user/${travelogue.userId}`)}>
                  <UserOutlined />
                </div>
                <Text strong style={{ fontSize: 16, cursor: 'pointer' }}
                  onClick={() => navigate(`/community/user/${travelogue.userId}`)}>{travelogue.user_name || '用户'}</Text>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 2 }}>ID: {travelogue.userId}</Text>
                <Button type="primary" ghost size="small"
                  onClick={() => setFollowing(!following)}
                  style={{
                    marginTop: 12, borderRadius: 20, width: '80%',
                    borderColor: following ? '#BFBFBF' : C.primary,
                    color: following ? '#BFBFBF' : C.primary,
                  }}>
                  {following ? '已关注' : '+ 关注'}
                </Button>
              </div>
            </Card>

            {/* 内容统计 */}
            <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }} styles={{ body: { padding: '16px 20px' } }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div><Text strong style={{ fontSize: 18, color: '#1A1A1A' }}>{travelogue.viewCount || 0}</Text><div style={{ fontSize: 12, color: '#BFBFBF' }}>浏览</div></div>
                <div><Text strong style={{ fontSize: 18, color: '#FF4D4F' }}>{travelogue.likeCount || 0}</Text><div style={{ fontSize: 12, color: '#BFBFBF' }}>点赞</div></div>
                <div><Text strong style={{ fontSize: 18, color: C.primary }}>{comments.length}</Text><div style={{ fontSize: 12, color: '#BFBFBF' }}>评论</div></div>
              </div>
            </Card>

            {/* 分享 */}
            <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '16px 20px' } }}>
              <Space>
                <Button icon={<ShareAltOutlined />} style={{ borderRadius: 20 }}>分享</Button>
                <Button icon={<HeartOutlined />} style={{ borderRadius: 20 }}>收藏</Button>
              </Space>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default TravelogueDetail;
