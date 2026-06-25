import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function HomePage() {
  const [spots, setSpots] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getScenicSpots(1, 6), api.getRoutes(1, 4)])
      .then(([spotRes, routeRes]) => {
        setSpots(spotRes.list)
        setRoutes(routeRes.list)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>加载中...</div>

  return (
    <div className="page">
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 12,
          padding: '60px 40px',
          color: '#fff',
          marginBottom: 40,
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: 32, marginBottom: 12 }}>探索乌东之美</h1>
        <p style={{ fontSize: 16, opacity: 0.9 }}>
          精选景区门票 · 苗寨深度路线 · 一键预订
        </p>
      </div>

      {/* 景区推荐 */}
      <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        热门景区
      </h2>
      <div className="card-grid" style={{ marginBottom: 40 }}>
        {spots.map((spot) => (
          <div key={spot.id} className="card">
            <img
              src={spot.coverImage || '/placeholder.jpg'}
              alt={spot.name}
              className="card-img"
            />
            <div className="card-body">
              <div className="card-title">{spot.name}</div>
              <div className="card-desc">{spot.address}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Link to="/scenic" className="btn btn-outline">查看全部景区 →</Link>
      </div>

      {/* 路线推荐 */}
      <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        推荐路线
      </h2>
      <div className="card-grid">
        {routes.map((route) => (
          <div key={route.id} className="card">
            <img
              src={route.coverImage || '/placeholder.jpg'}
              alt={route.name}
              className="card-img"
            />
            <div className="card-body">
              <div className="card-title">{route.name}</div>
              <div className="card-desc">
                {route.durationDays}天{route.minPeople}-{route.maxPeople}人成团
              </div>
              <div className="card-price">
                ¥{route.price} <span className="unit">/人</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Link to="/routes" className="btn btn-outline">查看全部路线 →</Link>
      </div>
    </div>
  )
}
