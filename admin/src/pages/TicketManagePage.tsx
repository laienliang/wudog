import { useEffect, useState } from 'react'
import { api } from '../api'

export default function TicketManagePage() {
  const [list, setList] = useState<any[]>([])
  const [showStockModal, setShowStockModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({
    scenicId: '', name: '', ticketType: 0, price: 0, sellPrice: 0,
    description: '', validDays: 1, stock: 0,
  })
  const [scenicSpots, setScenicSpots] = useState<any[]>([])
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [stockDates, setStockDates] = useState<{ date: string; stock: number }[]>([])

  const load = () => {
    api.getTicketTypes().then((res) => setList(res))
  }

  const loadScenicSpots = () => {
    api.getScenicSpots(1, 100).then((res) => setScenicSpots(res.list))
  }

  useEffect(() => { load(); loadScenicSpots() }, [])

  // ---- 表单弹窗 ----
  const openCreate = () => {
    setEditing(null)
    setForm({ scenicId: '', name: '', ticketType: 0, price: 0, sellPrice: 0, description: '', validDays: 1, stock: 0 })
    setShowFormModal(true)
  }

  const openEdit = (item: any) => {
    setEditing(item)
    setForm({
      scenicId: String(item.scenicId || item.scenic?.id || ''),
      name: item.name,
      ticketType: item.ticketType,
      price: item.price,
      sellPrice: item.sellPrice,
      description: item.description || '',
      validDays: item.validDays || 1,
      stock: item.stock || 0,
    })
    setShowFormModal(true)
  }

  const handleSaveForm = async () => {
    try {
      const payload = {
        ...form,
        scenicId: parseInt(form.scenicId),
        ticketType: parseInt(form.ticketType),
        price: parseFloat(form.price),
        sellPrice: parseFloat(form.sellPrice),
        validDays: parseInt(form.validDays),
        stock: parseInt(form.stock),
      }
      if (editing) {
        await api.updateTicketType(editing.id, payload)
      } else {
        await api.createTicketType(payload)
      }
      setShowFormModal(false)
      load()
    } catch (e: any) {
      alert(e.message || '保存失败')
    }
  }

  // 打开日期库存面板
  const openStockPanel = (ticket: any) => {
    setSelectedTicket(ticket)
    const existing: { date: string; stock: number }[] = []
    if (ticket.dailyStock && typeof ticket.dailyStock === 'object') {
      Object.entries(ticket.dailyStock).forEach(([date, stock]) => {
        existing.push({ date, stock: stock as number })
      })
    }
    setStockDates(existing.length > 0 ? existing : generateDefaultDates())
    setShowStockModal(true)
  }

  // 生成默认日期范围（未来30天）
  const generateDefaultDates = () => {
    const dates: { date: string; stock: number }[] = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() + i)
      dates.push({
        date: d.toISOString().split('T')[0],
        stock: selectedTicket?.stock || 0,
      })
    }
    return dates
  }

  // 更新某个日期的库存
  const updateStockDate = (index: number, value: number) => {
    const copy = [...stockDates]
    copy[index].stock = value
    setStockDates(copy)
  }

  // 保存库存
  const handleSave = async () => {
    if (!selectedTicket) return
    try {
      await api.setDailyStocks(selectedTicket.id, stockDates)
      setShowStockModal(false)
      load()
    } catch (e: any) {
      alert(e.message)
    }
  }

  // 快速填充：将某日库存应用到所有日期
  const fillAll = (value: number) => {
    setStockDates(stockDates.map((d) => ({ ...d, stock: value })))
  }

  return (
    <div>
      <div className="page-header">
        <h2>票种管理</h2>
      </div>
      <div className="table-wrapper">
        <div className="table-toolbar">
          <span>共 {list.length} 条</span>
          <button className="btn btn-primary" onClick={openCreate}>+ 新增票种</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>景区</th>
              <th>票种名称</th>
              <th>售价</th>
              <th>总库存</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.scenic?.name || '-'}</td>
                <td>{item.name}</td>
                <td>¥{item.sellPrice}</td>
                <td>
                  {item.dailyStock && Object.keys(item.dailyStock).length > 0
                    ? `${Object.keys(item.dailyStock).length} 天已设置`
                    : item.stock}
                </td>
                <td>
                  <span className={`badge ${item.status === 1 ? 'badge-success' : 'badge-error'}`}>
                    {item.status === 1 ? '可售' : '停售'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => openEdit(item)}>编辑</button>
                  <button className="btn btn-primary btn-sm" onClick={() => openStockPanel(item)}>
                    📅 日期库存
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={async () => {
                    if (!confirm('确定删除？')) return
                    await api.deleteTicketType(item.id)
                    load()
                  }}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 新增/编辑弹窗 */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? '编辑票种' : '新增票种'}</h3>
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
              <label>票种名称</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="如：成人票" />
            </div>
            <div className="form-group">
              <label>票种类型</label>
              <select value={form.ticketType} onChange={(e) => setForm({ ...form, ticketType: e.target.value })}>
                <option value={0}>普通票</option>
                <option value={1}>优惠票</option>
                <option value={2}>团体票</option>
              </select>
            </div>
            <div className="form-group">
              <label>原价 (¥)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="form-group">
              <label>售价 (¥)</label>
              <input type="number" value={form.sellPrice} onChange={(e) => setForm({ ...form, sellPrice: e.target.value })} />
            </div>
            <div className="form-group">
              <label>有效天数</label>
              <input type="number" value={form.validDays} onChange={(e) => setForm({ ...form, validDays: e.target.value })} />
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

      {/* ⭐ 日期库存面板（核心功能） */}
      {showStockModal && selectedTicket && (
        <div className="modal-overlay" onClick={() => setShowStockModal(false)}>
          <div className="modal" style={{ width: 800 }} onClick={(e) => e.stopPropagation()}>
            <h3>
              📅 日期库存管理 — {selectedTicket.name}
            </h3>
            <p style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>
              基础库存：{selectedTicket.stock} ｜ 设置每日库存覆盖值（留空或不填使用基础库存）
            </p>

            {/* 快捷操作 */}
            <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ fontSize: 13 }}>快速填充：</label>
              <input
                type="number"
                style={{ width: 80, padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 4 }}
                placeholder="库存数"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fillAll(parseInt(e.currentTarget.value) || 0)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <button className="btn btn-outline btn-sm" onClick={() => {
                const val = prompt('请输入填充库存数')
                if (val) fillAll(parseInt(val) || 0)
              }}>填充全部</button>
            </div>

            {/* 日期库存表格 */}
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
              <button className="btn btn-primary" onClick={handleSave}>保存库存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
