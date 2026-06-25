import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'

// ---- 模拟当前用户 ID（后续对接用户认证时改为 JWT 提取） ----
const CURRENT_USER_ID = 1

export default function ScenicDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [spot, setSpot] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [purchaseTicket, setPurchaseTicket] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    api.getScenicSpot(parseInt(id))
      .then(setSpot)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handlePurchase = async () => {
    if (!purchaseTicket) return
    if (quantity < 1) { alert('数量至少为1'); return }
    setSubmitting(true)
    try {
      const totalPrice = purchaseTicket.sellPrice * quantity
      await api.createOrder({
        userId: CURRENT_USER_ID,
        orderType: 1,        // 1=门票
        itemId: purchaseTicket.id,
        itemName: spot.name + ' - ' + purchaseTicket.name,
        ticketTypeId: purchaseTicket.id,
        quantity,
        totalPrice,
        visitDate,
        validDays: purchaseTicket.validDays || 1,
      })
      alert('下单成功！')
      // 跳转到我的订单
      window.location.href = `/orders?userId=${CURRENT_USER_ID}`
    } catch (e: any) {
      alert(e.message || '下单失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>加载中...</div>
  if (!spot) return <div style={{ textAlign: 'center', padding: 60 }}>景区不存在</div>

  return (
    <div className="page">
      <Link to="/scenic">← 返回景区列表</Link>

      <div className="detail-page">
        <div className="detail-header">
          <img src={spot.coverImage || '/placeholder.jpg'} alt={spot.name} className="detail-cover" />
          <div className="detail-info">
            <h1>{spot.name}</h1>
            <p className="desc">📍 {spot.address}</p>
            {spot.lat && spot.lng && (
              <p className="desc">🌐 {spot.lat}, {spot.lng}</p>
            )}
            <p className="desc" style={{ marginTop: 12 }}>{spot.description}</p>
            <div style={{ marginTop: 16 }}>
              <span className={`badge ${spot.status === 1 ? 'badge-success' : 'badge-error'}`}>
                {spot.status === 1 ? '营业中' : '已歇业'}
              </span>
            </div>
          </div>
        </div>

        {/* 关联票种 */}
        {spot.ticketTypes && spot.ticketTypes.length > 0 && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>可选票种</h2>
            <div className="ticket-list">
              {spot.ticketTypes.map((tt: any) => (
                <div key={tt.id} className="ticket-item">
                  <div className="ticket-item-info">
                    <h4>{tt.name}</h4>
                    <p>有效天数：{tt.validDays}天</p>
                    {tt.description && <p>{tt.description}</p>}
                  </div>
                  <div className="ticket-item-price">
                    ¥{tt.sellPrice} <span style={{ fontSize: 13, color: '#999' }}>原价 ¥{tt.price}</span>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setPurchaseTicket(tt)
                      setQuantity(1)
                      setVisitDate(new Date().toISOString().split('T')[0])
                    }}
                  >
                    立即购买
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 购票弹窗 */}
      {purchaseTicket && (
        <div className="modal-overlay" onClick={() => setPurchaseTicket(null)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <h3>🎫 购买 — {purchaseTicket.name}</h3>
            <p style={{ fontSize: 24, fontWeight: 'bold', margin: '8px 0' }}>
              ¥{purchaseTicket.sellPrice} <span style={{ fontSize: 14, color: '#999' }}>/张</span>
            </p>
            <div className="form-group">
              <label>游玩日期</label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
              />
            </div>
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
            <div style={{ fontSize: 15, color: '#333', margin: '12px 0', padding: '8px 12px', background: '#f9f9f9', borderRadius: 4 }}>
              合计：<strong style={{ color: '#e74c3c', fontSize: 20 }}>¥{purchaseTicket.sellPrice * quantity}</strong>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setPurchaseTicket(null)}>取消</button>
              <button className="btn btn-primary" onClick={handlePurchase} disabled={submitting}>
                {submitting ? '提交中...' : '确认下单'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
