import { useEffect, useState } from 'react'
import { api } from '../api'

export default function OrderManagePage() {
  const [orders, setOrders] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined)
  const [filterOrderType, setFilterOrderType] = useState<number | undefined>(undefined)
  const pageSize = 10

  const load = () => {
    const filters: any = {}
    if (filterStatus !== undefined) filters.status = filterStatus
    if (filterOrderType !== undefined) filters.orderType = filterOrderType
    api.getOrders(page, pageSize, Object.keys(filters).length > 0 ? filters : undefined)
      .then((res) => { setOrders(res.list); setTotal(res.total) })
  }
  useEffect(() => { load() }, [page, filterStatus, filterOrderType])

  const handleVerify = async (id: number) => {
    if (!confirm('确认核销此订单？')) return
    await api.verifyOrder(id)
    load()
  }

  const handleRefund = async (id: number) => {
    if (!confirm('确认退款此订单？退款后将恢复库存。')) return
    try {
      await api.refundOrder(id)
      load()
    } catch (e: any) {
      alert(e.message || '退款失败')
    }
  }

  const statusText: Record<number, string> = {
    0: '待使用', 1: '已核销', 2: '已过期', 3: '已取消', 4: '已退款',
  }
  const badgeClass: Record<number, string> = {
    0: 'badge-success', 1: 'badge-default', 2: 'badge-error', 3: 'badge-warning', 4: 'badge-warning',
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      <div className="page-header">
        <h2>订单管理</h2>
      </div>
      <div className="table-wrapper">
        <div className="table-toolbar">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 13 }}>状态筛选：</label>
            <select value={filterStatus ?? ''} onChange={(e) => setFilterStatus(e.target.value ? parseInt(e.target.value) : undefined)} style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 4 }}>
              <option value="">全部</option>
              <option value="0">待使用</option>
              <option value="1">已核销</option>
              <option value="2">已过期</option>
              <option value="3">已取消</option>
              <option value="4">已退款</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 13 }}>类型筛选：</label>
            <select value={filterOrderType ?? ''} onChange={(e) => setFilterOrderType(e.target.value ? parseInt(e.target.value) : undefined)} style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 4 }}>
              <option value="">全部</option>
              <option value="1">门票</option>
              <option value="2">路线套餐</option>
            </select>
          </div>
          <span>共 {total} 条</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>商品</th>
              <th>类型</th>
              <th>数量</th>
              <th>金额</th>
              <th>日期</th>
              <th>状态</th>
              <th>下单时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNo}</td>
                <td>{order.itemName}</td>
                <td>{order.orderType === 1 ? '门票' : '套餐'}</td>
                <td>{order.quantity}</td>
                <td style={{ color: 'var(--error)', fontWeight: 'bold' }}>¥{order.totalPrice}</td>
                <td>{order.visitDate || '-'}</td>
                <td>
                  <span className={`badge ${badgeClass[order.status] || 'badge-default'}`}>
                    {statusText[order.status] || '未知'}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  {order.status === 0 && (
                    <>
                      <button className="btn btn-success btn-sm" onClick={() => handleVerify(order.id)}>核销</button>
                      <button className="btn btn-warning btn-sm" onClick={() => handleRefund(order.id)} style={{ marginLeft: 4 }}>退款</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination" style={{ marginTop: 16 }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>上一页</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>下一页</button>
          </div>
        )}
      </div>
    </div>
  )
}
