import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  TagsOutlined,
  TagOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  FullscreenOutlined,
  LogoutOutlined,
  TeamOutlined,
  ShopOutlined,
  SafetyOutlined,
  FileTextOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Space, Dropdown, Tag, Tooltip, Typography } from 'antd';
import ProductList from './pages/clothing/product-list';
import CategoryList from './pages/clothing/category-list';
import Orders from './pages/clothing/orders';
import Reviews from './pages/clothing/reviews';
import Inventory from './pages/clothing/inventory';
import Statistics from './pages/clothing/statistics';
import FoodAdmin from './pages/food/index';
import AccommodationAdmin from './pages/modules/accommodation';
import TravelAdmin from './pages/modules/travel';
import CommunityAdmin from './pages/modules/community';
import OperationPage from './pages/operation';
import LoginPage from './pages/login';
import UserList from './pages/user/index';
import RoleList from './pages/user/roles';
import MerchantList from './pages/merchant/index';
import MerchantApplications from './pages/merchant/applications';
import MerchantLayout from './pages/merchant/merchant-layout';
import MerchantLogin from './pages/merchant/merchant-login';
import Dashboard from './pages/dashboard';
import MessagePage from './pages/message/index';
import FinancePage from './pages/finance/index';
import SystemPage from './pages/system/index';
import GlobalOrders from './pages/order/index';

const { Text } = Typography;

/* ============================================================
   菜单配置
   ============================================================ */
const menuItems = [
  { path: '/dashboard', name: '数据看板', icon: <DashboardOutlined /> },
  {
    path: '/modules', name: '业务管理', icon: <AppstoreOutlined />,
    children: [
      { path: '/modules/clothing', name: '商品管理', icon: <ShoppingOutlined /> },
      { path: '/modules/clothing/categories', name: '分类管理', icon: <TagsOutlined /> },
      { path: '/modules/clothing/orders', name: '订单管理', icon: <ShoppingCartOutlined /> },
      { path: '/modules/clothing/reviews', name: '评价管理', icon: <MessageOutlined /> },
      { path: '/modules/clothing/inventory', name: '价格库存管理', icon: <TagOutlined /> },
      { path: '/modules/clothing/statistics', name: '数据统计', icon: <DashboardOutlined /> },
      { path: '/modules/food', name: '餐饮管理', icon: <ShopOutlined /> },
      { path: '/modules/accommodation', name: '住宿管理', icon: <AppstoreOutlined /> },
      { path: '/modules/travel', name: '线路管理', icon: <AppstoreOutlined /> },
    ],
  },
  {
    path: '/user', name: '用户管理', icon: <UserOutlined />,
    children: [
      { path: '/user/list', name: '游客管理', icon: <TeamOutlined /> },
      { path: '/user/merchants', name: '商家管理', icon: <ShopOutlined /> },
      { path: '/user/roles', name: '角色权限', icon: <SafetyOutlined /> },
      { path: '/user/applications', name: '入驻审核', icon: <FileTextOutlined /> },
    ],
  },
  { path: '/order', name: '全局订单', icon: <ShoppingCartOutlined /> },
  { path: '/community', name: '内容审核', icon: <MessageOutlined /> },
  { path: '/operation', name: '首页运营', icon: <AppstoreOutlined /> },
  { path: '/message', name: '消息中心', icon: <BellOutlined /> },
  { path: '/finance', name: '财务结算', icon: <DollarOutlined /> },
  { path: '/system', name: '系统设置', icon: <SettingOutlined /> },
];

/* ============================================================
   占位页
   ============================================================ */
const Placeholder: React.FC<{ name: string; icon?: React.ReactNode }> = ({ name, icon }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
    color: '#bfbfbf',
  }}>
    <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>{icon || '🚧'}</div>
    <div style={{ fontSize: 20, fontWeight: 500, color: '#8c8c8c' }}>{name} — 开发中</div>
    <div style={{ fontSize: 13, color: '#bfbfbf', marginTop: 8 }}>即将上线，敬请期待</div>
  </div>
);

/* ============================================================
   后台布局（含 ProLayout 侧边栏）
   ============================================================ */
