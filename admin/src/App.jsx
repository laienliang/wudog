import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Login from './pages/Login';
import AdminLayout from './pages/AdminLayout';
import ProductManage from './pages/ProductManage';
import CategoryManage from './pages/CategoryManage';
import OrderManage from './pages/OrderManage';
import ChatManage from './pages/ChatManage';
import ReviewManage from './pages/ReviewManage';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/products" replace />} />
            <Route path="products" element={<ProductManage />} />
            <Route path="categories" element={<CategoryManage />} />
            <Route path="orders" element={<OrderManage />} />
            <Route path="chat" element={<ChatManage />} />
            <Route path="reviews" element={<ReviewManage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
