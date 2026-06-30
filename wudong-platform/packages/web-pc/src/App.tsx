import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Modal, Form, Input, message, Dropdown, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  HeartOutlined,
  FileTextOutlined,
  ShopOutlined,
  BellOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import HomePage from './pages/home';
import ClothingList from './pages/clothing';
import ClothingDetail from './pages/clothing/detail';
import CartPage from './pages/clothing/cart';
import FavoritesPage from './pages/clothing/favorites';
import MyReviewsPage from './pages/clothing/my-reviews';
import OrdersPage from './pages/orders/index';
import FoodPage from './pages/food/index';
import RestaurantDetail from './pages/food/detail';
import FoodProductDetail from './pages/food/product-detail';
import AccommodationList from './pages/accommodation';
import AccommodationDetail from './pages/accommodation/detail';
import AccommodationBooking from './pages/accommodation/booking';
import TravelPage from './pages/travel';
import ScenicDetail from './pages/travel/scenic-detail';
import RouteDetail from './pages/travel/route-detail';
import CommunityPage from './pages/community';
import TravelogueDetail from './pages/community/travelogue-detail';
import TopicPage from './pages/community/topic';
import UserPage from './pages/community/user';
import CreateTravelogue from './pages/community/create';
import MerchantRegister from './pages/merchant/register';
import MessagePage from './pages/message';

const { Header, Content, Footer } = Layout;
const api = axios.create({ baseURL: '/api/v1' });

const navItems = [
  { key: '/', label: <Link to="/">首页</Link>, icon: <HomeOutlined /> },
  { key: '/clothing', label: <Link to="/clothing">民族服饰</Link> },
  { key: '/food', label: <Link to="/food">餐饮美食</Link> },
  { key: '/accommodation', label: <Link to="/accommodation">民宿预订</Link> },
  { key: '/travel', label: <Link to="/travel">苗寨出游</Link> },
  { key: '/community', label: <Link to="/community">社区分享</Link> },
];

const PagePlaceholder: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ textAlign: 'center', padding: '120px 24px', fontSize: 28, color: '#999' }}>🚧 {name}模块 — 开发中</div>
);

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [loginOpen, setLoginOpen] = useState(false);
  const [token, setToken] = useState<string>(localStorage.getItem('token') || '');
  const [form] = Form.useForm();

  const handleLogin = async (values: any) => {
    try {
      const res = await api.post('/auth/login', { phone: values.phone, password: values.password });
      const data = res.data?.data || res.data;
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        setToken(data.accessToken);
        setLoginOpen(false);
        form.resetFields();
        message.success('登录成功');
      }
    } catch {
      message.error('手机号或密码错误');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    message.success('已退出');
  };

  const userMenuItems = [
    { key: 'orders', icon: <ShoppingCartOutlined />, label: '我的订单', onClick: () => navigate('/orders') },
    { key: 'favorites', icon: <HeartOutlined />, label: '我的收藏', onClick: () => navigate('/favorites') },
    { key: 'reviews', icon: <FileTextOutlined />, label: '我的评价', onClick: () => navigate('/my-reviews') },
    { key: 'merchant', icon: <ShopOutlined />, label: '商家入驻', onClick: () => navigate('/merchant/register') },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 40px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {!isHome && (
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}
              style={{ fontSize: 18, color: '#666', marginRight: 4 }} />
          )}
          <Link to="/" style={{ fontSize: 20, fontWeight: 700, color: '#1F5FA8', textDecoration: 'none', whiteSpace: 'nowrap' }}>🏔️ 乌东文旅</Link>
          <Menu mode="horizontal" items={navItems} style={{ border: 'none', minWidth: 500 }} onClick={({ key }) => navigate(key)} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button type="text" onClick={() => navigate('/favorites')}>收藏夹</Button>
          <Button type="text" icon={<ShoppingCartOutlined />} onClick={() => navigate('/cart')}>购物车</Button>
          <Button type="text" icon={<BellOutlined />} onClick={() => navigate('/messages')} style={{ fontSize: 16 }} />
          {token ? (
            <Dropdown menu={{ items: userMenuItems }}>
              <Button type="primary" icon={<UserOutlined />}>用户</Button>
            </Dropdown>
          ) : (
            <Button type="primary" icon={<UserOutlined />} onClick={() => setLoginOpen(true)}>登录</Button>
          )}
        </div>
      </Header>

      <Content>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clothing" element={<ClothingList />} />
          <Route path="/clothing/:id" element={<ClothingDetail />} />
          <Route path="/food/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/food/product/:id" element={<FoodProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/my-reviews" element={<MyReviewsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/accommodation" element={<AccommodationList />} />
          <Route path="/accommodation/:id" element={<AccommodationDetail />} />
          <Route path="/accommodation/booking/:id" element={<AccommodationBooking />} />
          <Route path="/travel" element={<TravelPage />} />
          <Route path="/travel/scenic/:id" element={<ScenicDetail />} />
          <Route path="/travel/route/:id" element={<RouteDetail />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/create" element={<CreateTravelogue />} />
          <Route path="/community/travelogue/:id" element={<TravelogueDetail />} />
          <Route path="/community/topic/:id" element={<TopicPage />} />
          <Route path="/community/user/:id" element={<UserPage />} />
          <Route path="/merchant/register" element={<MerchantRegister />} />
          <Route path="/messages" element={<MessagePage />} />
        </Routes>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#f5f5f5', color: '#999', padding: '24px 50px' }}>
        乌东文旅 &copy; {new Date().getFullYear()} — 苗寨文化旅游一站式服务平台
      </Footer>

      <Modal title="登录" open={loginOpen} onOk={() => form.submit()} onCancel={() => setLoginOpen(false)} okText="登录" cancelText="取消">
        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default App;
