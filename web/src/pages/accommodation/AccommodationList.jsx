import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getAccommodationList } from '../../api/accommodation'
import { getMiaoVillageList } from '../../api/miaoVillage'
import Loading from '../../components/Loading'
import Empty from '../../components/Empty'
import Pagination from '../../components/Pagination'

const TYPE_MAP = {
  minsute: '民宿',
  inn: '客栈',
  hotel: '酒店',
  farm: '农家乐',
}

export default function AccommodationList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 从 URL 同步读取 villageId（首次渲染即可读到，不依赖 useEffect）
  const villageIdFromUrl = searchParams.get('villageId') || ''

  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [villages, setVillages] = useState([])

  // 初始化时：优先用 URL 参数，否则为空
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    villageId: villageIdFromUrl,
    type: '',
    minPrice: '',
    maxPrice: '',
    checkIn: '',
    checkOut: '',
  })
  const [pendingFilters, setPendingFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    villageId: villageIdFromUrl,
    type: '',
    minPrice: '',
    maxPrice: '',
    checkIn: '',
    checkOut: '',
  })

  const pageSize = 12

  // 加载苗寨列表（用于筛选下拉）
  useEffect(() => {
    getMiaoVillageList({ page: 1, pageSize: 50 })
      .then(d => setVillages(d.list || []))
      .catch(() => {})
  }, [])

  const fetchList = useCallback((p, f) => {
    setLoading(true)
    setError('')
    const params = { page: p, pageSize }
    if (f.keyword) params.keyword = f.keyword
    if (f.villageId) params.villageId = f.villageId
    if (f.type) params.type = f.type
    if (f.minPrice) params.minPrice = f.minPrice
    if (f.maxPrice) params.maxPrice = f.maxPrice
    if (f.checkIn && f.checkOut) {
      params.checkIn = f.checkIn
      params.checkOut = f.checkOut
    }

    getAccommodationList(params)
      .then(data => {
        setList(data.list || [])
        setTotal(data.total || 0)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchList(page, filters)
  }, [page, filters, fetchList])

  const handleSearch = () => {
    if (pendingFilters.checkIn && pendingFilters.checkOut) {
      if (pendingFilters.checkIn >= pendingFilters.checkOut) {
        setError('离店日期必须晚于入住日期')
        return
      }
    }
    setError('')
    setFilters({ ...pendingFilters })
    setPage(1)
  }

  const handleReset = () => {
    const empty = { keyword: '', villageId: '', type: '', minPrice: '', maxPrice: '', checkIn: '', checkOut: '' }
    setPendingFilters(empty)
    setFilters(empty)
    setPage(1)
    setError('')
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">🏡 苗寨民宿</h1>
        <button className="btn btn-primary" onClick={() => navigate('/accommodation/create')}>
          + 新增民宿
        </button>
      </div>

      {/* 筛选栏 */}
      <div className="filter-bar">
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>关键词</div>
          <input
            type="text"
            placeholder="搜索民宿名称..."
            value={pendingFilters.keyword}
            onChange={e => setPendingFilters(p => ({ ...p, keyword: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>苗寨</div>
          <select value={pendingFilters.villageId} onChange={e => setPendingFilters(p => ({ ...p, villageId: e.target.value }))}>
            <option value="">全部苗寨</option>
            {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>类型</div>
          <select value={pendingFilters.type} onChange={e => setPendingFilters(p => ({ ...p, type: e.target.value }))}>
            <option value="">全部类型</option>
            {Object.entries(TYPE_MAP).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>价格区间</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="number"
              placeholder="最低价"
              style={{ width: 72 }}
              value={pendingFilters.minPrice}
              onChange={e => setPendingFilters(p => ({ ...p, minPrice: e.target.value }))}
            />
            <span style={{ color: '#aaa' }}>-</span>
            <input
              type="number"
              placeholder="最高价"
              style={{ width: 72 }}
              value={pendingFilters.maxPrice}
              onChange={e => setPendingFilters(p => ({ ...p, maxPrice: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>入住日期</div>
          <input
            type="date"
            value={pendingFilters.checkIn}
            min={new Date().toISOString().slice(0, 10)}
            onChange={e => {
              const checkIn = e.target.value
              setPendingFilters(p => ({
                ...p,
                checkIn,
                checkOut: p.checkOut && p.checkOut <= checkIn ? '' : p.checkOut,
              }))
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>离店日期</div>
          <input
            type="date"
            value={pendingFilters.checkOut}
            min={pendingFilters.checkIn
              ? (() => { const d = new Date(pendingFilters.checkIn); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10) })()
              : new Date().toISOString().slice(0, 10)}
            onChange={e => setPendingFilters(p => ({ ...p, checkOut: e.target.value }))}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSearch}>搜索</button>
        <button className="btn btn-secondary" onClick={handleReset}>重置</button>
      </div>

      {/* 已选筛选提示 */}
      {filters.villageId && (
        <div style={{
          background: '#e6f7ff',
          border: '1px solid #91d5ff',
          borderRadius: 6,
          padding: '8px 14px',
          marginBottom: 16,
          fontSize: 13,
          color: '#0050b3',
        }}>
          📍 当前筛选：{villages.find(v => String(v.id) === String(filters.villageId))?.name || '指定苗寨'}的民宿
        </div>
      )}

      {/* 日期提示 */}
      {filters.checkIn && filters.checkOut && (
        <div style={{
          background: '#fff7e6',
          border: '1px solid #ffd591',
          borderRadius: 6,
          padding: '8px 14px',
          marginBottom: 16,
          fontSize: 13,
          color: '#d46b08',
        }}>
          📅 当前仅显示 <strong>{filters.checkIn}</strong> 至 <strong>{filters.checkOut}</strong> 期间有可用房间的民宿
        </div>
      )}

      {/* 内容区 */}
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="error-box">⚠️ {error}</div>
      ) : list.length === 0 ? (
        <Empty text={
          filters.checkIn && filters.checkOut
            ? `所选日期（${filters.checkIn} ~ ${filters.checkOut}）暂无可用民宿`
            : '暂无民宿数据，点击右上角新增'
        } />
      ) : (
        <>
          <div className="card-grid">
            {list.map(item => (
              <div key={item.id} className="acc-card" onClick={() => navigate(`/accommodation/detail/${item.id}`)}>
                <div className="acc-card-cover">
                  {item.coverImage
                    ? <img src={item.coverImage} alt={item.name} onError={e => { e.target.style.display = 'none' }} />
                    : '🏡'}
                </div>
                <div className="acc-card-body">
                  <div className="acc-card-name">{item.name}</div>
                  <div className="acc-card-meta">
                    <span className="type-tag">{TYPE_MAP[item.type] || item.type}</span>
                    {item.address && <span>📍 {item.address}</span>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="acc-card-price">
                      ¥{Number(item.lowestPrice).toFixed(0)}
                      {item.highestPrice && <span style={{ fontSize: 12, color: '#999' }}> ~ ¥{Number(item.highestPrice).toFixed(0)}</span>}
                      <span style={{ fontSize: 12, color: '#999', fontWeight: 400 }}>/晚</span>
                    </div>
                    <div className="acc-card-rating">
                      ⭐ {Number(item.rating).toFixed(1)}
                      <span style={{ color: '#aaa', marginLeft: 2 }}>({item.reviewCount})</span>
                    </div>
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
