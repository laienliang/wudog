import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import request from '../../utils/request';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState({ name: '', phone: '', detail: '' });
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const token = localStorage.getItem('token');

  const fetchCart = async () => {
    if (!token) { navigate('/login'); return; }
    setLoading(true);
    try {
      const res = await request.get('/public/cart/list', { params: { source_module: 'module1' } });
      setItems(res.data || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, []);

  const total = items.reduce((sum, i) => sum + (Number(i.price) || 0) * i.quantity, 0);

  const handleSubmit = async () => {
    if (!address.name || !address.phone || !address.detail) {
      alert('请填写收货信息');
      return;
    }
    if (items.length === 0) {
      alert('购物车为空');
      return;
    }
    setSubmitting(true);
    try {
      const res = await request.post('/public/order/create', {
        type: 'product',
        address_snapshot: address,
        items: items.map(i => ({
          item_type: 'product',
          item_id: i.product_id,
          item_name: i.product_name || '商品',
          item_image: i.product_image || '',
          price: i.price,
          quantity: i.quantity,
          sku_id: i.sku_id,
        })),
      });
      setOrderInfo(res.data);
      setOrderComplete(true);
    } catch (e) {
      alert(e.response?.data?.message || '下单失败');
    } finally { setSubmitting(false); }
  };

  const handlePay = async () => {
    try {
      await request.post(`/public/order/pay/${orderInfo.id}`);
      alert('支付成功（模拟）');
      navigate('/module1/orders');
    } catch (e) {
      alert(e.response?.data?.message || '支付失败');
    }
  };

  if (!token) return <div style={{ textAlign: 'center', padding: 60 }}>请先<Link to="/login">登录</Link></div>;

  if (orderComplete) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', padding: 40 }}>
        <h2>下单成功</h2>
        <p style={{ color: '#666', margin: '12px 0' }}>订单号：{orderInfo?.orderNo}</p>
        <p style={{ fontSize: 20, fontWeight: 'bold', color: '#ff4d4f' }}>¥{Number(orderInfo?.payAmount || orderInfo?.totalAmount).toFixed(2)}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          <button onClick={handlePay} style={{ padding: '12px 32px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16 }}>模拟支付</button>
          <button onClick={() => navigate('/module1/orders')} style={{ padding: '12px 32px', background: '#fff', color: '#1677ff', border: '1px solid #1677ff', borderRadius: 10, cursor: 'pointer', fontSize: 16 }}>查看订单</button>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>加载中...</div>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 20 }}>确认订单</h2>

      {/* Address */}
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>收货信息</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input placeholder="收件人" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })}
            style={{ flex: 1, minWidth: 120, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, outline: 'none', fontSize: 14 }} />
          <input placeholder="手机号" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })}
            style={{ flex: 1, minWidth: 120, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, outline: 'none', fontSize: 14 }} />
        </div>
        <input placeholder="详细地址" value={address.detail} onChange={e => setAddress({ ...address, detail: e.target.value })}
          style={{ width: '100%', marginTop: 12, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, outline: 'none', fontSize: 14, boxSizing: 'border-box' }} />
      </div>

      {/* Order items */}
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>商品清单</h3>
        {items.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #f5f5f5', alignItems: 'center' }}>
            <img src={item.product_image || ''} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, background: '#f5f5f5' }} />
            <div style={{ flex: 1 }}>
              <div>{item.product_name || '商品'}</div>
              {item.sku_spec && <div style={{ fontSize: 12, color: '#999' }}>{item.sku_spec}</div>}
            </div>
            <div style={{ fontSize: 13, color: '#666' }}>x{item.quantity}</div>
            <div style={{ fontWeight: 'bold' }}>¥{(Number(item.price) * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 20, padding: 20, background: '#fff', borderRadius: 12 }}>
        <span>合计：<span style={{ fontSize: 22, fontWeight: 'bold', color: '#ff4d4f' }}>¥{total.toFixed(2)}</span></span>
        <button onClick={handleSubmit} disabled={submitting} style={{
          padding: '12px 40px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16,
        }}>{submitting ? '提交中...' : '提交订单'}</button>
      </div>
    </div>
  );
}
