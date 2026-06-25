import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/login" />;
  return children;
}

function Placeholder({ title }) {
  return <div style={{ padding: 40, textAlign: 'center' }}><h3>{title}</h3><p style={{ color: '#999' }}>该管理页面将在后续阶段完成</p></div>;
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
              <Route path="/module1/categories" element={<Placeholder title="商品分类管理" />} />
              <Route path="/module1/products" element={<Placeholder title="商品管理" />} />
              <Route path="/module1/orders" element={<Placeholder title="订单管理" />} />
              <Route path="/module1/reviews" element={<Placeholder title="评价管理" />} />
              <Route path="/module2/restaurants" element={<Placeholder title="餐厅管理" />} />
              <Route path="/module2/dishes" element={<Placeholder title="菜品管理" />} />
              <Route path="/module2/bookings" element={<Placeholder title="预订管理" />} />
              <Route path="/module2/farm-products" element={<Placeholder title="农产品管理" />} />
              <Route path="/module3/homestays" element={<Placeholder title="民宿管理" />} />
              <Route path="/module3/room-types" element={<Placeholder title="房型管理" />} />
              <Route path="/module3/orders" element={<Placeholder title="订单管理" />} />
              <Route path="/module4/scenic-spots" element={<Placeholder title="景区管理" />} />
              <Route path="/module4/tickets" element={<Placeholder title="票种管理" />} />
              <Route path="/module4/routes" element={<Placeholder title="路线管理" />} />
              <Route path="/module4/e-tickets" element={<Placeholder title="电子票核销" />} />
              <Route path="/module5/notes" element={<Placeholder title="游记审核" />} />
              <Route path="/module5/topics" element={<Placeholder title="话题管理" />} />
              <Route path="/module5/comments" element={<Placeholder title="评论管理" />} />
              <Route path="/module5/reports" element={<Placeholder title="举报处理" />} />
              <Route path="/admin/users" element={<Placeholder title="用户管理" />} />
              <Route path="/admin/merchant-applications" element={<Placeholder title="商家入驻审核" />} />
              <Route path="/admin/banners" element={<Placeholder title="轮播图管理" />} />
              <Route path="/admin/notifications" element={<Placeholder title="消息中心" />} />
              <Route path="/admin/orders" element={<Placeholder title="全局订单" />} />
              <Route path="/admin/logs" element={<Placeholder title="操作日志" />} />
            </Routes>
          </AdminLayout>
        </PrivateRoute>
      } />
    </Routes>
  );
}
