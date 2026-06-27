import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import request from '../../utils/request';

export default function RouteDetailPage() {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    request.get(`/api/tour-route/detail/${id}`)
      .then(res => setRoute(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>加载中...</div>;
  if (!route) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>路线不存在</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <img src={route.mainImage || '/placeholder.png'} alt={route.title} style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 12 }} />

      <div style={{ marginTop: 20 }}>
        <h2>{route.title}</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
          {route.theme && <span style={{ background: '#f0f5ff', color: '#1677ff', padding: '4px 12px', borderRadius: 4, fontSize: 13 }}>{route.theme}</span>}
          <span style={{ color: '#666' }}>{route.days}天</span>
          <span style={{ color: '#e74c3c', fontWeight: 600, fontSize: 22 }}>¥{route.price}</span>
        </div>

        {route.intro && (
          <div style={{ marginTop: 16 }}>
            <h3>路线简介</h3>
            <p style={{ color: '#666', lineHeight: 1.8 }}>{route.intro}</p>
          </div>
        )}

        {route.includes && (
          <div style={{ marginTop: 16 }}>
            <h3>包含项目</h3>
            <p style={{ color: '#666', lineHeight: 1.8 }}>{route.includes}</p>
          </div>
        )}

        {route.excludes && (
          <div style={{ marginTop: 16 }}>
            <h3>不包含项目</h3>
            <p style={{ color: '#666', lineHeight: 1.8 }}>{route.excludes}</p>
          </div>
        )}

        {route.notes && (
          <div style={{ marginTop: 16 }}>
            <h3>注意事项</h3>
            <p style={{ color: '#666', lineHeight: 1.8 }}>{route.notes}</p>
          </div>
        )}
      </div>

      {/* Itineraries */}
      {(route.itineraries || []).length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3>行程安排</h3>
          {route.itineraries.map((day) => (
            <div key={day.id} style={{ marginBottom: 20, padding: 20, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight: 600, fontSize: 16, color: '#1677ff', marginBottom: 8 }}>
                第{day.dayNumber}天
              </div>
              {day.description && <p style={{ color: '#666', lineHeight: 1.8, marginBottom: 8 }}>{day.description}</p>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                {day.spots && <div><span style={{ color: '#999' }}>景点: </span><span>{day.spots}</span></div>}
                {day.meals && <div><span style={{ color: '#999' }}>餐饮: </span><span>{day.meals}</span></div>}
                {day.accommodation && <div><span style={{ color: '#999' }}>住宿: </span><span>{day.accommodation}</span></div>}
                {day.transport && <div><span style={{ color: '#999' }}>交通: </span><span>{day.transport}</span></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
