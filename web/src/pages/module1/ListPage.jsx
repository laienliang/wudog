import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import request from '../../utils/request';

export default function ListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await request.get('/api/product-category/list');
      setCategories(res.data || []);
    } catch { /* */ }
  };

  const fetchProducts = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, pageSize: 20, status: 'published' };
      if (activeCategory) params.category_id = activeCategory;
      if (keyword) params.keyword = keyword;
      if (sort !== 'newest') params.sort = sort;
      const res = await request.get('/api/product/list', { params });
      setProducts(res.data.list || []);
      setTotal(res.data.total || 0);
      setPage(p);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(1); }, [activeCategory, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1);
  };

  const pages = Math.ceil(total / 20);

  return (
    <div>
      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setActiveCategory('')} style={{
          padding: '6px 18px', borderRadius: 20, border: '1px solid #e0e0e0',
          background: activeCategory === '' ? '#1677ff' : '#fff',
          color: activeCategory === '' ? '#fff' : '#333', cursor: 'pointer', fontSize: 13,
        }}>全部</button>
        {categories.map(c => (
          <button key={c.id} onClick={() => setActiveCategory(String(c.id))} style={{
            padding: '6px 18px', borderRadius: 20, border: '1px solid #e0e0e0',
            background: activeCategory === String(c.id) ? '#1677ff' : '#fff',
            color: activeCategory === String(c.id) ? '#fff' : '#333', cursor: 'pointer', fontSize: 13,
          }}>{c.name}</button>
        ))}
        <div style={{ flex: 1 }} />
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input placeholder="搜索商品" value={keyword} onChange={e => setKeyword(e.target.value)}
            style={{ padding: '6px 14px', border: '1px solid #e0e0e0', borderRadius: 20, outline: 'none', fontSize: 13, width: 160 }} />
          <button type="submit" style={{ padding: '6px 16px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 20, cursor: 'pointer', fontSize: 13 }}>搜索</button>
        </form>
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, fontSize: 13, color: '#666' }}>
        {[{ key: 'newest', label: '最新' }, { key: 'sales', label: '销量' }, { key: 'price-asc', label: '价格↑' }, { key: 'price-desc', label: '价格↓' }].map(s => (
          <span key={s.key} onClick={() => setSort(s.key)} style={{
            cursor: 'pointer', color: sort === s.key ? '#1677ff' : '#666', fontWeight: sort === s.key ? 'bold' : 'normal',
          }}>{s.label}</span>
        ))}
      </div>

      {/* Product grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>加载中...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>暂无商品</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {products.map(p => (
              <Link key={p.id} to={`/module1/detail/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'box-shadow .2s', cursor: 'pointer' }}>
                  <div style={{ width: '100%', height: 200, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {p.mainImage ? <img src={p.mainImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#ccc', fontSize: 40 }}>📷</span>}
                  </div>
                  <div style={{ padding: 14 }}>
                    <h3 style={{ fontSize: 15, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 'bold', color: '#ff4d4f' }}>¥{Number(p.price).toFixed(2)}</span>
                      {p.marketPrice && <span style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>¥{Number(p.marketPrice).toFixed(2)}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>已售 {p.sales || 0}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 30 }}>
              <button disabled={page <= 1} onClick={() => fetchProducts(page - 1)} style={{
                padding: '8px 16px', border: '1px solid #e0e0e0', borderRadius: 6, background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer',
              }}>上一页</button>
              <span style={{ padding: '8px 12px', fontSize: 13, color: '#666' }}>{page} / {pages}</span>
              <button disabled={page >= pages} onClick={() => fetchProducts(page + 1)} style={{
                padding: '8px 16px', border: '1px solid #e0e0e0', borderRadius: 6, background: '#fff', cursor: page >= pages ? 'not-allowed' : 'pointer',
              }}>下一页</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
