import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { api } from './api'
import HomePage from './pages/HomePage'
import ScenicListPage from './pages/ScenicListPage'
import ScenicDetailPage from './pages/ScenicDetailPage'
import RouteListPage from './pages/RouteListPage'
import RouteDetailPage from './pages/RouteDetailPage'
import OrderPage from './pages/OrderPage'

// ---- 模拟当前用户 ID（后续对接用户认证时改为 JWT 提取） ----
const CURRENT_USER_ID = 1

function Header() {
  return (
    <header className="header">
      <div className="header-inner container">
        <span className="logo">乌东文旅</span>
        <nav className="nav-links">
          <Link to="/">首页</Link>
          <Link to="/scenic">景区门票</Link>
          <Link to="/routes">路线套餐</Link>
          <Link to={`/orders?userId=${CURRENT_USER_ID}`}>我的订单</Link>
        </nav>
      </div>
    </header>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scenic" element={<ScenicListPage />} />
        <Route path="/scenic/:id" element={<ScenicDetailPage />} />
        <Route path="/routes" element={<RouteListPage />} />
        <Route path="/routes/:id" element={<RouteDetailPage />} />
        <Route path="/orders" element={<OrderPage />} />
      </Routes>
      <footer className="footer">
        <div className="container">© 2026 乌东文旅 · 线路订票系统</div>
      </footer>
    </BrowserRouter>
  )
}

export default App
