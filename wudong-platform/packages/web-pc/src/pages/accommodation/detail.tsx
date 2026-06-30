import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Tag, Rate, Typography, Button, Skeleton, message, Space, Divider, Modal } from 'antd';
import { StarFilled, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const api = axios.create({ baseURL: '/api/v1' });

const AccommodationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [homestay, setHomestay] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomModal, setRoomModal] = useState<{ open: boolean; room: any }>({ open: false, room: null });

  useEffect(() => {
    Promise.all([
      api.get(`/homestays/${id}`),
      api.get('/accommodation-reviews?page=1&pageSize=10'),
    ]).then(([hRes, rRes]) => {
      setHomestay(hRes.data?.data || hRes.data);
      const allReviews = rRes.data?.data?.list || [];
      setReviews(allReviews.slice(0, 3));
    }).catch(() => { message.error('加载失败'); navigate('/accommodation'); })
    .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Skeleton active paragraph={{ rows: 6 }} /></div>;
  if (!homestay) return null;

  const roomTypes = homestay.roomTypes || [];
  const minPrice = roomTypes.length ? Math.min(...roomTypes.map((r: any) => Number(r.price))) : 0;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/accommodation')}
        style={{ padding: 0, marginBottom: 16, color: '#1F5FA8' }}>返回列表</Button>

      <Row gutter={[48, 32]}>
        {/* 左侧：图片 */}
        <Col xs={24} md={10}>
          <img src={homestay?.coverImage} alt={homestay?.name}
            style={{ width: '100%', borderRadius: 12, maxHeight: 400, objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='; }} />
        </Col>

        {/* 右侧：信息 */}
        <Col xs={24} md={14}>
          <Title level={3} style={{ marginBottom: 8 }}>{homestay.name}</Title>

          <div style={{ background: '#FFF1EA', borderRadius: 8, padding: '16px 20px', marginBottom: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#E85D2F' }}>
              ¥{minPrice}<span style={{ fontSize: 14, color: '#BFBFBF', fontWeight: 400, marginLeft: 8 }}>起/晚</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#8C8C8C' }}>
              <span style={{ marginRight: 20 }}><StarFilled style={{ color: '#FAAD14' }} /> {homestay.rating} 分</span>
              <span>{homestay.address || '乌东苗寨'}</span>
            </div>
          </div>

          {/* 设施标签 */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: '#595959', marginBottom: 8 }}>设施服务：</div>
            <Space wrap>
              {homestay.facilities?.map((f: string) => (
                <Tag key={f} color="default" style={{ padding: '2px 12px', fontSize: 13, borderRadius: 4 }}>{f}</Tag>
              )) || <Text type="secondary">暂无设施信息</Text>}
            </Space>
          </div>

          {/* 房型列表 - 点击可查看详情 */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: '#595959', marginBottom: 8 }}>选择房型（点击查看详情）：</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {roomTypes.map((rt: any) => {
                const isSoldOut = Number(rt.quantity) === 0;
                return (
                  <div key={rt.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', borderRadius: 8,
                    border: `1px solid ${isSoldOut ? '#F0F0F0' : '#E8E8E8'}`,
                    background: isSoldOut ? '#FAFAFA' : '#fff',
                    opacity: isSoldOut ? 0.6 : 1,
                    cursor: isSoldOut ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                    onClick={() => { if (!isSoldOut) setRoomModal({ open: true, room: rt }); }}
                    onMouseEnter={e => { if (!isSoldOut) e.currentTarget.style.borderColor = '#1F5FA8'; }}
                    onMouseLeave={e => { if (!isSoldOut) e.currentTarget.style.borderColor = '#E8E8E8'; }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>{rt.name}</div>
                      <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 2 }}>
                        {[rt.area, rt.bedType, rt.maxGuests ? `${rt.maxGuests}人` : ''].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 12 }}>
                      {isSoldOut ? (
                        <Text style={{ color: '#BFBFBF', fontSize: 13 }}>已订完</Text>
                      ) : (
                        <>
                          <Text style={{ color: '#E85D2F', fontWeight: 700, fontSize: 16 }}>¥{Number(rt.price).toFixed(0)}</Text>
                          <Button type="primary" size="small" style={{ background: '#1F5FA8', borderRadius: 6, fontSize: 12 }}
                            onClick={(e) => { e.stopPropagation(); navigate(`/accommodation/booking/${id}?roomTypeId=${rt.id}`); }}>
                            预订
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Card title="民宿简介" style={{ borderRadius: 12, marginTop: 16 }}>
            <Text style={{ lineHeight: 1.8, color: '#595959' }}>{homestay.description || '暂无介绍'}</Text>
          </Card>

          {/* ===== 住客评价（从 API 加载） ===== */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0, color: '#1A1A1A', fontWeight: 600 }}>住客评价</Title>
              <span style={{ fontSize: 13, color: '#1F5FA8', cursor: 'pointer' }}>查看全部 →</span>
            </div>
            {reviews.length === 0 ? (
              <Text type="secondary">暂无评价</Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {reviews.map((review, i) => (
                  <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: '#FAFAFA', border: '1px solid #F0F0F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Space>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1F5FA8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>
                          {(review.user_name || '匿').charAt(0)}
                        </div>
                        <div>
                          <Text style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{review.user_name || '匿名用户'}</Text>
                          <Text type="secondary" style={{ fontSize: 11, marginLeft: 8 }}>{review.createdAt ? String(review.createdAt).slice(0, 10) : ''}</Text>
                        </div>
                      </Space>
                      <Rate disabled value={Number(review.rating)} style={{ fontSize: 12 }} />
                    </div>
                    <Text style={{ fontSize: 13, color: '#595959', lineHeight: 1.7 }}>{review.content}</Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* ===== 房型详情弹窗 - 左右分栏 ===== */}
      <Modal
        title={null}
        open={roomModal.open}
        onCancel={() => setRoomModal({ open: false, room: null })}
        footer={null}
        width={840}
        destroyOnClose
        closable={false}
        styles={{ body: { padding: 0, overflow: 'hidden', borderRadius: 12 } }}
      >
        {roomModal.room && (
          <div style={{ display: 'flex', height: 560, overflow: 'hidden' }}>
            {/* ===== 左侧：图片区 ===== */}
            <div style={{ flex: '0 0 38%', position: 'relative', overflow: 'hidden', background: '#F0F0F0', borderRadius: '12px 0 0 12px' }}>
              <img src={roomModal.room?.images?.[0] || homestay?.coverImage || ''} alt={roomModal.room?.name || ''}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 2 }}
                onLoad={(e) => { (e.target as HTMLElement).style.display = 'block'; }}
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              <div onClick={() => setRoomModal({ open: false, room: null })}
                style={{ position: 'absolute', top: 12, left: 12, width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, zIndex: 10 }}>
                ✕
              </div>
              <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '4px 12px' }}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>📸 实拍图</Text>
              </div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#BFBFBF', textAlign: 'center', pointerEvents: 'none', zIndex: 1 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🏠</div>
                <Text style={{ color: '#BFBFBF', fontSize: 13 }}>暂无图片</Text>
              </div>
            </div>

            {/* ===== 右侧：信息区 ===== */}
            <div style={{ flex: '0 0 62%', padding: '24px 20px 16px 16px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 10, right: 14, cursor: 'pointer', fontSize: 20, color: '#BFBFBF', zIndex: 10, lineHeight: 1 }}
                onClick={() => setRoomModal({ open: false, room: null })}>
                ✕
              </div>

              <Title level={3} style={{ margin: 0, color: '#1A1A1A', fontWeight: 700, fontSize: 20, lineHeight: 1.2 }}>{roomModal.room?.name || ''}</Title>
              <Space style={{ marginTop: 4, marginBottom: 12 }} size={10}>
                <span style={{ fontSize: 12, color: '#FAAD14', fontWeight: 500 }}>⭐ {homestay?.rating}</span>
                <span style={{ color: '#D9D9D9' }}>|</span>
                <span style={{ fontSize: 12, color: '#8C8C8C' }}>{homestay?.name}</span>
                <span style={{ color: '#D9D9D9' }}>|</span>
                <span style={{ fontSize: 12, color: '#8C8C8C' }}>{roomModal.room?.area || '-'}</span>
              </Space>

              <div style={{ marginBottom: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { icon: '🛏️', label: roomModal.room?.bedType || '大床' },
                  { icon: '🚿', label: '独立卫浴' },
                  { icon: '📶', label: '免费WiFi' },
                  { icon: '🏔️', label: '观景阳台' },
                ].map((p, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 12px', borderRadius: 20, background: '#F0F5FF', color: '#1F5FA8', fontSize: 12, fontWeight: 500 }}>
                    <span style={{ fontSize: 13 }}>{p.icon}</span>{p.label}
                  </span>
                ))}
              </div>

              <div style={{ marginBottom: 'auto' }}>
                <Text strong style={{ fontSize: 13, color: '#1A1A1A', display: 'block', marginBottom: 8, letterSpacing: 0.5 }}>房间配套</Text>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 16px' }}>
                  {[
                    { icon: '🛌', label: '床品', value: '高品质棉织品' },
                    { icon: '🚿', label: '洗浴', value: '品牌洗护、24h热水' },
                    { icon: '❄️', label: '电器', value: '空调、平板电视' },
                    { icon: '🧴', label: '用品', value: '牙刷、拖鞋、矿泉水' },
                    { icon: '🔊', label: '隔音', value: '双层玻璃' },
                    { icon: '🧹', label: '清洁', value: '每日清洁服务' },
                    { icon: '🔒', label: '安全', value: '电子门锁' },
                    { icon: '☕', label: '餐饮', value: '含双早' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '2px 0' }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A' }}>{item.label}</span>
                      <span style={{ fontSize: 11, color: '#8C8C8C' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 6 }}>
                <Space split={<Text style={{ color: '#E8E8E8', fontSize: 11 }}>|</Text>}>
                  <Text style={{ fontSize: 11, color: '#8C8C8C' }}>
                    剩余 <Text strong style={{ color: Number(roomModal.room?.quantity || 0) < 5 ? '#FF4D4F' : '#595959', fontSize: 12 }}>{roomModal.room?.quantity || 0}</Text> 间
                  </Text>
                  {Number(roomModal.room?.quantity || 0) < 5 && <span style={{ fontSize: 11, color: '#FF4D4F', fontWeight: 500 }}>⚠️ 仅剩</span>}
                </Space>
              </div>
              <div style={{ background: '#FAFAFA', borderRadius: 6, padding: '5px 12px', marginBottom: 8 }}>
                <Text style={{ fontSize: 10, color: '#8C8C8C', lineHeight: 1.6, display: 'block' }}>
                  🕐 入住14:00后 · 离店12:00前 | ❌ 入住前1天18:00前可免费取消
                </Text>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #F0F0F0' }}>
                <div>
                  <Text style={{ color: '#1F5FA8', fontSize: 22, fontWeight: 700 }}>¥{Number(roomModal.room?.price || 0).toFixed(2)}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>/晚</Text>
                  {roomModal.room?.weekendPrice && Number(roomModal.room.weekendPrice) > 0 && (
                    <Text style={{ fontSize: 12, color: '#BFBFBF', textDecoration: 'line-through', marginLeft: 6 }}>¥{Number(roomModal.room.weekendPrice).toFixed(2)}</Text>
                  )}
                </div>
                <div style={{ flex: 1 }} />
                <Button type="primary" size="middle"
                  style={{ height: 38, borderRadius: 8, fontWeight: 600, fontSize: 14, background: '#1F5FA8', borderColor: '#1F5FA8', boxShadow: '0 4px 12px rgba(31,95,168,0.3)', paddingInline: 16, marginRight: 12 }}
                  onClick={() => { setRoomModal({ open: false, room: null }); navigate(`/accommodation/booking/${id}?roomTypeId=${roomModal.room?.id}`); }}>
                  立即预订
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AccommodationDetail;
