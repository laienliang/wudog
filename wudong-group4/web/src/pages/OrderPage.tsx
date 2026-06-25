import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../api'

// ---- 模拟当前用户 ID（后续对接用户认证时改为 JWT 提取） ----
const CURRENT_USER_ID = 1

export default function OrderPage() {
  const [searchParams] = useSearchParams()
  const _queryUserId = parseInt(searchParams.get('userId') || String(CURRENT_USER_ID))
  const [orders, setOrders] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [purchaseType, setPurchaseType] = useState<'ticket' | 'route'>('ticket')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [ticketList, setTicketList] = useState<any[]>([])
  const [routeList, setRouteList] = useState<any[]>([])
  const [quantity, setQuantity] = useState(1)
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0])
  const [submitting, setSubmitting] = useState(false)
  const pageSize = 10

  useEffect(() => {
    setLoading(true)
    api.getMyOrders(CURRENT_USER_ID, page, pageSize)
      .then((res) => {
        setOrders(res.list)
        setTotal(res.total)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page])

  // 加载票种列表（用于弹窗选择）
  useEffect(() => {
    if (!showPurchaseModal || purchaseType !== 'ticket') return
    // 先加载景区列表，再加载每个景区的票种
    api.getScenicSpots(1, 20).then((res) => {
      const scenicList = res.list
      const allTickets: any[] = []
      Promise.all(
        scenicList.map((s: any) =>
          api.getTicketTypes(s.id).then((tts) =>
            tts.map((t: any) => ({ ...t, scenicName: s.name }))
          )
        )
      ).then((ttsArray) => {
        ttsArray.forEach((arr) => allTickets.push(...arr))
        setTicketList(allTickets)
      })
    })
  }, [showPurchaseModal, purchaseType])

  // 加载路线列表
  useEffect(() => {
    if (!showPurchaseModal || purchaseType !== 'route') return
    api.getRoutes().then((res) => setRouteList(res.list))
  }, [showPurchaseModal, purchaseType])

  const handleCancel = async (id: number) => {
    if (!confirm('确定取消此订单？')) return
    try {
      await api.cancelOrder(id)
      alert('订单已取消')
      window.location.reload()
    } catch (e: any) {
      alert(e.message)
    }
  }

  const handlePurchase = async () => {
    if (!selectedId) return
    if (quantity < 1) { alert('数量至少为1'); return }
    setSubmitting(true)
    try {
      let itemName = ''
      let orderType = 1
      let itemId = selectedId
      let ticketTypeId: number | undefined

      if (purchaseType === 'ticket') {
        const ticket = ticketList.find((t: any) => t.id === selectedId)
        if (!ticket) { alert('未找到票种'); return }
        itemName = ticket.scenicName + ' - ' + ticket.name
        orderType = 1
        ticketTypeId = selectedId
      } else {
        const route = routeList.find((r: any) => r.id === selectedId)
        if (!route) { alert('未找到路线'); return }
        itemName = route.name
        orderType = 2
      }

      const unitPrice = purchaseType === 'ticket'
        ? ticketList.find((t: any) => t.id === selectedId)?.sellPrice || 0
        : routeList.find((r: any) => r.id === selectedId)?.price || 0

      await api.createOrder({
        userId: CURRENT_USER_ID,
        orderType,
        itemId,
        itemName,
        ticketTypeId,
        quantity,
        totalPrice: unitPrice * quantity,
        visitDate: purchaseType === 'ticket' ? visitDate : undefined,
        validDays: purchaseType === 'ticket' ? (ticketList.find((t: any) => t.id === selectedId)?.validDays || 1) : undefined,
      })
      alert('下单成功！')
      setShowPurchaseModal(false)
      window.location.reload()
    } catch (e: any) {
      alert(e.message || '下单失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>加载中...</div>

  const statusMap: Record<number, string> = {
    0: '待使用',
    1: '已核销',
    2: '已过期',
    3: '已取消',
    4: '已退款',
  }
  const badgeClass: Record<number, string> = {
    0: 'badge-success',
    1: 'badge-default',
    2: 'badge-error',
    3: 'badge-warning',
    4: 'badge-warning',
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-title" style={{ margin: 0 }}>我的订单</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={() => { setPurchaseType('ticket'); setSelectedId(null); setShowPurchaseModal(true) }}>
            订票（门票）
          </button>
          <button className="btn btn-primary" onClick={() => { setPurchaseType('route'); setSelectedId(null); setShowPurchaseModal(true) }}>
            订票（路线套餐）
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 8 }}>
          <p>暂无订单</p>
          <button className="btn btn-primary" onClick={() => setShowPurchaseModal(true)} style={{ marginTop: 12 }}>
            去订票
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map((order) => (
            <div key={order.id} style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <span style={{ fontWeight: 'bold' }}>{order.itemName}</span>
                  <span style={{ marginLeft: 16, fontSize: 13, color: '#999' }}>
                    订单号：{order.orderNo}
                  </span>
                </div>
                <span className={`badge ${badgeClass[order.status] || 'badge-default'}`}>
                  {statusMap[order.status] || '未知'}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#666', display: 'flex', gap: 24 }}>
                <span>🎫 数量：{order.quantity}</span>
                <span>💰 金额：¥{order.totalPrice}</span>
                {order.visitDate && <span>📅 日期：{order.visitDate}</span>}
                <span>🕐 下单：{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              {order.status === 0 && (
                <div style={{ marginTop: 12 }}>
                  <button className="btn btn-outline" onClick={() => handleCancel(order.id)}>
                    取消订单
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 分页 */}
      {total > pageSize && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {page > 1 && (
            <button className="btn btn-outline btn-sm" onClick={() => setPage(page - 1)}>上一页</button>
          )}
          <span style={{ lineHeight: '32px' }}>第 {page} 页 / 共 {Math.ceil(total / pageSize)} 页</span>
          {page * pageSize < total && (
            <button className="btn btn-outline btn-sm" onClick={() => setPage(page + 1)}>下一页</button>
          )}
        </div>
      )}

      {/* 购票弹窗 */}
      {showPurchaseModal && (
        <div className="modal-overlay" onClick={() => setShowPurchaseModal(false)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <h3>🎫 选择票种/路线</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button
                className={`btn ${purchaseType === 'ticket' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                onClick={() => setPurchaseType('ticket')}
              >门票</button>
              <button
                className={`btn ${purchaseType === 'route' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                onClick={() => setPurchaseType('route')}
              >路线套餐</button>
            </div>

            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {(purchaseType === 'ticket' ? ticketList : routeList).map((item: any) => (
                <div
                  key={item.id}
                  style={{
                    padding: '8px 12px',
                    marginBottom: 6,
                    background: selectedId === item.id ? '#e8f4fd' : '#f9f9f9',
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div>
                    <strong>{item.name}</strong>
                    {purchaseType === 'ticket' && <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>{item.scenicName}</span>}
                  </div>
                  <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>¥{purchaseType === 'ticket' ? item.sellPrice : item.price}</span>
                </div>
              ))}
              {(purchaseType === 'ticket' ? ticketList : routeList).length === 0 && (
                <p style={{ textAlign: 'center', color: '#999', padding: 20 }}>暂无可选{purchaseType === 'ticket' ? '票种' : '路线'}</p>
              )}
            </div>

            {selectedId && (
              <>
                <div className="form-group">
                  <label>数量</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    style={{ width: 100 }}
                  />
                </div>
                {purchaseType === 'ticket' && (
                  <div className="form-group">
                    <label>游玩日期</label>
                    <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
                  </div>
                )}
                <div style={{ fontSize: 15, color: '#333', margin: '12px 0', padding: '8px 12px', background: '#f9f9f9', borderRadius: 4 }}>
                  合计：<strong style={{ color: '#e74c3c', fontSize: 20 }}>¥{quantity * (purchaseType === 'ticket' ? ticketList.find((t: any) => t.id === selectedId)?.sellPrice : routeList.find((r: any) => r.id === selectedId)?.price || 0)}</strong>
                </div>
              </>
            )}

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowPurchaseModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handlePurchase} disabled={submitting || !selectedId}>
                {submitting ? '提交中...' : '确认下单'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
