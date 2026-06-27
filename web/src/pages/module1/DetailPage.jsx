import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import request from '../../utils/request';

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [addingCart, setAddingCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem('token');

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await request.get(`/api/product/detail/${id}`);
      setProduct(res.data);
      setSelectedSku(null);
      setQuantity(1);
    } catch { setProduct(null); } finally { setLoading(false); }
  };

  const fetchReviews = async () => {
    try {
      const res = await request.get('/api/product-review/list', { params: { productId: id, pageSize: 10 } });
      setReviews(res.data.list || []);
    } catch { /* */ }
  };

  useEffect(() => { fetchDetail(); fetchReviews(); window.scrollTo(0, 0); }, [id]);

  const displayPrice = selectedSku?.price ?? product?.price;
  const allImages = product ? [product.mainImage, ...(product.images || []).map(i => i.url)].filter(Boolean) : [];

  const addToCart = async () => {
    if (!token) { navigate('/login'); return; }
    setAddingCart(true);
    try {
      await request.post('/public/cart/add', {
        product_id: product.id,
        sku_id: selectedSku?.id || null,
        quantity,
        source_module: 'module1',
      });
      alert('已加入购物车');
    } catch (e) { alert(e.response?.data?.message || '操作失败'); } finally { setAddingCart(false); }
  };

  const buyNow = async () => {
    if (!token) { navigate('/login'); return; }
    try {
      await request.post('/public/cart/add', { product_id: product.id, sku_id: selectedSku?.id || null, quantity, source_module: 'module1' });
      navigate('/module1/cart');
    } catch (e) { alert(e.response?.data?.message || '操作失败'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>加载中...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>商品不存在</div>;

  return (
    <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
      {/* Images */}
      <div style={{ flex: '1 1 450px', maxWidth: 500 }}>
        {allImages.length > 0 ? (
          <>
            <div style={{ width: '100%', height: 400, background: '#f5f5f5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 12 }}>
              <img src={allImages[currentImage]} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, overflow: 'auto' }}>
              {allImages.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => setCurrentImage(i)}
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: i === currentImage ? '2px solid #1677ff' : '2px solid transparent' }} />
              ))}
            </div>
          </>
        ) : (
          <div style={{ width: '100%', height: 400, background: '#f5f5f5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 60 }}>📷</div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: '1 1 350px' }}>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>{product.title}</h1>
        {product.subtitle && <p style={{ color: '#999', marginBottom: 16 }}>{product.subtitle}</p>}

        <div style={{ background: '#fff7f0', padding: '16px 20px', borderRadius: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 28, fontWeight: 'bold', color: '#ff4d4f' }}>¥{Number(displayPrice).toFixed(2)}</span>
          {product.marketPrice && <span style={{ fontSize: 14, color: '#999', textDecoration: 'line-through', marginLeft: 10 }}>¥{Number(product.marketPrice).toFixed(2)}</span>}
          <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>库存: {selectedSku?.stock ?? product.stock} | 销量: {product.sales}</div>
        </div>

        {/* SKU selector */}
        {product.skus?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>规格</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.skus.map(sku => (
                <button key={sku.id} onClick={() => setSelectedSku(sku)} style={{
                  padding: '8px 16px', border: selectedSku?.id === sku.id ? '2px solid #1677ff' : '1px solid #e0e0e0',
                  borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13,
                }}>{sku.specName} {sku.price ? `¥${Number(sku.price).toFixed(2)}` : ''}</button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>数量</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 36, height: 36, border: '1px solid #e0e0e0', background: '#fff', borderRadius: '8px 0 0 8px', cursor: 'pointer', fontSize: 18 }}>-</button>
            <input value={quantity} readOnly style={{ width: 50, height: 36, border: '1px solid #e0e0e0', borderLeft: 'none', borderRight: 'none', textAlign: 'center', outline: 'none' }} />
            <button onClick={() => setQuantity(quantity + 1)} style={{ width: 36, height: 36, border: '1px solid #e0e0e0', background: '#fff', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontSize: 18 }}>+</button>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button onClick={addToCart} disabled={addingCart} style={{
            flex: 1, padding: '14px', background: '#fff', color: '#1677ff', border: '1px solid #1677ff', borderRadius: 10, cursor: 'pointer', fontSize: 16,
          }}>{addingCart ? '...' : '加入购物车'}</button>
          <button onClick={buyNow} style={{
            flex: 1, padding: '14px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16,
          }}>立即购买</button>
        </div>

        {/* Craft & inheritor */}
        {product.craftIntro && <div style={{ marginBottom: 12, padding: 12, background: '#f9f9f9', borderRadius: 8, fontSize: 13, lineHeight: 1.8, color: '#555' }}><strong>工艺介绍：</strong>{product.craftIntro}</div>}
        {product.inheritorName && <div style={{ marginBottom: 12, fontSize: 13, color: '#555' }}><strong>传承人：</strong>{product.inheritorName}</div>}

        {/* Reviews */}
        <div style={{ marginTop: 30 }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>商品评价 ({product.reviewCount || 0})</h3>
          {reviews.length === 0 ? (
            <p style={{ color: '#ccc', fontSize: 13 }}>暂无评价</p>
          ) : (
            reviews.map(r => (
              <div key={r.id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#999' }}>{r.isAnonymous ? '匿名用户' : `用户${r.userId}`}</span>
                  <span style={{ color: '#ff9500', fontSize: 13 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p style={{ fontSize: 13, margin: '4px 0' }}>{r.content}</p>
                {r.merchantReply && <p style={{ fontSize: 12, color: '#1677ff', background: '#f0f5ff', padding: '6px 10px', borderRadius: 6 }}>商家回复：{r.merchantReply}</p>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Rich detail */}
      {product.detail && (
        <div style={{ width: '100%', marginTop: 30, padding: 20, background: '#fff', borderRadius: 12 }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>商品详情</h3>
          <div dangerouslySetInnerHTML={{ __html: product.detail }} style={{ fontSize: 14, lineHeight: 1.8 }} />
        </div>
      )}
    </div>
  );
}
