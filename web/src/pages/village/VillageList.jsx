import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMiaoVillageList } from '../../api/miaoVillage'
import Loading from '../../components/Loading'
import Empty from '../../components/Empty'
import Pagination from '../../components/Pagination'

export default function VillageList() {
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [pendingKeyword, setPendingKeyword] = useState('')
  const pageSize = 12

  const fetchList = useCallback((p, kw) => {
    setLoading(true)
    setError('')
    const params = { page: p, pageSize }
    if (kw) params.keyword = kw
    getMiaoVillageList(params)
      .then(d => { setList(d.list || []); setTotal(d.total || 0) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchList(page, keyword) }, [page, keyword, fetchList])

  const handleSearch = () => { setKeyword(pendingKeyword); setPage(1) }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">🏔️ 苗寨景区</h1>
      </div>

      <div className="filter-bar">
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>关键词</div>
          <input
            type="text"
            placeholder="搜索苗寨名称..."
            value={pendingKeyword}
            onChange={e => setPendingKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSearch}>搜索</button>
        <button className="btn btn-secondary" onClick={() => { setPendingKeyword(''); setKeyword(''); setPage(1) }}>重置</button>
      </div>

      {loading ? <Loading /> : error ? (
        <div className="error-box">⚠️ {error}</div>
      ) : list.length === 0 ? (
        <Empty text="暂无苗寨数据" />
      ) : (
        <>
          <div className="card-grid">
            {list.map(item => (
              <div key={item.id} className="acc-card" onClick={() => navigate(`/accommodation?villageId=${item.id}`)}>
                <div className="acc-card-cover">
                  {item.coverImage
                    ? <img src={item.coverImage} alt={item.name} onError={e => { e.target.style.display = 'none' }} />
                    : '🏔️'}
                </div>
                <div className="acc-card-body">
                  <div className="acc-card-name">{item.name}</div>
                  <div className="acc-card-meta">
                    {item.address && <span>📍 {item.address}</span>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                    {item.ticketPrice > 0
                      ? <span style={{ color: '#e74c3c', fontWeight: 700 }}>门票 ¥{Number(item.ticketPrice).toFixed(0)}</span>
                      : <span style={{ color: '#27ae60', fontWeight: 600 }}>免费景区</span>
                    }
                    <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/accommodation?villageId=${item.id}`) }}>
                      查看民宿 →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} />
        </>
      )}
    </div>
  )
}
