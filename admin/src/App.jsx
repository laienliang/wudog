import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotesPage from './pages/module5/NotesPage';
import NoteDetailPage from './pages/module5/NoteDetailPage';
import TopicsPage from './pages/module5/TopicsPage';
import CommentsPage from './pages/module5/CommentsPage';
import ReportsPage from './pages/module5/ReportsPage';
import UsersPage from './pages/module5/UsersPage';
import CategoriesPage from './pages/module1/CategoriesPage';
import ProductsPage from './pages/module1/ProductsPage';
import Module1OrdersPage from './pages/module1/OrdersPage';
import ReviewsPage from './pages/module1/ReviewsPage';
import RestaurantsPage from './pages/module2/RestaurantsPage';
import DishesPage from './pages/module2/DishesPage';
import Module2BookingsPage from './pages/module2/BookingsPage';
import FarmProductsPage from './pages/module2/FarmProductsPage';
import HomestaysPage from './pages/module3/HomestaysPage';
import RoomTypesPage from './pages/module3/RoomTypesPage';
import Module3OrdersPage from './pages/module3/OrdersPage';
import ScenicSpotsPage from './pages/module4/ScenicSpotsPage';
import TicketsPage from './pages/module4/TicketsPage';
import RoutesPage from './pages/module4/RoutesPage';
import ETicketsPage from './pages/module4/ETicketsPage';
import MerchantApplicationsPage from './pages/MerchantApplicationsPage';
import BannersPage from './pages/BannersPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import OperationLogsPage from './pages/OperationLogsPage';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={
        <PrivateRoute>
          <AdminLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/module1/categories" element={<CategoriesPage />} />
              <Route path="/module1/products" element={<ProductsPage />} />
              <Route path="/module1/orders" element={<Module1OrdersPage />} />
              <Route path="/module1/reviews" element={<ReviewsPage />} />
              <Route path="/module2/restaurants" element={<RestaurantsPage />} />
              <Route path="/module2/dishes" element={<DishesPage />} />
              <Route path="/module2/bookings" element={<Module2BookingsPage />} />
              <Route path="/module2/farm-products" element={<FarmProductsPage />} />
              <Route path="/module3/homestays" element={<HomestaysPage />} />
              <Route path="/module3/room-types" element={<RoomTypesPage />} />
              <Route path="/module3/orders" element={<Module3OrdersPage />} />
              <Route path="/module4/scenic-spots" element={<ScenicSpotsPage />} />
              <Route path="/module4/tickets" element={<TicketsPage />} />
              <Route path="/module4/routes" element={<RoutesPage />} />
              <Route path="/module4/e-tickets" element={<ETicketsPage />} />
              <Route path="/module5/notes" element={<NotesPage />} />
              <Route path="/module5/notes/:id" element={<NoteDetailPage />} />
              <Route path="/module5/topics" element={<TopicsPage />} />
              <Route path="/module5/comments" element={<CommentsPage />} />
              <Route path="/module5/reports" element={<ReportsPage />} />
              <Route path="/module5/users" element={<UsersPage />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/merchant-applications" element={<MerchantApplicationsPage />} />
              <Route path="/admin/banners" element={<BannersPage />} />
              <Route path="/admin/notifications" element={<NotificationsPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/logs" element={<OperationLogsPage />} />
            </Routes>
          </AdminLayout>
        </PrivateRoute>
      } />
    </Routes>
  );
}
