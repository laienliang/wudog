import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAccommodationDetail, deleteAccommodation } from '../../api/accommodation'
import { getRoomList } from '../../api/room'
import { getReviewList } from '../../api/review'
import { queryRoomCalendar } from '../../api/roomCalendar'
import Loading from '../../components/Loading'

const TYPE_MAP = { minsute: '民宿', inn: '客栈', hotel: '酒店', farm: '农家乐' }

function Stars({ value }) {
  return (
    <span className="review-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < Math.round(value) ? '★' : '☆'}</span>
      ))}
    </span>
  )
}

// 生成未来 N 天的日期列表
function getDateRange(start, days) {
  const dates = []
  const d = new Date(start)
  for (let i = 0; i < days; i++) {
    dates.push(new Date(d).toISOString().slice(0, 10))
    d.setDate(d.getDate() + 1)
  }
  return dates
}

export default function AccommodationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [detail, setDetail] = useState(null)
  const [rooms, setRooms] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  // 房态日历
  const today = new Date().toISOString().slice(0, 10)
  const defaultEnd = (() => { const d = new Date(); d.setDate(d.getDate() + 14); return d.toISOString().slice(0, 10) })()
  const [calCheckIn, setCalCheckIn] = useState(today)
  const [calCheckOut, setCalCheckOut] = useState(defaultEnd)
  const [calData, setCalData] = useState([])    // 原始日历数据
  const [calLoading, setCalLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getAccommodationDetail(id),
      getRoomList({ page: 1, pageSize: 50, accommodationId: id }),
      getReviewList({ page: 1, pageSize: 10, accommodationId: id }),
    ])
      .then(([d, r, rv]) => {
        setDetail(d)
        setRooms(r.list || [])
        setReviews(rv.list || [])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  // 加载房态日历
  const loadCalendar = () => {
    if (!calCheckIn || !calCheckOut) return
    setCalLoading(true)
    queryRoomCalendar({ accommodationId: id, checkIn: calCheckIn, checkOut: calCheckOut })
      .then(data => setCalData(Array.isArray(data) ? data : []))
      .catch(() => setCalData([]))
      .finally(() => setCalLoading(false))
  }

  useEffect(() => {
    if (id) loadCalendar()
  }, [id]) // 初次加载用默认区间

  const handleDelete = async () => {
    if (!window.confirm(`确认软删除「${detail.name}」？此操作不可恢复。`)) return
    setDeleting(true)
    try {
      await deleteAccommodation(id)
      alert('删除成功')
      navigate('/accommodation')
    } catch (e) {
      alert('删除失败：' + e.message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="container"><Loading /></div>
  if (error) return <div className="container"><div className="error-box">⚠️ {error}</div></div>
  if (!detail) return null

  // 按房型分组日历数据
  const calByRoom = {}
  calData.forEach(row => {
    if (!calByRoom[row.roomId]) calByRoom[row.roomId] = {}
    calByRoom[row.roomId][row.date] = row
  })

  // 日历展示的日期列
  const calDates = getDateRange(calCheckIn, Math.min(
    Math.round((new Date(calCheckOut) - new Date(calCheckIn)) / 86400000),
    14 // 最多展示14天
  ))

  return (
    <div className="container">
      {/* 返回 + 操作按钮 */}
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>← 返回列表</button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={() => navigate(`/accommodation/edit/${id}`)}>✏️ 编辑</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? '删除中...' : '🗑️ 删除'}
          </button>
        </div>
      </div>

      {/* 封面图 */}
      <div className="detail-hero">
        {detail.coverImage
          ? <img src={detail.coverImage} alt={detail.name} onError={e => e.target.parentNode.innerHTML = '🏡'} />
          : '🏡'}
      </div>

      {/* 基本信息卡片 */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>{detail.name}</h2>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span className="type-tag">{TYPE_MAP[detail.type] || detail.type}</span>
              <span className="acc-card-rating">
                ⭐ {Number(detail.rating).toFixed(1)}
                <span style={{ color: '#aaa', marginLeft: 2 }}>（{detail.reviewCount} 条评价）</span>
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="acc-card-price" style={{ fontSize: 24 }}>
              ¥{Number(detail.lowestPrice).toFixed(0)}
              {detail.highestPrice && <span style={{ fontSize: 14, color: '#999' }}> ~ ¥{Number(detail.highestPrice).toFixed(0)}</span>}
            </div>
            <div style={{ fontSize: 13, color: '#aaa' }}>起/晚</div>
          </div>
        </div>

        <div className="detail-info-grid">
          {detail.address && (
            <div className="info-item">
              <label>地址</label>
              <span>📍 {detail.address}</span>
            </div>
          )}
          <div className="info-item">
            <label>状态</label>
            <span className={`badge ${detail.status === 1 ? '' : 'badge-off'}`}>
              {detail.status === 1 ? '✅ 营业中' : '⛔ 暂停营业'}
            </span>
          </div>
          {detail.longitude && detail.latitude && (
            <div className="info-item">
              <label>坐标</label>
              <span>{detail.longitude}, {detail.latitude}</span>
            </div>
          )}
          <div className="info-item">
            <label>创建时间</label>
            <span>{new Date(detail.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {detail.description && (
          <div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>简介</div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#555' }}>{detail.description}</p>
          </div>
        )}

        {detail.facilities && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>设施</div>
            <p style={{ fontSize: 14, color: '#555' }}>{detail.facilities}</p>
          </div>
        )}
      </div>

      {/* 入住须知 */}
      {detail.houseRules && (
        <div className="card">
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>📋 入住须知</h3>
          <div style={{
            background: '#fffbe6',
            border: '1px solid #ffe58f',
            borderRadius: 6,
            padding: '12px 16px',
            fontSize: 14,
            lineHeight: 1.8,
            color: '#614700',
            whiteSpace: 'pre-wrap',
          }}>
            {detail.houseRules}
          </div>
        </div>
      )}

      {/* 房型列表 */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>🛏️ 房型列表</h3>
          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/room/create?accommodationId=${id}`)}>
            + 新增房型
          </button>
        </div>
        {rooms.length === 0 ? (
          <div style={{ color: '#aaa', padding: '16px 0', textAlign: 'center' }}>暂无房型信息</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>房型名称</th>
                <th>床型</th>
                <th>基准价/晚</th>
                <th>最多入住</th>
                <th>总库存</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(r => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.bedType || '-'}</td>
                  <td><span style={{ color: '#e74c3c', fontWeight: 700 }}>¥{Number(r.price).toFixed(0)}</span></td>
                  <td>{r.maxGuests} 人</td>
                  <td>{r.stock ?? '-'} 间</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/room/edit/${r.id}`)}>编辑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 房态日历 */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>📅 房态日历</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="date"
              value={calCheckIn}
              onChange={e => setCalCheckIn(e.target.value)}
              style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 13 }}
            />
            <span style={{ color: '#aaa' }}>至</span>
            <input
              type="date"
              value={calCheckOut}
              min={calCheckIn}
              onChange={e => setCalCheckOut(e.target.value)}
              style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 13 }}
            />
            <button className="btn btn-primary btn-sm" onClick={loadCalendar}>查询</button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate(`/room-calendar/create?accommodationId=${id}`)}
            >
              + 录入房态
            </button>
          </div>
        </div>

        {calLoading ? (
          <div style={{ padding: '20px 0', textAlign: 'center', color: '#aaa' }}>加载中...</div>
        ) : calData.length === 0 ? (
          <div style={{
            padding: '20px 0',
            textAlign: 'center',
            color: '#aaa',
            fontSize: 14,
          }}>
            该日期区间暂无房态数据<br />
            <span style={{ fontSize: 12 }}>点击「录入房态」可批量添加每日库存和价格</span>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: calDates.length * 90 + 120 }}>
              <thead>
                <tr>
                  <th style={{ minWidth: 100, position: 'sticky', left: 0, background: '#fafafa', zIndex: 1 }}>房型</th>
                  {calDates.map(date => {
                    const d = new Date(date + 'T00:00:00')
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6
                    return (
                      <th key={date} style={{
                        minWidth: 80,
                        textAlign: 'center',
                        color: isWeekend ? '#e74c3c' : undefined,
                        background: isWeekend ? '#fff5f5' : undefined,
                      }}>
                        <div style={{ fontSize: 11, color: '#aaa' }}>
                          {['日', '一', '二', '三', '四', '五', '六'][d.getDay()]}
                        </div>
                        {date.slice(5)}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room.id}>
                    <td style={{
                      fontWeight: 600,
                      position: 'sticky',
                      left: 0,
                      background: '#fff',
                      zIndex: 1,
                      borderRight: '1px solid #f0f0f0',
                    }}>
                      {room.name}
                    </td>
                    {calDates.map(date => {
                      const cell = calByRoom[room.id]?.[date]
                      if (!cell) {
                        return (
                          <td key={date} style={{ textAlign: 'center', color: '#bbb', fontSize: 12 }}>
                            -
                          </td>
                        )
                      }
                      const closed = cell.isClosed === 1
                      const soldOut = !closed && cell.stock === 0
                      return (
                        <td key={date} style={{
                          textAlign: 'center',
                          background: closed ? '#fff2f0' : soldOut ? '#f9f9f9' : undefined,
                        }}>
                          {closed ? (
                            <span style={{ color: '#cf1322', fontSize: 12 }}>关闭</span>
                          ) : soldOut ? (
                            <>
                              <div style={{ color: '#e74c3c', fontWeight: 700, fontSize: 13 }}>¥{Number(cell.price).toFixed(0)}</div>
                              <div style={{ color: '#cf1322', fontSize: 11 }}>售罄</div>
                            </>
                          ) : (
                            <>
                              <div style={{ color: '#e74c3c', fontWeight: 700, fontSize: 13 }}>¥{Number(cell.price).toFixed(0)}</div>
                              <div style={{ color: '#52c41a', fontSize: 11 }}>余 {cell.stock} 间</div>
                              {cell.remark && <div style={{ color: '#d48806', fontSize: 10 }}>{cell.remark}</div>}
                            </>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 评价列表 */}
      <div className="card">
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>💬 用户评价</h3>
        {reviews.length === 0 ? (
          <div style={{ color: '#aaa', padding: '16px 0', textAlign: 'center' }}>暂无评价</div>
        ) : (
          reviews.map(rv => (
            <div key={rv.id} className="review-item">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Stars value={rv.rating} />
                <span className="review-meta">{new Date(rv.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="review-content">{rv.content}</p>
              <div className="review-meta">用户 #{rv.userId}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
