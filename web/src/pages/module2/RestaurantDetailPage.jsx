import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import request from '../../utils/request';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem('token');

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await request.get(`/api/restaurant/detail/${id}`);
      setRestaurant(res.data);
    } catch { setRestaurant(null); } finally { setLoading(false); }
  };

  const fetchReviews = async () => {
    try {
      const res = await request.get('/api/restaurant-review/list', { params: { target_type: 'restaurant', target_id: id, pageSize: 10 } });
      setReviews(res.data.list || []);
    } catch { /* */ }
  };

  useEffect(() => { fetchDetail(); fetchReviews(); window.scrollTo(0, 0); }, [id]);

  const handleBooking = async () => {
    if (!token) { navigate('/login'); return; }
    if (!selectedSlot) { alert('请选择时段'); return; }
    if (!bookingDate) { alert('请选择日期'); return; }
    if (!contactName || !contactPhone) { alert('请填写联系信息'); return; }
    setSubmitting(true);
    try {
      await request.post('/api/restaurant-booking/create', {
        restaurant_id: Number(id),
        booking_date: bookingDate,
        slot_id: selectedSlot.id,
        guest_count: guestCount,
        contact_name: contactName,
        contact_phone: contactPhone,
        remark: remark || undefined,
      });
      alert('预订成功，等待餐厅确认');
      navigate('/module2/bookings');
    } catch { alert('预订失败'); } finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>加载中...</div>;
  if (!restaurant) return <div style={{ textAlign: 'center', padding: 60 }}>餐厅不存在</div>;

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div>
      <img src={restaurant.mainImage || 'https://via.placeholder.com/800x300'} alt={restaurant.name} style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }} />
      <h1 style={{ marginTop: 16 }}>{restaurant.name}</h1>
      <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>
        <span>{restaurant.address || ''}</span>
        <span style={{ marginLeft: 16 }}>营业时间: {restaurant.businessHours || '未设置'}</span>
        <span style={{ marginLeft: 16 }}>容纳: {restaurant.capacity}人</span>
        {restaurant.avgRating && <span style={{ marginLeft: 16 }}>⭐{restaurant.avgRating}</span>}
      </div>
      {restaurant.intro && <p style={{ color: '#555', lineHeight: 1.6 }}>{restaurant.intro}</p>}

      {/* Dishes */}
      {restaurant.dishes?.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>菜品</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {restaurant.dishes.map(d => (
              <div key={d.id} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, display: 'flex', gap: 12 }}>
                <img src={d.image || 'https://via.placeholder.com/80'} alt={d.name} style={{ width: 80, height: 80, borderRadius: 6, objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{d.name} {d.isSignature === 1 && <span style={{ color: '#faad14', fontSize: 12 }}>招牌</span>}</div>
                  <div style={{ color: '#e74c3c', fontWeight: 600 }}>¥{d.price}</div>
                  {d.intro && <div style={{ color: '#999', fontSize: 12 }}>{d.intro}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking */}
      <div style={{ marginTop: 32, background: '#fafafa', borderRadius: 8, padding: 20 }}>
        <h3>预订餐位</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 500 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>日期</label>
            <input type="date" min={minDate} value={bookingDate} onChange={e => setBookingDate(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>时段</label>
            <select value={selectedSlot?.id || ''} onChange={e => { const s = restaurant.slots?.find(sl => sl.id === Number(e.target.value)); setSelectedSlot(s || null); }} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9' }}>
              <option value="">选择时段</option>
              {(restaurant.slots || []).map(s => <option key={s.id} value={s.id}>{s.slotName}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>人数</label>
            <input type="number" min={1} value={guestCount} onChange={e => setGuestCount(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>联系人</label>
            <input value={contactName} onChange={e => setContactName(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>联系电话</label>
            <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>备注</label>
            <input value={remark} onChange={e => setRemark(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9' }} />
          </div>
        </div>
        <button onClick={handleBooking} disabled={submitting} style={{ marginTop: 16, padding: '10px 32px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 15 }}>{submitting ? '提交中...' : '立即预订'}</button>
      </div>

      {/* Reviews */}
      <div style={{ marginTop: 32 }}>
        <h3>评价 ({reviews.length})</h3>
        {reviews.length === 0 && <p style={{ color: '#999' }}>暂无评价</p>}
        {reviews.map(r => (
          <div key={r.id} style={{ borderBottom: '1px solid #f0f0f0', padding: '12px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>用户{r.userId} {'⭐'.repeat(r.rating)}</span>
              <span style={{ color: '#999', fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            {r.content && <p style={{ margin: '6px 0 0', color: '#555' }}>{r.content}</p>}
            {r.merchantReply && <p style={{ margin: '4px 0 0', color: '#1677ff', fontSize: 13, background: '#f6f8fa', padding: '6px 12px', borderRadius: 4 }}>商家回复: {r.merchantReply}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
