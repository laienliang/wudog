import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import request from '../../utils/request';

export default function SpotDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [visitorName, setVisitorName] = useState('');
  const [visitorIdCard, setVisitorIdCard] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    request.get(`/api/scenic-spot/detail/${id}`)
      .then(res => setSpot(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuy = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    if (!selectedTicket) { alert('请选择票种'); return; }
    if (!visitorName || !visitorIdCard) { alert('请填写游客信息'); return; }
    if (!visitDate) { alert('请选择游玩日期'); return; }

    setSubmitting(true);
    try {
      await request.post('/api/e-ticket/create', {
        ticket_type_id: selectedTicket.id,
        visit_date: visitDate,
        visitor_name: visitorName,
        visitor_id_card: visitorIdCard,
        quantity,
        price: selectedTicket.price,
      });
      alert('购票成功');
      navigate('/module4/orders');
    } catch { alert('购票失败'); } finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>加载中...</div>;
  if (!spot) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>景区不存在</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <img src={spot.mainImage || '/placeholder.png'} alt={spot.name} style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 12 }} />

      <div style={{ marginTop: 20 }}>
        <h2>{spot.name}</h2>
        <p style={{ color: '#666' }}>{spot.address}</p>
        {spot.openTime && <p style={{ color: '#666' }}>开放时间: {spot.openTime}</p>}
        {spot.intro && <p style={{ color: '#666', lineHeight: 1.8 }}>{spot.intro}</p>}
      </div>

      {/* Ticket Types */}
      <div style={{ marginTop: 32 }}>
        <h3>票种选择</h3>
        <div style={{ display: 'grid', gap: 16 }}>
          {(spot.ticketTypes || []).map(ticket => (
            <div key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              style={{
                padding: 16, border: `2px solid ${selectedTicket?.id === ticket.id ? '#1677ff' : '#eee'}`, borderRadius: 12, cursor: 'pointer',
                background: selectedTicket?.id === ticket.id ? '#f0f5ff' : '#fff',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{ticket.name}</div>
                  <div style={{ color: '#999', fontSize: 13 }}>
                    有效期: {ticket.validDays}天 | 库存: {ticket.stock === -1 ? '不限' : ticket.stock}
                  </div>
                  {ticket.description && <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>{ticket.description}</div>}
                </div>
                <div style={{ color: '#e74c3c', fontWeight: 600, fontSize: 20 }}>¥{ticket.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form */}
      {selectedTicket && (
        <div style={{ marginTop: 32, padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 16 }}>购票信息</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label>游客姓名</label>
              <input value={visitorName} onChange={(e) => setVisitorName(e.target.value)} placeholder="姓名" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }} />
            </div>
            <div>
              <label>身份证号</label>
              <input value={visitorIdCard} onChange={(e) => setVisitorIdCard(e.target.value)} placeholder="身份证号" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }} />
            </div>
            <div>
              <label>游玩日期</label>
              <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }} />
            </div>
            <div>
              <label>数量</label>
              <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }} />
            </div>
          </div>
          <div style={{ marginTop: 12, textAlign: 'right', color: '#e74c3c', fontSize: 18, fontWeight: 600 }}>
            合计: ¥{selectedTicket.price * quantity}
          </div>
          <button onClick={handleBuy} disabled={submitting}
            style={{ marginTop: 16, width: '100%', padding: '12px 0', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}>
            {submitting ? '提交中...' : '立即购票'}
          </button>
        </div>
      )}
    </div>
  );
}
