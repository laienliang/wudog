import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import request from '../../utils/request';

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [homestay, setHomestay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [roomCount, setRoomCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await request.get(`/api/homestay/detail/${id}`);
      setHomestay(res.data);
    } catch { /* */ } finally { setLoading(false); }
  };

  const fetchReviews = async () => {
    try {
      const res = await request.get('/api/homestay-review/list', { params: { homestay_id: id, pageSize: 10 } });
      setReviews(res.data?.list || []);
    } catch { /* */ }
  };

  useEffect(() => { fetchDetail(); fetchReviews(); }, [id]);

  const calcNights = () => {
    if (!checkIn || !checkOut) return 0;
    const d1 = new Date(checkIn), d2 = new Date(checkOut);
    return Math.max(0, Math.round((d2 - d1) / 86400000));
  };

  const handleBooking = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    if (!selectedRoom) { alert('请选择房型'); return; }
    if (!checkIn || !checkOut) { alert('请选择入住和离店日期'); return; }
    if (!guestName || !guestPhone) { alert('请填写入住人信息'); return; }

    const nights = calcNights();
    if (nights <= 0) { alert('离店日期必须晚于入住日期'); return; }

    setSubmitting(true);
    try {
      await request.post('/api/homestay-booking/create', {
        homestay_id: Number(id), room_type_id: selectedRoom.id,
        check_in_date: checkIn, check_out_date: checkOut, nights,
        room_count: roomCount, guest_name: guestName, guest_phone: guestPhone,
        total_amount: selectedRoom.basePrice * nights * roomCount,
      });
      alert('预订成功');
      navigate('/module3/orders');
    } catch { alert('预订失败'); } finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>加载中...</div>;
  if (!homestay) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>民宿不存在</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <img src={homestay.mainImage || '/placeholder.png'} alt={homestay.name} style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 12 }} />

      <div style={{ marginTop: 20 }}>
        <h2>{homestay.name}</h2>
        <p style={{ color: '#666' }}>{homestay.address}</p>
        {homestay.styleTags && <p style={{ color: '#1677ff' }}>风格: {homestay.styleTags}</p>}
        {homestay.facilityTags && <p style={{ color: '#52c41a' }}>设施: {homestay.facilityTags}</p>}
        {homestay.avgRating && <p>⭐ {homestay.avgRating}</p>}
        {homestay.intro && <p style={{ color: '#666', lineHeight: 1.8 }}>{homestay.intro}</p>}
      </div>

      {/* Room Types */}
      <div style={{ marginTop: 32 }}>
        <h3>房型选择</h3>
        <div style={{ display: 'grid', gap: 16 }}>
          {(homestay.roomTypes || []).map(room => (
            <div key={room.id}
              onClick={() => setSelectedRoom(room)}
              style={{
                padding: 16, border: `2px solid ${selectedRoom?.id === room.id ? '#1677ff' : '#eee'}`, borderRadius: 12, cursor: 'pointer',
                background: selectedRoom?.id === room.id ? '#f0f5ff' : '#fff',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{room.name}</div>
                  <div style={{ color: '#999', fontSize: 13 }}>
                    {room.bedType || ''} {room.area ? `| ${room.area}㎡` : ''} {room.capacity ? `| 最多${room.capacity}人` : ''}
                  </div>
                  {room.facilities && <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>设施: {room.facilities}</div>}
                </div>
                <div style={{ color: '#e74c3c', fontWeight: 600, fontSize: 20 }}>¥{room.basePrice}<span style={{ fontSize: 13, color: '#999' }}>/晚</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form */}
      {selectedRoom && (
        <div style={{ marginTop: 32, padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 16 }}>预订信息</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label>入住日期</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }} />
            </div>
            <div>
              <label>离店日期</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }} />
            </div>
            <div>
              <label>入住人</label>
              <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="姓名" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }} />
            </div>
            <div>
              <label>电话</label>
              <input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="手机号" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }} />
            </div>
            <div>
              <label>房间数</label>
              <input type="number" min={1} value={roomCount} onChange={(e) => setRoomCount(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }} />
            </div>
          </div>
          {calcNights() > 0 && (
            <div style={{ marginTop: 12, textAlign: 'right', color: '#e74c3c', fontSize: 18, fontWeight: 600 }}>
              共 {calcNights()} 晚 · ¥{selectedRoom.basePrice * calcNights() * roomCount}
            </div>
          )}
          <button onClick={handleBooking} disabled={submitting}
            style={{ marginTop: 16, width: '100%', padding: '12px 0', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}>
            {submitting ? '提交中...' : '立即预订'}
          </button>
        </div>
      )}

      {/* Reviews */}
      <div style={{ marginTop: 32 }}>
        <h3>住客评价 ({reviews.length})</h3>
        {reviews.length === 0 && <p style={{ color: '#999' }}>暂无评价</p>}
        {reviews.map(r => (
          <div key={r.id} style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontWeight: 500 }}>用户{r.userId} ⭐{r.rating}</div>
            {r.content && <div style={{ color: '#666', marginTop: 4 }}>{r.content}</div>}
            {r.merchantReply && <div style={{ color: '#e74c3c', marginTop: 4, paddingLeft: 12, borderLeft: '2px solid #e74c3c' }}>商家回复: {r.merchantReply}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
