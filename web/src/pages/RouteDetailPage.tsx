import { useEffect, useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { api } from '../api'

export default function RouteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const [route, setRoute] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [visitDate, setVisitDate] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!id) return
    api.getRoute(parseInt(id))
      .then(setRoute)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  // 如果从景区详情跳过来，预填票种
  const ticketTypeId = searchParams.get('buyTicket')

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>加载中...</div>
  if (!route) return <div style={{ textAlign: 'center', padding: 60 }}>路线不存在</div>

  const handleBuy = () => {
    if (!visitDate) { alert('请选择游玩日期'); return }
    setShowModal(true)
  }

  const handleConfirm = async () => {
    try {
      await api.createOrder({
        userId: 1, // TODO: 从登录态获取
        orderType: 2, // 路线套餐
        itemId: route.id,
        itemName: route.name,
        quantity,
        totalPrice: parseFloat((route.price * quantity).toFixed(2)),
        visitDate,
        validDays: route.durationDays, // 路线套餐有效天数直接使用行程天数
      })
      alert('订单创建成功！')
      setShowModal(false)
      window.location.href = '/orders?userId=1'
    } catch (e: any) {
      alert(e.message)
    }
  }

  return (
    <div className="page">
      <Link to="/routes">← 返回路线列表</Link>

      <div className="detail-page">
        <div className="detail-header">
          <img src={route.coverImage || '/placeholder.jpg'} alt={route.name} className="detail-cover" />
          <div className="detail-info">
            <h1>{route.name}</h1>
            <div className="price-tag">¥{route.price}<span style={{ fontSize: 14 }}>/人</span></div>
            {route.originalPrice && (
              <div style={{ fontSize: 14, color: '#999', textDecoration: 'line-through' }}>
                原价 ¥{route.originalPrice}
              </div>
            )}
            <p className="desc">📅 {route.durationDays}天{route.minPeople}-{route.maxPeople}人成团</p>
            <p className="desc" style={{ marginTop: 8 }}>{route.description}</p>
          </div>
        </div>

        {/* 行程 */}
        {route.itineraries && route.itineraries.length > 0 && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>行程详情</h2>
            {route.itineraries.map((it: any) => (
              <div key={it.id} style={{ marginBottom: 20, paddingLeft: 16, borderLeft: '3px solid var(--primary)' }}>
                <h4 style={{ marginBottom: 8 }}>第{it.dayOrder}天 · {it.title}</h4>
                <p style={{ whiteSpace: 'pre-wrap', color: '#555', fontSize: 14 }}>{it.content}</p>
              </div>
            ))}
          </>
        )}

        {/* 购买区 */}
        <div style={{ marginTop: 32, padding: 20, background: '#fafafa', borderRadius: 8 }}>
          <h3 style={{ marginBottom: 16 }}>预订</h3>
          <div className="form-group">
            <label>游玩日期</label>
            <input
              type="date"
              value={visitDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setVisitDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>人数</label>
            <div className="qty-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>
          <div style={{ fontSize: 18, color: 'var(--error)', fontWeight: 'bold', marginBottom: 16 }}>
            合计：¥{(route.price * quantity).toFixed(2)}
          </div>
          <button className="btn btn-primary" onClick={handleBuy}>
            立即预订
          </button>
        </div>
      </div>

      {/* 确认弹窗 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>确认订单</h3>
            <p>路线：{route.name}</p>
            <p>日期：{visitDate}</p>
            <p>人数：{quantity}</p>
            <p style={{ color: 'var(--error)', fontWeight: 'bold', marginTop: 8 }}>
              总计：¥{(route.price * quantity).toFixed(2)}
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleConfirm}>确认预订</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
