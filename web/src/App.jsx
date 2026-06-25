import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import AccommodationList from './pages/accommodation/AccommodationList'
import AccommodationDetail from './pages/accommodation/AccommodationDetail'
import AccommodationForm from './pages/accommodation/AccommodationForm'
import VillageList from './pages/village/VillageList'
import OrderList from './pages/order/OrderList'
import RoomForm from './pages/room/RoomForm'
import RoomCalendarForm from './pages/room-calendar/RoomCalendarForm'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />

          {/* 民宿住宿 */}
          <Route path="accommodation" element={<AccommodationList />} />
          <Route path="accommodation/detail/:id" element={<AccommodationDetail />} />
          <Route path="accommodation/create" element={<AccommodationForm />} />
          <Route path="accommodation/edit/:id" element={<AccommodationForm />} />

          {/* 房型 */}
          <Route path="room/create" element={<RoomForm />} />
          <Route path="room/edit/:id" element={<RoomForm />} />

          {/* 房态日历 */}
          <Route path="room-calendar/create" element={<RoomCalendarForm />} />

          {/* 苗寨景区 */}
          <Route path="village" element={<VillageList />} />

          {/* 订单 */}
          <Route path="order" element={<OrderList />} />

          {/* 兜底 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
