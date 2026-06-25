import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getRoomList } from '../../api/room'
import { batchRoomCalendar } from '../../api/roomCalendar'

// 生成日期范围内的每一天
function getDatesInRange(start, end) {
  const dates = []
  const d = new Date(start + 'T00:00:00')
  const endD = new Date(end + 'T00:00:00')
  while (d <= endD) {
    dates.push(new Date(d).toISOString().slice(0, 10))
    d.setDate(d.getDate() + 1)
  }
  return dates
}

export default function RoomCalendarForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const accommodationId = searchParams.get('accommodationId')

  const today = new Date().toISOString().slice(0, 10)
  const nextWeek = (() => { const d = new Date(); d.setDate(d.getDate() + 6); return d.toISOString().slice(0, 10) })()

  const [rooms, setRooms] = useState([])
  const [dateFrom, setDateFrom] = useState(today)
  const [dateTo, setDateTo] = useState(nextWeek)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 每个房型的批量设置：price, stock, isClosed
  const [roomSettings, setRoomSettings] = useState({})

  useEffect(() => {
    if (!accommodationId) return
    getRoomList({ page: 1, pageSize: 50, accommodationId })
      .then(data => {
        const list = data.list || []
        setRooms(list)
        // 默认设置：使用房型基准价和库存
        const settings = {}
        list.forEach(r => {
          settings[r.id] = {
            price: r.price || '',
            stock: r.stock ?? 1,
            isClosed: 0,
            enabled: true,
          }
        })
        setRoomSettings(settings)
      })
  }, [accommodationId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!dateFrom || !dateTo) {
      setError('请选择日期区间')
      return
    }
    if (dateFrom > dateTo) {
      setError('结束日期必须晚于或等于开始日期')
      return
    }
    const dates = getDatesInRange(dateFrom, dateTo)
    const items = []
    rooms.forEach(room => {
      const setting = roomSettings[room.id]
      if (!setting?.enabled) return
      if (!setting.price) {
        setError(`房型「${room.name}」请填写价格`)
        return
      }
      dates.forEach(date => {
        items.push({
          roomId: room.id,
          accommodationId: Number(accommodationId),
          date,
          price: Number(setting.price),
          stock: Number(setting.stock) || 0,
          isClosed: setting.isClosed ? 1 : 0,
          remark: setting.remark || null,
        })
      })
    })

    if (items.length === 0) {
      setError('请至少选择一个房型并填写价格')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await batchRoomCalendar(items)
      setSuccess(`成功批量录入 ${items.length} 条房态（${rooms.filter(r => roomSettings[r.id]?.enabled).length} 个房型 × ${dates.length} 天）`)
      setTimeout(() => navigate(-1), 1500)
    } catch (e) {
      setError('录入失败：' + e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const updateSetting = (roomId, field, value) => {
    setRoomSettings(s => ({
      ...s,
      [roomId]: { ...s[roomId], [field]: value },
    }))
  }

  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>← 返回</button>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>📅 批量录入房态</h2>
        <div />
      </div>

      {!accommodationId && (
        <div className="error-box">⚠️ 缺少住宿ID，请从住宿详情页进入</div>
      )}

      <form onSubmit={handleSubmit}>
        {/* 日期区间 */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>选择日期区间</h3>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 4 }}>开始日期</label>
              <input
                type="date"
                value={dateFrom}
                min={today}
                onChange={e => setDateFrom(e.target.value)}
                required
              />
            </div>
            <span style={{ color: '#aaa', marginTop: 20 }}>至</span>
            <div>
              <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 4 }}>结束日期</label>
              <input
                type="date"
                value={dateTo}
                min={dateFrom || today}
                onChange={e => setDateTo(e.target.value)}
                required
              />
            </div>
            {dateFrom && dateTo && dateFrom <= dateTo && (
              <div style={{ fontSize: 13, color: '#1890ff', marginTop: 20 }}>
                共 {getDatesInRange(dateFrom, dateTo).length} 天
              </div>
            )}
          </div>
        </div>

        {/* 各房型设置 */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>各房型日历设置</h3>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>
            以下设置将批量应用到所选日期区间内的每一天（已有数据将被覆盖）
          </p>

          {rooms.length === 0 ? (
            <div style={{ color: '#aaa', textAlign: 'center', padding: '20px 0' }}>该住宿暂无房型，请先新增房型</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>启用</th>
                  <th>房型名称</th>
                  <th>价格/晚 <span style={{ color: '#e74c3c' }}>*</span></th>
                  <th>库存（间）</th>
                  <th>关闭（不可预订）</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => {
                  const s = roomSettings[room.id] || {}
                  return (
                    <tr key={room.id} style={{ opacity: s.enabled ? 1 : 0.45 }}>
                      <td>
                        <input
                          type="checkbox"
                          checked={s.enabled || false}
                          onChange={e => updateSetting(room.id, 'enabled', e.target.checked)}
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>{room.name}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="价格"
                          value={s.price}
                          disabled={!s.enabled}
                          onChange={e => updateSetting(room.id, 'price', e.target.value)}
                          style={{ width: 90 }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={s.stock}
                          disabled={!s.enabled || s.isClosed}
                          onChange={e => updateSetting(room.id, 'stock', e.target.value)}
                          style={{ width: 70 }}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={s.isClosed || false}
                          disabled={!s.enabled}
                          onChange={e => updateSetting(room.id, 'isClosed', e.target.checked)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="如：节假日加价"
                          value={s.remark || ''}
                          disabled={!s.enabled}
                          onChange={e => updateSetting(room.id, 'remark', e.target.value)}
                          style={{ width: 120 }}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {error && <div className="error-box" style={{ marginBottom: 16 }}>⚠️ {error}</div>}
        {success && (
          <div style={{
            background: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: 6,
            padding: '10px 14px',
            marginBottom: 16,
            color: '#389e0d',
            fontSize: 14,
          }}>
            ✅ {success}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn btn-primary" disabled={submitting || rooms.length === 0}>
            {submitting ? '提交中...' : '批量录入房态'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>取消</button>
        </div>
      </form>
    </div>
  )
}
