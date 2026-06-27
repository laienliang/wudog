import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import request from '../../utils/request';

export default function ListPage() {
  const [tab, setTab] = useState('spots');
  const [spots, setSpots] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSpots = async () => {
    try {
      const res = await request.get('/api/scenic-spot/list', { params: { page: 1, pageSize: 50 } });
      setSpots(res.data?.list || []);
    } catch { /* */ }
  };

  const fetchRoutes = async () => {
    try {
      const res = await request.get('/api/tour-route/list', { params: { page: 1, pageSize: 50 } });
      setRoutes(res.data?.list || []);
    } catch { /* */ }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchSpots(), fetchRoutes()]).finally(() => setLoading(false));
  }, []);

  const tabStyle = (name) => ({
    padding: '10px 24px',
    border: 'none',
    background: tab === name ? '#1677ff' : '#f0f0f0',
    color: tab === name ? '#fff' : '#333',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: tab === name ? 600 : 400,
    marginRight: 12,
  });

  return (
    <div>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h2>景区出行</h2>
        <div>
          <button style={tabStyle('spots')} onClick={() => setTab('spots')}>景区门票</button>
          <button style={tabStyle('routes')} onClick={() => setTab('routes')}>旅游路线</button>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>加载中...</div>}

      {tab === 'spots' && (
        <>
          {!loading && spots.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无景区</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {spots.map(item => (
              <Link key={item.id} to={`/module4/spot/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s' }}>
                  <img src={item.mainImage || '/placeholder.png'} alt={item.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                  <div style={{ padding: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ color: '#999', fontSize: 13, marginBottom: 4 }}>{item.address || ''}</div>
                    {item.openTime && <div style={{ color: '#666', fontSize: 12 }}>开放时间: {item.openTime}</div>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {tab === 'routes' && (
        <>
          {!loading && routes.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无路线</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {routes.map(item => (
              <Link key={item.id} to={`/module4/route/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s' }}>
                  <img src={item.mainImage || '/placeholder.png'} alt={item.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                  <div style={{ padding: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#1677ff', fontSize: 13 }}>{item.theme || ''} | {item.days}天</span>
                      <span style={{ color: '#e74c3c', fontWeight: 600, fontSize: 16 }}>¥{item.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
