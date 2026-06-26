import { useEffect, useState } from 'react'
import { api } from '../api'

export default function RouteManagePage() {
  const [list, setList] = useState<any[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [showStockModal, setShowStockModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({
    scenicId: '', name: '', price: 0, durationDays: 1,
    description: '', stock: 0,
  })
  const [scenicSpots, setScenicSpots] = useState<any[]>([])
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [stockDates, setStockDates] = useState<{ date: string; stock: number }[]>([])

  // 编辑行程相关状态
  const [editingItinerary, setEditingItinerary] = useState<any>(null)
  const [itineraryForm, setItineraryForm] = useState({ title: '', content: '', dayOrder: 1 })

  const load = () => {
    api.getRoutes().then((res) => setList(res))
  }

  const loadScenicSpots = () => {
    api.getScenicSpots(1, 100).then((res) => setScenicSpots(res.list))
  }

  useEffect(() => { load(); loadScenicSpots() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return
    await api.deleteRoute(id)
    load()
  }

  const handleToggleStatus = async (id: number) => {
    await api.toggleRouteStatus(id)
    load()
  }

  // ---- 表单弹窗 ----
  const openCreate = () => {
    setEditing(null)
    setForm({ scenicId: '', name: '', price: 0, durationDays: 1, description: '', stock: 0 })
    setShowFormModal(true)
  }

  const openEdit = (item: any) => {
    setEditing(item)
    setForm({
      scenicId: String(item.scenicId || item.scenic?.id || ''),
      name: item.name,
      price: item.price,
      durationDays: item.durationDays,
      description: item.description || '',
      stock: item.stock || 0,
    })
    setShowFormModal(true)
  }

  const handleSaveForm = async () => {
    try {
      const payload = {
        ...form,
        scenicId: parseInt(form.scenicId),
        price: parseFloat(form.price),
        durationDays: parseInt(form.durationDays),
        stock: parseInt(form.stock),
      }
      if (editing) {
        await api.updateRoute(editing.id, payload)
      } else {
        await api.createRoute(payload)
      }
      setShowFormModal(false)
      load()
    } catch (e: any) {
      alert(e.message || '保存失败')
    }
  }

  // ---- 行程编辑 ----
  const openEditItinerary = (it: any) => {
    setEditingItinerary(it)
    setItineraryForm({ title: it.title, content: it.content || '', dayOrder: it.dayOrder })
  }

  const handleSaveItinerary = async (routeId: number) => {
    try {
      if (editingItinerary) {
        await api.updateItinerary(routeId, editingItinerary.id, itineraryForm)
      } else {
        await api.addItinerary(routeId, itineraryForm)
      }
      setEditingItinerary(null)
      load()
    } catch (e: any) {
      alert(e.message || '保存失败')
    }
  }

  // ---- 日期库存面板 ----
  const openStockPanel = (route: any) => {
    setSelectedRoute(route)
    const existing: { date: string; stock: number }[] = []
    if (route.dailyStock && typeof route.dailyStock === 'object') {
      Object.entries(route.dailyStock).forEach(([date, stock]) => {
        existing.push({ date, stock: stock as number })
      })
    }
    setStockDates(existing.length > 0 ? existing : generateDefaultDates())
    setShowStockModal(true)
  }

  const generateDefaultDates = () => {
    const dates: { date: string; stock: number }[] = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() + i)
      dates.push({
        date: d.toISOString().split('T')[0],
        stock: selectedRoute?.stock || 0,
      })
    }
    return dates
  }

  const updateStockDate = (index: number, value: number) => {
    const copy = [...stockDates]
    copy[index].stock = value
    setStockDates(copy)
  }

  const handleSaveStock = async () => {
    if (!selectedRoute) return
    try {
      await api.setRouteDailyStocks(selectedRoute.id, stockDates)
      setShowStockModal(false)
      load()
    } catch (e: any) {
      alert(e.message)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>路线套餐管理</h2>
      </div>
      <div className="table-wrapper">
        <div className="table-toolbar">
          <span>共 {list.length} 条</span>
          <button className="btn btn-primary" onClick={openCreate}>+ 新增路线</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>价格</th>
              <th>天数</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((route) => (
              <tr key={route.id}>
                <td>{route.id}</td>
                <td>{route.name}</td>
                <td>¥{route.price}</td>
                <td>{route.durationDays}天</td>
                <td>
                  <span className={`badge ${route.status === 1 ? 'badge-success' : 'badge-error'}`}>
                    {route.status === 1 ? '上架' : '下架'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => openEdit(route)}>编辑</button>
                  <button className="btn btn-outline btn-sm" onClick={() => setExpandedId(expandedId === route.id ? null : route.id)}>
                    {expandedId === route.id ? '收起' : '展开'}
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => openStockPanel(route)}>
                    📅 日期库存
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => handleToggleStatus(route.id)}>
                    {route.status === 1 ? '下架' : '上架'}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(route.id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 新增/编辑路线弹窗 */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? '编辑路线' : '新增路线'}</h3>
            <div className="form-group">
              <label>所属景区</label>
              <select value={form.scenicId} onChange={(e) => setForm({ ...form, scenicId: e.target.value })}>
                <option value="">请选择景区</option>
                {scenicSpots.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>路线名称</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="如：凤凰古城两日游" />
            </div>
            <div className="form-group">
              <label>价格 (¥)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="form-group">
              <label>行程天数</label>
              <input type="number" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })} />
            </div>
            <div className="form-group">
              <label>基础库存</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="form-group">
              <label>描述</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowFormModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSaveForm}>保存</button>
            </div>
          </div>
        </div>
      )}

      {/* 展开子面板：行程管理 */}
      {list.map((route) => expandedId === route.id && (
        <div key={route.id} className="table-wrapper" style={{ marginTop: -8 }}>
          <h4 style={{ marginBottom: 12 }}>{route.name} - 行程管理</h4>
          {(route.itineraries || []).map((it: any) => (
            <div key={it.id} className="itinerary-item">
              <span className="day-badge">第{it.dayOrder}天</span>
              <strong>{it.title}</strong>
              <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{it.content?.slice(0, 100)}...</p>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={() => openEditItinerary(it)}>编辑</button>
                <button className="btn btn-danger btn-sm" onClick={async () => {
                  if (!confirm('确定删除此行程？')) return
                  await api.deleteItinerary(route.id, it.id)
                  load()
                }}>删除</button>
              </div>
            </div>
          ))}
          <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={() => {
            setEditingItinerary({ _temp: true })
            setItineraryForm({ title: '', content: '', dayOrder: (route.itineraries?.length || 0) + 1 })
          }}>+ 添加行程</button>
        </div>
      ))}

      {/* 编辑/新增行程弹窗 */}
      {editingItinerary && (
        <div className="modal-overlay" onClick={() => setEditingItinerary(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingItinerary._temp ? '新增行程' : '编辑行程'}</h3>
            <div className="form-group">
              <label>行程标题</label>
              <input value={itineraryForm.title} onChange={(e) => setItineraryForm({ ...itineraryForm, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>行程安排描述</label>
              <textarea value={itineraryForm.content} onChange={(e) => setItineraryForm({ ...itineraryForm, content: e.target.value })} />
            </div>
            <div className="form-group">
              <label>第几天</label>
              <input type="number" value={itineraryForm.dayOrder} onChange={(e) => setItineraryForm({ ...itineraryForm, dayOrder: parseInt(e.target.value) })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setEditingItinerary(null)}>取消</button>
              <button className="btn btn-primary" onClick={() => {
                if (!editingItinerary._temp) {
                  handleSaveItinerary(list.find((r: any) => r.id === expandedId)?.id || 0)
                } else {
                  // 新增行程需要知道属于哪个路线
                  handleSaveItinerary(list.find((r: any) => r.id === expandedId)?.id || 0)
                }
              }}>保存</button>
            </div>
          </div>
        </div>
      )}

      {/* ⭐ 路线日期库存面板 */}
      {showStockModal && selectedRoute && (
        <div className="modal-overlay" onClick={() => setShowStockModal(false)}>
          <div className="modal" style={{ width: 800 }} onClick={(e) => e.stopPropagation()}>
            <h3>📅 日期库存管理 — {selectedRoute.name}</h3>
            <p style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>
              基础库存：{selectedRoute.stock} ｜ 设置每日库存覆盖值
            </p>
            <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ fontSize: 13 }}>快速填充：</label>
              <input
                type="number"
                style={{ width: 80, padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 4 }}
                placeholder="库存数"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setStockDates(stockDates.map((d) => ({ ...d, stock: parseInt(e.currentTarget.value) || 0 })))
                    e.currentTarget.value = ''
                  }
                }}
              />
            </div>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              <table className="data-table" style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ width: 140 }}>日期</th>
                    <th style={{ width: 120 }}>星期</th>
                    <th>每日库存</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {stockDates.map((d, i) => {
                    const weekday = ['日', '一', '二', '三', '四', '五', '六'][new Date(d.date).getDay()]
                    return (
                      <tr key={d.date}>
                        <td>{d.date}</td>
                        <td>周{weekday}</td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            value={d.stock}
                            onChange={(e) => updateStockDate(i, parseInt(e.target.value) || 0)}
                            style={{ width: 80, padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 4 }}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              const copy = stockDates.filter((_, idx) => idx !== i)
                              setStockDates(copy)
                            }}
                          >
                            移除
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowStockModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSaveStock}>保存库存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
