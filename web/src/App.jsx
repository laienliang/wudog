import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ListPage from './pages/module5/ListPage';
import LoginPage from './pages/module5/LoginPage';
import DetailPage from './pages/module5/DetailPage';
import EditPage from './pages/module5/EditPage';
import TopicPage from './pages/module5/TopicPage';
import UserPage from './pages/module5/UserPage';
import MyPage from './pages/module5/MyPage';
import Module1ListPage from './pages/module1/ListPage';
import Module1DetailPage from './pages/module1/DetailPage';
import Module1CartPage from './pages/module1/CartPage';
import Module1CheckoutPage from './pages/module1/CheckoutPage';
import Module1OrdersPage from './pages/module1/OrdersPage';
import Module2ListPage from './pages/module2/ListPage';
import RestaurantDetailPage from './pages/module2/RestaurantDetailPage';
import FarmProductDetailPage from './pages/module2/FarmProductDetailPage';
import Module2BookingsPage from './pages/module2/BookingsPage';
import Module3ListPage from './pages/module3/ListPage';
import Module3DetailPage from './pages/module3/DetailPage';
import Module3OrdersPage from './pages/module3/OrdersPage';
import Module4ListPage from './pages/module4/ListPage';
import Module4SpotDetailPage from './pages/module4/SpotDetailPage';
import Module4RouteDetailPage from './pages/module4/RouteDetailPage';
import Module4OrdersPage from './pages/module4/OrdersPage';

export default function App() {
  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/module5/list" />} />
          <Route path="/module5/list" element={<ListPage />} />
          <Route path="/module5/detail/:id" element={<DetailPage />} />
          <Route path="/module5/edit" element={<EditPage />} />
          <Route path="/module5/edit/:id" element={<EditPage />} />
          <Route path="/module5/topic/:id" element={<TopicPage />} />
          <Route path="/module5/user/:id" element={<UserPage />} />
          <Route path="/module5/my" element={<MyPage />} />
          <Route path="/module5/login" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/module1" element={<Module1ListPage />} />
          <Route path="/module1/detail/:id" element={<Module1DetailPage />} />
          <Route path="/module1/cart" element={<Module1CartPage />} />
          <Route path="/module1/checkout" element={<Module1CheckoutPage />} />
          <Route path="/module1/orders" element={<Module1OrdersPage />} />
          <Route path="/module2" element={<Module2ListPage />} />
          <Route path="/module2/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/module2/farm/:id" element={<FarmProductDetailPage />} />
          <Route path="/module2/bookings" element={<Module2BookingsPage />} />
          <Route path="/module3" element={<Module3ListPage />} />
          <Route path="/module3/homestay/:id" element={<Module3DetailPage />} />
          <Route path="/module3/orders" element={<Module3OrdersPage />} />
          <Route path="/module4" element={<Module4ListPage />} />
          <Route path="/module4/spot/:id" element={<Module4SpotDetailPage />} />
          <Route path="/module4/route/:id" element={<Module4RouteDetailPage />} />
          <Route path="/module4/orders" element={<Module4OrdersPage />} />
          <Route path="/community" element={<Navigate to="/module5/list" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
