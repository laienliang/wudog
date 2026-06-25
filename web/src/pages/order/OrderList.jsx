import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrderList, updateOrder, deleteOrder } from '../../api/order'
import Loading from '../../components/Loading'
import Empty from '../../components/Empty'
import Pagination from '../../components/Pagination'

const STATUS_MAP = {
  0: { label: '待支付', color: '#f39c12' },
  1: { label: '已支付', color: '#27ae60' },
  2: { label: '已入住', color: '#1a3d6e' },
  3: { label: '已完成', color: '#888' },
  4: { label: '已取消', color: '#e74c3c' },
}

export default function OrderList() {
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const pageSize = 10

  const fetchList = useCallback((p) => {
    setLoading(true)
    setError('')
    getOrderList({ page: p, pageSize })
      .then(d => { setList(d.list || []); setTotal(d.total || 0) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchList(page) }, [page, fetchList])

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrder(orderId, { status })
      fetchList(page)
    } catch (e) {
      alert('操作失败：' + e.message)
    }
  }

  const handleDelete = async (orderId, guestName) => {
    if (!window.confirm(`确认删除「${guestName}」的订单？`)) return
    try {
      await deleteOrder(orderId)
      fetchList(page)
    } catch (e) {
      alert('删除失败：' + e.message)
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">📋 订单管理</h1>
      </div>

      {loading ? <Loading /> : error ? (
        <div className="error-box">⚠️ {error}</div>
      ) : list.length === 0 ? (
        <Empty text="暂无订单数据" />
      ) : (
        <>
          {list.map(order => (
            <div key={order.id} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                    订单号：{order.orderNo}
                  </div>
                  <div style={{ fontSize: 13, color: '#666', lineHeight: 2 }}>
                    <span>入住人：{order.guestName}（{order.guestPhone}）</span>
                    <span style={{ marginLeft: 20 }}>人数：{order.guests} 人</span>
                    <br />
                    <span>入住：{order.checkInDate?.slice(0, 10)}</span>
                    <span style={{ marginLeft: 20 }}>离店：{order.checkOutDate?.slice(0, 10)}</span>
                    <span style={{ marginLeft: 20 }}>共 {order.nights} 晚</span>
                    <br />
                    {order.remark && <span>备注：{order.remark}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#e74c3c', marginBottom: 8 }}>
                    ¥{Number(order.totalPrice).toFixed(2)}
                  </div>
                  <span style={{
                    background: STATUS_MAP[order.status]?.color + '22',
                    color: STATUS_MAP[order.status]?.color,
                    padding: '2px 10px',
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                    {STATUS_MAP[order.status]?.label || '未知'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {order.status === 0 && (
                  <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(order.id, 1)}>
                    ✅ 确认支付
                  </button>
                )}
                {order.status === 1 && (
                  <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(order.id, 2)}>
                    🏠 办理入住
                  </button>
                )}
                {order.status === 2 && (
                  <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(order.id, 3)}>
                    🏁 完成入住
                  </button>
                )}
                {order.status === 0 && (
                  <button className="btn btn-secondary btn-sm" onClick={() => handleUpdateStatus(order.id, 4)}>
                    取消订单
                  </button>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(order.id, order.guestName)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
          <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} />
        </>
      )}
    </div>
  )
}
