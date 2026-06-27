import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import request from '../../utils/request';

export default function FarmProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingCart, setAddingCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem('token');

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await request.get(`/api/farm-product/detail/${id}`);
      setProduct(res.data);
    } catch { setProduct(null); } finally { setLoading(false); }
  };

  const fetchReviews = async () => {
    try {
      const res = await request.get('/api/restaurant-review/list', { params: { target_type: 'farm_product', target_id: id, pageSize: 10 } });
      setReviews(res.data.list || []);
    } catch { /* */ }
  };

  useEffect(() => { fetchDetail(); fetchReviews(); window.scrollTo(0, 0); }, [id]);

  const addToCart = async () => {
    if (!token) { navigate('/login'); return; }
    setAddingCart(true);
    try {
      await request.post('/public/cart/add', {
        product_id: product.id, quantity, source_module: 'module2',
      });
      alert('已加入购物车');
    } catch { alert('操作失败'); } finally { setAddingCart(false); }
  };

  const buyNow = async () => {
    if (!token) { navigate('/login'); return; }
    setAddingCart(true);
    try {
      await request.post('/public/cart/add', { product_id: product.id, quantity, source_module: 'module2' });
      navigate('/module1/cart');
    } catch { alert('操作失败'); } finally { setAddingCart(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>加载中...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: 60 }}>商品不存在</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
      <div>
        <img src={product.mainImage || 'https://via.placeholder.com/400x400'} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
      </div>
      <div>
        <h1>{product.name}</h1>
        <div style={{ color: '#999', fontSize: 14, marginBottom: 8 }}>
          {product.origin && <span>产地: {product.origin}</span>}
          {product.spec && <span style={{ marginLeft: 16 }}>规格: {product.spec}</span>}
        </div>
        <div style={{ color: '#e74c3c', fontSize: 28, fontWeight: 700, margin: '12px 0' }}>¥{product.price}</div>
        {product.avgRating && <div style={{ marginBottom: 8 }}>⭐{product.avgRating} ({product.reviewCount}评价)</div>}
        <div style={{ color: '#666', lineHeight: 1.6, marginBottom: 16 }}>
          {product.shelfLife && <div>保质期: {product.shelfLife}</div>}
          {product.storageMethod && <div>储存方式: {product.storageMethod}</div>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span>数量:</span>
          <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', cursor: 'pointer', borderRadius: 4 }}>-</button>
          <span style={{ width: 40, textAlign: 'center' }}>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', cursor: 'pointer', borderRadius: 4 }}>+</button>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={addToCart} disabled={addingCart} style={{ padding: '10px 32px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 15 }}>加入购物车</button>
          <button onClick={buyNow} disabled={addingCart} style={{ padding: '10px 32px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 15 }}>立即购买</button>
        </div>

        {product.detail && <div style={{ marginTop: 20, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}><h3>商品详情</h3><div dangerouslySetInnerHTML={{ __html: product.detail }} style={{ lineHeight: 1.8 }} /></div>}
      </div>

      {/* Reviews */}
      <div style={{ gridColumn: '1 / -1', marginTop: 24 }}>
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
