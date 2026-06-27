import { useState, useEffect } from 'react';
import request from '../../utils/request';

const statusMap = {
  unused: { color: '#1677ff', text: '未使用' },
  used: { color: '#52c41a', text: '已核销' },
  refunded: { color: '#999', text: '已退款' },
  expired: { color: '#faad14', text: '已过期' },
};

export default function OrdersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await request.get('/api/e-ticket/list');
      setData(res.data || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2>我的电子票</h2>
      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>加载中...</div>}
      {!loading && data.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无电子票</div>}
      {data.map(item => (
        <div key={item.id} style={{ padding: 16, marginBottom: 12, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>票号: {item.ticketCode}</span>
            <span style={{ background: statusMap[item.status]?.color, color: '#fff', padding: '4px 12px', borderRadius: 4, fontSize: 13 }}>
              {statusMap[item.status]?.text || item.status}
            </span>
          </div>
          <div style={{ color: '#666', fontSize: 14 }}>
            游客: {item.visitorName || '-'} | 游玩日期: {item.visitDate || '-'}
          </div>
          <div style={{ color: '#666', fontSize: 14 }}>
            数量: {item.quantity} | 单价: ¥{item.price} | 小计: ¥{item.quantity * item.price}
          </div>
          {item.usedAt && <div style={{ color: '#52c41a', fontSize: 13 }}>核销时间: {new Date(item.usedAt).toLocaleString()}</div>}
        </div>
      ))}
    </div>
  );
}
