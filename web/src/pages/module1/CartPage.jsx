import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import request from '../../utils/request';

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    try {
      await request.put(`/public/cart/update/${id}`, { quantity: qty });
      fetchCart();
    } catch { /* */ }
  };

  const removeItem = async (id) => {
    try {
      await request.delete(`/public/cart/delete/${id}`);
      fetchCart();
    } catch { /* */ }
  };

  const total = items.reduce((sum, i) => sum + (Number(i.price) || 0) * i.quantity, 0);

  if (!token) return <div style={{ textAlign: 'center', padding: 60 }}>请先<Link to="/login">登录</Link></div>;
  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>加载中...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>购物车</h2>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
          <p>购物车是空的</p>
          <Link to="/module1" style={{ color: '#1677ff' }}>去逛逛</Link>
        </div>
      ) : (
        <>
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
                <img src={item.product_image || ''} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, background: '#f5f5f5' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{item.product_name || '商品'}</div>
                  {item.sku_spec && <div style={{ fontSize: 12, color: '#999' }}>{item.sku_spec}</div>}
                  <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>¥{Number(item.price).toFixed(2)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ width: 30, height: 30, border: '1px solid #e0e0e0', background: '#fff', borderRadius: '6px 0 0 6px', cursor: 'pointer' }}>-</button>
                  <input value={item.quantity} readOnly style={{ width: 40, height: 30, border: '1px solid #e0e0e0', borderLeft: 'none', borderRight: 'none', textAlign: 'center', outline: 'none' }} />
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ width: 30, height: 30, border: '1px solid #e0e0e0', background: '#fff', borderRadius: '0 6px 6px 0', cursor: 'pointer' }}>+</button>
                </div>
                <div style={{ fontWeight: 'bold', width: 80, textAlign: 'right' }}>¥{(Number(item.price) * item.quantity).toFixed(2)}</div>
                <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: 20 }}>×</button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 20, marginTop: 20, padding: 20, background: '#fff', borderRadius: 12 }}>
            <span style={{ fontSize: 14, color: '#666' }}>共 {items.reduce((s, i) => s + i.quantity, 0)} 件</span>
            <span style={{ fontSize: 14 }}>合计：<span style={{ fontSize: 22, fontWeight: 'bold', color: '#ff4d4f' }}>¥{total.toFixed(2)}</span></span>
            <button onClick={() => navigate('/module1/checkout')} style={{
              padding: '12px 32px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16,
            }}>去结算</button>
          </div>
        </>
      )}
    </div>
  );
}
