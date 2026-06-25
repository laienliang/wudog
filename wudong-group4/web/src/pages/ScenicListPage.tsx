import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type ScenicSpot } from '../api'

export default function ScenicListPage() {
  const [spots, setSpots] = useState<ScenicSpot[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const pageSize = 8

  useEffect(() => {
    setLoading(true)
    api.getScenicSpots(page, pageSize)
      .then((res) => {
        setSpots(res.list)
        setTotal(res.total)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.ceil(total / pageSize)

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>加载中...</div>

  return (
    <div className="page">
      <h1 className="page-title">景区门票</h1>
      <div className="card-grid">
        {spots.map((spot) => (
          <Link key={spot.id} to={`/scenic/${spot.id}`} className="card">
            <img
              src={spot.coverImage || '/placeholder.jpg'}
              alt={spot.name}
              className="card-img"
            />
            <div className="card-body">
              <div className="card-title">{spot.name}</div>
              <div className="card-desc">{spot.address}</div>
              <div style={{ marginTop: 8 }}>
                <span className={`badge ${spot.status === 1 ? 'badge-success' : 'badge-error'}`}>
                  {spot.status === 1 ? '营业中' : '已歇业'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
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
