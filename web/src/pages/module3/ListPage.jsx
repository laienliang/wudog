import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import request from '../../utils/request';

export default function ListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const fetchData = useCallback(async (p = 1, kw = keyword) => {
    setLoading(true);
    try {
      const res = await request.get('/api/homestay/list', { params: { page: p, pageSize, keyword: kw } });
      if (p === 1) {
        setData(res.data?.list || []);
      } else {
        setData(prev => [...prev, ...(res.data?.list || [])]);
      }
      setTotal(res.data?.total || 0);
      setPage(p);
    } catch { /* */ } finally { setLoading(false); }
  }, [keyword]);

  useEffect(() => { fetchData(1, keyword); }, [keyword]);

  const hasMore = data.length < total;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 16 }}>民宿预订</h2>
        <div style={{ textAlign: 'center' }}>
          <input
            type="text" placeholder="搜索民宿..." value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ padding: '8px 16px', width: 320, borderRadius: 20, border: '1px solid #ddd', fontSize: 14 }}
          />
        </div>
      </div>

      {loading && data.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>加载中...</div>}
      {!loading && data.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无民宿</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {data.map(item => (
          <Link key={item.id} to={`/module3/homestay/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s' }}>
              <img src={item.mainImage || '/placeholder.png'} alt={item.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
              <div style={{ padding: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{item.name}</div>
                <div style={{ color: '#999', fontSize: 13, marginBottom: 4 }}>{item.address || ''}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.avgRating && <span style={{ color: '#faad14' }}>⭐ {item.avgRating}</span>}
                  {item.styleTags && <span style={{ color: '#1677ff', fontSize: 12 }}>{item.styleTags.split(',')[0]}</span>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => fetchData(page + 1, keyword)} disabled={loading}
            style={{ padding: '10px 40px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
            加载更多 ({data.length}/{total})
          </button>
        </div>
      )}
    </div>
  );
}
