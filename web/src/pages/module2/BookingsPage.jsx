import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/request';

const statusText = { pending: '待确认', confirmed: '已确认', rejected: '已拒绝', cancelled: '已取消', completed: '已完成' };
const statusColor = { pending: '#faad14', confirmed: '#52c41a', rejected: '#e74c3c', cancelled: '#999', completed: '#1677ff' };

export default function BookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    if (!token) { navigate('/login'); return; }
    setLoading(true);
    try {
      const res = await request.get('/api/restaurant-booking/list');
      setBookings(res.data.list || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('确定取消预订？')) return;
    try {
      await request.put(`/api/restaurant-booking/cancel/${id}`);
      fetchData();
    } catch { /* */ }
  };

  return (
    <div>
      <h2>我的餐厅预订</h2>
      {loading && <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div>}
      {!loading && bookings.length === 0 && <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>暂无预订</div>}
      {bookings.map(b => (
        <div key={b.id} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{b.restaurantName}</h3>
            <span style={{ padding: '4px 12px', borderRadius: 4, background: statusColor[b.status], color: '#fff', fontSize: 13 }}>{statusText[b.status] || b.status}</span>
          </div>
          <div style={{ color: '#666', fontSize: 14, marginTop: 8 }}>
            <span>日期: {b.bookingDate}</span>
            <span style={{ marginLeft: 20 }}>时段: {b.slotName}</span>
            <span style={{ marginLeft: 20 }}>人数: {b.guestCount}</span>
          </div>
          <div style={{ color: '#666', fontSize: 14, marginTop: 4 }}>
            <span>联系人: {b.contactName}</span>
            <span style={{ marginLeft: 20 }}>电话: {b.contactPhone}</span>
          </div>
          {b.remark && <div style={{ color: '#999', fontSize: 13, marginTop: 4 }}>备注: {b.remark}</div>}
          {b.merchantRemark && <div style={{ color: '#e74c3c', fontSize: 13, marginTop: 4 }}>商家备注: {b.merchantRemark}</div>}
          {b.status === 'pending' && (
            <button onClick={() => handleCancel(b.id)} style={{ marginTop: 8, padding: '6px 16px', border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', color: '#666' }}>取消预订</button>
          )}
        </div>
      ))}
    </div>
  );
}
