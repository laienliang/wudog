import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function RouteListPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const pageSize = 6

  useEffect(() => {
    setLoading(true)
    api.getRoutes(page, pageSize)
      .then((res) => {
        setRoutes(res.list)
        setTotal(res.total)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.ceil(total / pageSize)

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>加载中...</div>

  return (
    <div className="page">
      <h1 className="page-title">路线套餐</h1>
      <div className="card-grid">
        {routes.map((route) => (
          <Link key={route.id} to={`/routes/${route.id}`} className="card">
            <img
              src={route.coverImage || '/placeholder.jpg'}
              alt={route.name}
              className="card-img"
            />
            <div className="card-body">
              <div className="card-title">{route.name}</div>
              <div className="card-desc">
                {route.durationDays}天行程 · {route.minPeople}-{route.maxPeople}人成团
              </div>
              <div className="card-price">
                ¥{route.price} <span className="unit">/人</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>上一页</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>
              {p}
            </button>
          ))}
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>下一页</button>
        </div>
      )}
    </div>
  )
}
