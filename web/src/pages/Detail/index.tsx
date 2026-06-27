/* ============================================================
   民宿详情页 — 轮播 + 房型 + 30天房态 + 收藏 + 评价
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\pages\Detail\index.tsx
   ============================================================ */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Card, Tag, Button, Rate, Tabs, Descriptions, message } from 'antd';
import { HeartOutlined, HeartFilled, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import ImageGallery from '../../components/ImageGallery';
import RoomCalendar from '../../components/Calendar';
import ReviewList from '../../components/ReviewList';
import { getHomestayDetail, getHouseRules, toggleFavorite, checkFavorited, Homestay, Room, HouseRule } from '../../api/lodging';
import './style.css';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [detail, setDetail] = useState<(Homestay & { rooms: Room[]; house_rules: HouseRule[] }) | null>(null);
  const [rules, setRules] = useState<HouseRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const [d, r, f] = await Promise.all([
          getHomestayDetail(Number(id)),
          getHouseRules(Number(id)).catch(() => null),
          checkFavorited(Number(id)).catch(() => ({ isFavorited: false })),
        ]);
        setDetail(d);
        setRules(r);
        setFav(f.isFavorited);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [id]);

  const handleFav = async () => {
    try {
      const res = await toggleFavorite(Number(id));
      setFav(res.isFavorited);
      message.success(res.isFavorited ? '已收藏' : '已取消收藏');
    } catch { /* ignore */ }
  };

  const handleBook = (room: Room) => {
    nav(`/book/${room.id}?homestayId=${id}&checkIn=&checkOut=&roomName=${encodeURIComponent(room.name)}&price=${room.base_price}`);
  };

  if (loading) return <Spin style={{ display: 'block', padding: 100 }} />;
  if (!detail) return <div style={{ padding: 100, textAlign: 'center' }}>民宿不存在</div>;

  return (
    <div className="detail-page">
      <ImageGallery images={detail.images || []} cover={detail.cover_image} />

      <div className="detail-main">
        <div className="detail-info">
          <div className="detail-header">
            <h1>{detail.name}</h1>
            <Button
              icon={fav ? <HeartFilled style={{ color: '#E85D2F' }} /> : <HeartOutlined />}
              onClick={handleFav}
              size="large"
            >
              {fav ? '已收藏' : '收藏'}
            </Button>
          </div>

          <p className="detail-address"><EnvironmentOutlined /> {detail.address}</p>
          <p className="detail-contact"><PhoneOutlined /> {detail.contact_phone}</p>

          <div style={{ margin: '16px 0' }}>
            <Rate disabled value={detail.rating} allowHalf />
            <span style={{ marginLeft: 8, color: '#999' }}>{detail.rating}分 · {detail.review_count}条评价</span>
          </div>

          <div style={{ marginBottom: 16 }}>
            {(() => {
              const tagList = detail?.h_facility_tags ? detail.h_facility_tags.split(',') : [];
              return tagList.map((item, index) => (
                <span key={index}>{item}</span>
              ));
            })()}
          </div>

          <p style={{ color: '#666', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{detail.description}</p>
        </div>

        {/* 入住须知 */}
        {rules && (
          <Card title="入住须知" style={{ marginTop: 24 }}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="入住时间">{rules.check_in_time}</Descriptions.Item>
              <Descriptions.Item label="退房时间">{rules.check_out_time}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 12 }}>
              <strong>退改规则：</strong>
              <ul>
                {rules.cancellation_rules?.map((r, i) => (
                  <li key={i}>{r.description}</li>
                ))}
              </ul>
            </div>
            {rules.notes && <p style={{ color: '#999' }}>{rules.notes}</p>}
          </Card>
        )}
      </div>

      {/* 房型列表 */}
      <div className="room-section">
        <h2>可选房型</h2>
        {detail.rooms?.map((room) => (
          <Card key={room.id} className="room-card" title={room.name}>
            <div className="room-info">
              <div>
                <p><Tag>{room.bed_type}</Tag> {room.area}㎡ · 可住{room.max_guests}人</p>
                <p>{room.description}</p>
                <div>{(() => { const arr = typeof room.facilities === 'string' ? room.facilities.split(',') : Array.isArray(room.facilities) ? room.facilities : []; return arr.map((f) => <Tag key={f}>{f.trim()}</Tag>); })()}</div>
              </div>
              <div className="room-price-action">
                <div className="room-price">
                  <em>¥{room.base_price}</em> /晚
                </div>
                <Button type="primary" size="large" onClick={() => handleBook(room)}>
                  预订
                </Button>
              </div>
            </div>

            {/* 点击预订展开日历 */}
            {selectedRoom?.id === room.id && (
              <RoomCalendar
                roomId={room.id}
                basePrice={room.base_price}
                onDateChange={() => {}}
              />
            )}
          </Card>
        ))}
      </div>

      {/* 评价 */}
      <div className="review-section">
        <h2>住客评价</h2>
        <ReviewList homestayId={Number(id)} />
      </div>
    </div>
  );
}
