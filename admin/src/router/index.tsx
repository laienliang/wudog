/* ============================================================
   管理后台路由
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\router\index.tsx
   ============================================================ */
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AdminLayout from '../components/Layout';
import AuthGuard from '../components/AuthGuard';
import LoginPage from '../pages/Login';
import DashboardPage from '../pages/Dashboard';
import HomestayPage from '../pages/Homestay';
import RoomPage from '../pages/Room';
import CalendarPage from '../pages/Calendar';
import OrderPage from '../pages/Order';
import ReviewPage from '../pages/Review';
import HouseRulePage from '../pages/HouseRule';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <AuthGuard><AdminLayout /></AuthGuard>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'homestay', element: <HomestayPage /> },
      { path: 'room', element: <RoomPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'order', element: <OrderPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'house-rule', element: <HouseRulePage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
