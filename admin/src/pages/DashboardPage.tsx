import { useEffect, useState } from 'react'
import { api } from '../api'

export default function DashboardPage() {
  const [stats, setStats] = useState({ scenicCount: 0, routeCount: 0, orderCount: 0, ticketCount: 0 })

  useEffect(() => {
    Promise.all([
      api.getScenicSpots(1, 1),
      api.getRoutes(),
      api.getOrders(1, 1),
      api.getTicketTypes(),
    ])
      .then(([spotRes, routeRes, orderRes, ticketRes]) => {
        setStats({
          scenicCount: spotRes.total,
          routeCount: routeRes.length,
          orderCount: orderRes.total,
          ticketCount: ticketRes.length,
        })
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      <div className="page-header">
        <h2>仪表盘</h2>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.scenicCount}</div>
          <div className="stat-label">景区总数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.ticketCount}</div>
          <div className="stat-label">票种数量</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.routeCount}</div>
          <div className="stat-label">路线套餐</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.orderCount}</div>
          <div className="stat-label">订单总数</div>
        </div>
      </div>
    </div>
  )
}
