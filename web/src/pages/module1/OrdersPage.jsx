import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import request from '../../utils/request';

const statusLabels = {
  pending: '待支付', paid: '已支付', confirmed: '已确认', shipped: '已发货',
  completed: '已完成', cancelled: '已取消', refunding: '退款中', refunded: '已退款',
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    if (!token) { navigate('/login'); return; }
    setLoading(true);
    try {
      const res = await request.get('/public/order/list', { params: {} });
      setOrders(res.data.list || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleAction = async (orderId, action) => {
    try {
      if (action === 'pay') await request.post(`/public/order/pay/${orderId}`);
      else if (action === 'cancel') await request.put(`/public/order/cancel/${orderId}`);
      else if (action === 'confirm') await request.put(`/public/order/confirm/${orderId}`);
      fetchOrders();
    } catch (e) { alert(e.response?.data?.message || '操作失败'); }
  };

  if (!token) return <div style={{ textAlign: 'center', padding: 60 }}>请先<Link to="/login">登录</Link></div>;
  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>加载中...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>我的订单</h2>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
          <p>暂无订单</p>
          <Link to="/module1" style={{ color: '#1677ff' }}>去逛逛</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f5f5f5' }}>
                <div>
                  <span style={{ fontSize: 13, color: '#999' }}>订单号：{order.orderNo}</span>
                  <span style={{ marginLeft: 16, fontSize: 13, color: '#999' }}>{new Date(order.createdAt).toLocaleString('zh-CN')}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 'bold', color: '#1677ff' }}>{statusLabels[order.status] || order.status}</span>
              </div>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                  <img src={item.itemImage || ''} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6, background: '#f5f5f5' }} />
                  <div style={{ flex: 1 }}>{item.itemName}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>x{item.quantity}</div>
                  <div style={{ fontWeight: 'bold' }}>¥{(Number(item.price) * item.quantity).toFixed(2)}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid #f5f5f5' }}>
                <span>合计：<span style={{ fontSize: 18, fontWeight: 'bold', color: '#ff4d4f' }}>¥{Number(order.payAmount || order.totalAmount).toFixed(2)}</span></span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {order.status === 'pending' && (
                    <>
                      <button onClick={() => handleAction(order.id, 'pay')} style={{ padding: '6px 16px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>支付</button>
                      <button onClick={() => handleAction(order.id, 'cancel')} style={{ padding: '6px 16px', background: '#fff', color: '#999', border: '1px solid #e0e0e0', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>取消</button>
                    </>
                  )}
                  {order.status === 'shipped' && (
                    <button onClick={() => handleAction(order.id, 'confirm')} style={{ padding: '6px 16px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>确认收货</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
