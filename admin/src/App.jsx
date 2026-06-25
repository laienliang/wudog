import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/login/LoginPage'
import AdminLayout from './layouts/AdminLayout'
import AccommodationPage from './pages/accommodation/AccommodationPage'
import RoomPage from './pages/room/RoomPage'
import OrderPage from './pages/order/OrderPage'
import ReviewPage from './pages/review/ReviewPage'
import VillagePage from './pages/village/VillagePage'
import CalendarPage from './pages/calendar/CalendarPage'

// 鉴权守卫
function RequireAuth({ children }) {
  const token = localStorage.getItem('admin_token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/accommodation" replace />} />
          <Route path="accommodation" element={<AccommodationPage />} />
          <Route path="room" element={<RoomPage />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="village" element={<VillagePage />} />
          <Route path="calendar" element={<CalendarPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