const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 用户下拉菜单
  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
    { key: 'settings', icon: <SettingOutlined />, label: '账户设置' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ];

  return (
    <ProLayout
      title="乌东文旅管理后台"
      logo={
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #1F5FA8, #2B7BD4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 16,
        }}>
          乌
        </div>
      }
      layout="side"
      navTheme="dark"
      fixedHeader
      fixSiderbar
      siderWidth={220}
      location={{ pathname: location.pathname }}
      menuDataRender={() => menuItems}
      menuItemRender={(item, defaultDom) => (
        <Link to={item.path || '/'} style={{ textDecoration: 'none' }}>
          {defaultDom}
        </Link>
      )}
      onMenuHeaderClick={() => navigate('/')}
      // 顶部操作栏
      actionsRender={() => [
        <Tooltip key="notice" title="消息通知">
          <span style={{ padding: '0 8px', cursor: 'pointer', fontSize: 18, color: '#666' }}>
            <BellOutlined />
          </span>
        </Tooltip>,
        <Tooltip key="fullscreen" title="全屏">
          <span
            style={{ padding: '0 8px', cursor: 'pointer', fontSize: 18, color: '#666' }}
            onClick={() => { document.documentElement.requestFullscreen?.(); }}
          >
            <FullscreenOutlined />
          </span>
        </Tooltip>,
        <Dropdown key="user" menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer', marginRight: 16, padding: '4px 8px', borderRadius: 6, transition: 'background 0.2s' }}>
            <Avatar
              size="small"
              style={{ backgroundColor: '#1F5FA8', verticalAlign: 'middle' }}
              icon={<UserOutlined />}
            />
            <Text style={{ fontSize: 13, color: '#666' }}>管理员</Text>
            <Tag color="blue" style={{ fontSize: 11, lineHeight: '18px', borderRadius: 4 }}>超级管理员</Tag>
          </Space>
        </Dropdown>,
      ]}
      // 页脚
      footerRender={() => (
        <DefaultFooter
          copyright={`${new Date().getFullYear()} 乌东文旅综合服务平台`}
          links={[
            { key: 'wudong', title: '乌东苗寨', href: '#', blankTarget: true },
            { key: 'admin', title: '管理后台', href: '#', blankTarget: true },
          ]}
          style={{ background: '#f5f7fa', borderTop: '1px solid #f0f0f0' }}
        />
      )}
      // 内容区域样式
      contentStyle={{ margin: 24, minHeight: 'calc(100vh - 140px)' }}
    >
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <Routes>
          <Route path="/" element={
            localStorage.getItem('admin_token')
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/modules/clothing" element={<ProductList />} />
          <Route path="/modules/clothing/categories" element={<CategoryList />} />
          <Route path="/modules/clothing/orders" element={<Orders />} />
          <Route path="/modules/clothing/reviews" element={<Reviews />} />
          <Route path="/modules/clothing/inventory" element={<Inventory />} />
          <Route path="/modules/clothing/statistics" element={<Statistics />} />
          <Route path="/modules/food" element={<FoodAdmin />} />
          <Route path="/modules/accommodation" element={<AccommodationAdmin />} />
          <Route path="/modules/travel" element={<TravelAdmin />} />
          <Route path="/user" element={<Navigate to="/user/list" replace />} />
          <Route path="/user/list" element={<UserList />} />
          <Route path="/user/merchants" element={<MerchantList />} />
          <Route path="/user/roles" element={<RoleList />} />
          <Route path="/user/applications" element={<MerchantApplications />} />
          <Route path="/order" element={<GlobalOrders />} />
          <Route path="/operation" element={<OperationPage />} />
          <Route path="/community" element={<CommunityAdmin />} />
          <Route path="/message" element={<MessagePage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/system" element={<SystemPage />} />
          <Route path="/system/*" element={<SystemPage />} />
        </Routes>
      </div>
    </ProLayout>
  );
};

/* ============================================================
   根组件：登录页 vs 后台布局
   ============================================================ */
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/merchant/login" element={<MerchantLogin />} />
      <Route path="/merchant/*" element={<MerchantLayout />} />
      <Route path="/*" element={<AdminLayout />} />
    </Routes>
  );
};

export default App;
