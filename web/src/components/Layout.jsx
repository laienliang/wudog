import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <nav className="navbar">
        <span className="navbar-brand">🏡 乌东文旅平台</span>
        <NavLink className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')} to="/accommodation">民宿住宿</NavLink>
        <NavLink className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')} to="/village">苗寨景区</NavLink>
        <NavLink className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')} to="/order">我的订单</NavLink>
      </nav>
      <Outlet />
    </>
  )
}
