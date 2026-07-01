import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Address from './pages/Address';
import OrderConfirm from './pages/OrderConfirm';
import MyOrders from './pages/MyOrders';
import MyReviews from './pages/MyReviews';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/list" replace />} />
          <Route path="/list" element={<ProductList />} />
          <Route path="/detail/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/address" element={<Address />} />
          <Route path="/order-confirm" element={<OrderConfirm />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-reviews" element={<MyReviews />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
