import { useState, useEffect } from 'react';
import request from '../../utils/request';

const statusMap = {
  pending: { color: '#faad14', text: '待支付' },
  paid: { color: '#1677ff', text: '已支付' },
  confirmed: { color: '#52c41a', text: '已确认' },
  cancelled: { color: '#999', text: '已取消' },
  refunding: { color: '#faad14', text: '退款中' },
  refunded: { color: '#999', text: '已退款' },
  completed: { color: '#1677ff', text: '已完成' },
};

export default function OrdersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await request.get('/api/homestay-booking/list');
      setData(res.data || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('确定取消预订？')) return;
    try {
      await request.put(`/api/homestay-booking/cancel/${id}`);
      fetchData();
    } catch { alert('操作失败'); }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2>我的民宿预订</h2>
      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>加载中...</div>}
      {!loading && data.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无预订</div>}
      {data.map(item => (
        <div key={item.id} style={{ padding: 16, marginBottom: 12, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>民宿ID: {item.homestayId} | 房型ID: {item.roomTypeId}</span>
            <span style={{ background: statusMap[item.status]?.color, color: '#fff', padding: '4px 12px', borderRadius: 4, fontSize: 13 }}>
              {statusMap[item.status]?.text || item.status}
            </span>
          </div>
          <div style={{ color: '#666', fontSize: 14 }}>
            {item.checkInDate} ~ {item.checkOutDate} ({item.nights}晚)
          </div>
          <div style={{ color: '#666', fontSize: 14 }}>
            {item.guestName} {item.guestPhone} | {item.roomCount}间 | ¥{item.totalAmount}
          </div>
          {item.status === 'pending' && (
            <button onClick={() => handleCancel(item.id)}
              style={{ marginTop: 8, padding: '6px 16px', background: '#fff', border: '1px solid #d9d9d9', borderRadius: 6, cursor: 'pointer' }}>取消预订</button>
          )}
        </div>
      ))}
    </div>
  );
}
