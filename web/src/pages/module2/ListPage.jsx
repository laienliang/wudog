import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import request from '../../utils/request';

export default function ListPage() {
  const [tab, setTab] = useState('restaurant');
  const [restaurants, setRestaurants] = useState([]);
  const [farmProducts, setFarmProducts] = useState([]);
  const [farmCategories, setFarmCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await request.get('/api/restaurant/list', { params: { keyword: keyword || undefined, pageSize: 50 } });
      setRestaurants(res.data.list || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  const fetchFarmProducts = async () => {
    setLoading(true);
    try {
      const params = { pageSize: 50, status: 'published' };
      if (keyword) params.keyword = keyword;
      if (activeCat) params.category_id = activeCat;
      const res = await request.get('/api/farm-product/list', { params });
      setFarmProducts(res.data.list || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await request.get('/api/farm-product/category/list');
      setFarmCategories(res.data || []);
    } catch { /* */ }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { if (tab === 'restaurant') fetchRestaurants(); else fetchFarmProducts(); }, [tab, keyword, activeCat]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button onClick={() => setTab('restaurant')} style={{ padding: '8px 24px', border: 'none', borderRadius: 6, cursor: 'pointer', background: tab === 'restaurant' ? '#1677ff' : '#f0f0f0', color: tab === 'restaurant' ? '#fff' : '#333', fontSize: 16 }}>餐厅</button>
        <button onClick={() => setTab('farm')} style={{ padding: '8px 24px', border: 'none', borderRadius: 6, cursor: 'pointer', background: tab === 'farm' ? '#1677ff' : '#f0f0f0', color: tab === 'farm' ? '#fff' : '#333', fontSize: 16 }}>农产品</button>
        <input placeholder="搜索..." value={keyword} onChange={e => setKeyword(e.target.value)} style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: 6, border: '1px solid #d9d9d9', width: 260 }} />
      </div>

      {tab === 'farm' && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <button onClick={() => setActiveCat(0)} style={{ padding: '6px 14px', border: '1px solid #d9d9d9', borderRadius: 20, cursor: 'pointer', background: activeCat === 0 ? '#1677ff' : '#fff', color: activeCat === 0 ? '#fff' : '#333', fontSize: 13 }}>全部</button>
          {farmCategories.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{ padding: '6px 14px', border: '1px solid #d9d9d9', borderRadius: 20, cursor: 'pointer', background: activeCat === c.id ? '#1677ff' : '#fff', color: activeCat === c.id ? '#fff' : '#333', fontSize: 13 }}>{c.name}</button>
          ))}
        </div>
      )}

      {loading && <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div>}

      {tab === 'restaurant' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {restaurants.map(r => (
            <Link key={r.id} to={`/module2/restaurant/${r.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
                <img src={r.mainImage || 'https://via.placeholder.com/300x180'} alt={r.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                <div style={{ padding: 12 }}>
                  <h3 style={{ margin: '0 0 4px' }}>{r.name}</h3>
                  <p style={{ color: '#666', fontSize: 13, margin: '0 0 4px' }}>{r.address || '-'}</p>
                  <p style={{ color: '#999', fontSize: 12, margin: 0 }}>{r.businessHours || ''} {r.avgRating && `· ⭐${r.avgRating}`}</p>
                </div>
              </div>
            </Link>
          ))}
          {restaurants.length === 0 && !loading && <div style={{ textAlign: 'center', color: '#999', gridColumn: '1 / -1', padding: 40 }}>暂无餐厅</div>}
        </div>
      )}

      {tab === 'farm' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {farmProducts.map(p => (
            <Link key={p.id} to={`/module2/farm/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
                <img src={p.mainImage || 'https://via.placeholder.com/240x240'} alt={p.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                <div style={{ padding: 12 }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: 15 }}>{p.name}</h3>
                  <p style={{ color: '#999', fontSize: 12, margin: '0 0 4px' }}>{p.origin || ''}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#e74c3c', fontWeight: 600, fontSize: 16 }}>¥{p.price}</span>
                    <span style={{ color: '#999', fontSize: 12 }}>已售{p.sales}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {farmProducts.length === 0 && !loading && <div style={{ textAlign: 'center', color: '#999', gridColumn: '1 / -1', padding: 40 }}>暂无农产品</div>}
        </div>
      )}
    </div>
  );
}
