import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ScenicManagePage from './pages/ScenicManagePage'
import TicketManagePage from './pages/TicketManagePage'
import RouteManagePage from './pages/RouteManagePage'
import OrderManagePage from './pages/OrderManagePage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token')
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

function Layout() {
  const [active, setActive] = useState('/dashboard')
  const navigate = useNavigate()

  const menuItems = [
    { path: '/dashboard', label: '仪表盘' },
    { path: '/scenic', label: '景区管理' },
    { path: '/ticket', label: '票种管理' },
    { path: '/route', label: '路线套餐' },
    { path: '/orders', label: '订单管理' },
  ]

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">乌东文旅 · 管理后台</div>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={active === item.path ? 'active' : ''}
              onClick={() => {
                setActive(item.path)
                navigate(item.path)
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/scenic" element={<ScenicManagePage />} />
          <Route path="/ticket" element={<TicketManagePage />} />
          <Route path="/route" element={<RouteManagePage />} />
          <Route path="/orders" element={<OrderManagePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}
