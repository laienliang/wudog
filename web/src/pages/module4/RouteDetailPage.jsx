import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import request from '../../utils/request';

export default function RouteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [quantity, setQuantity] = useState(1);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    request.get(`/api/tour-route/detail/${id}`)
      .then(res => setRoute(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = async () => {
    if (!token) { navigate('/login'); return; }
    if (!contactName || !contactPhone) { alert('请填写联系信息'); return; }
    setSubmitting(true);
    try {
      await request.post('/public/order/create', {
        type: 'tour',
        items: [{
          item_type: 'tour_route',
          item_id: route.id,
          item_name: route.title,
          item_image: route.mainImage || '',
          price: Number(route.price),
          quantity,
        }],
        remark: `联系人: ${contactName} ${contactPhone}`,
      });
      alert('下单成功，请前往订单页支付');
      navigate('/mine');
    } catch { alert('下单失败'); } finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>加载中...</div>;
  if (!route) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>路线不存在</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <img src={route.mainImage || '/placeholder.png'} alt={route.title} style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 12 }} />

      <div style={{ marginTop: 20 }}>
        <h2>{route.title}</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
          {route.theme && <span style={{ background: '#f0f5ff', color: '#1677ff', padding: '4px 12px', borderRadius: 4, fontSize: 13 }}>{route.theme}</span>}
          <span style={{ color: '#666' }}>{route.days}天</span>
          <span style={{ color: '#e74c3c', fontWeight: 600, fontSize: 22 }}>¥{route.price}</span>
        </div>

        {route.intro && (
          <div style={{ marginTop: 16 }}>
            <h3>路线简介</h3>
            <p style={{ color: '#666', lineHeight: 1.8 }}>{route.intro}</p>
          </div>
        )}

        {route.includes && (
          <div style={{ marginTop: 16 }}>
            <h3>包含项目</h3>
            <p style={{ color: '#666', lineHeight: 1.8 }}>{route.includes}</p>
          </div>
        )}

        {route.excludes && (
          <div style={{ marginTop: 16 }}>
            <h3>不包含项目</h3>
            <p style={{ color: '#666', lineHeight: 1.8 }}>{route.excludes}</p>
          </div>
        )}

        {route.notes && (
          <div style={{ marginTop: 16 }}>
            <h3>注意事项</h3>
            <p style={{ color: '#666', lineHeight: 1.8 }}>{route.notes}</p>
          </div>
        )}
      </div>

      {/* Itineraries */}
      {(route.itineraries || []).length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3>行程安排</h3>
          {route.itineraries.map((day) => (
            <div key={day.id} style={{ marginBottom: 20, padding: 20, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight: 600, fontSize: 16, color: '#1677ff', marginBottom: 8 }}>
                第{day.dayNumber}天
              </div>
              {day.description && <p style={{ color: '#666', lineHeight: 1.8, marginBottom: 8 }}>{day.description}</p>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                {day.spots && <div><span style={{ color: '#999' }}>景点: </span><span>{day.spots}</span></div>}
                {day.meals && <div><span style={{ color: '#999' }}>餐饮: </span><span>{day.meals}</span></div>}
                {day.accommodation && <div><span style={{ color: '#999' }}>住宿: </span><span>{day.accommodation}</span></div>}
                {day.transport && <div><span style={{ color: '#999' }}>交通: </span><span>{day.transport}</span></div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking */}
      <div style={{ marginTop: 32, padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginBottom: 16 }}>预订路线</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 500 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>数量</label>
            <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>联系人</label>
            <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="姓名" style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>联系电话</label>
            <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="手机号" style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9' }} />
          </div>
        </div>
        <div style={{ marginTop: 12, color: '#e74c3c', fontSize: 16, fontWeight: 600 }}>
          合计: ¥{(Number(route.price) * quantity).toFixed(2)}
        </div>
        <button onClick={handleBooking} disabled={submitting}
          style={{ marginTop: 16, width: '100%', maxWidth: 500, padding: '12px 0', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}>
          {submitting ? '提交中...' : '立即预订'}
        </button>
      </div>
    </div>
  );
}
