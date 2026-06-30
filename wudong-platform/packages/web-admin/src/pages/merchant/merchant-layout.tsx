import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, Button, Space, Avatar, Dropdown, Tooltip } from 'antd';
import {
  DashboardOutlined,
  SettingOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
  LogoutOutlined,
  UserOutlined,
  ShopOutlined,
  BellOutlined,
} from '@ant-design/icons';
import MerchantDashboard from './merchant-dashboard';
import MerchantSettings from './merchant-settings';
import MerchantMessages from './merchant-messages';
import MerchantAccount from './merchant-account';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

/* ============================================================
   商家品牌色 - 绿色/棕色系
   ============================================================ */
const MERCHANT_COLORS = {
  primary: '#6B8E3D',        // 橄榄绿
  primaryDark: '#4A6B2A',    // 深绿
  primaryLight: '#8DB560',   // 浅绿
  accent: '#8B6B4A',         // 棕色
  accentLight: '#A88B6B',    // 浅棕色
  bgLight: '#F7F5F0',        // 米白背景
  sidebarBg: '#2C3A1F',      // 深绿侧边栏
  sidebarText: '#C4D4B0',    // 侧边栏文字
  sidebarSelected: '#6B8E3D', // 侧边栏选中
  headerBg: '#FFFFFF',
};

/* ============================================================
   占位组件
   ============================================================ */
const Placeholder: React.FC<{ name: string }> = ({ name }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
    color: '#bfbfbf',
  }}>
    <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>🚧</div>
    <div style={{ fontSize: 20, fontWeight: 500, color: '#8c8c8c' }}>{name} — 开发中</div>
    <div style={{ fontSize: 13, color: '#bfbfbf', marginTop: 8 }}>即将上线，敬请期待</div>
  </div>
);

/* ============================================================
   商家端布局
   ============================================================ */
const MerchantLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 侧边栏菜单项
  const menuItems = [
    {
      key: '/merchant/dashboard',
      icon: <DashboardOutlined />,
      label: '工作台',
    },
    {
      key: '/merchant/settings',
      icon: <SettingOutlined />,
      label: '店铺设置',
    },
    {
      key: '/merchant/products',
      icon: <ShoppingOutlined />,
      label: '商品管理',
    },
    {
      key: '/merchant/orders',
      icon: <ShoppingCartOutlined />,
      label: '订单管理',
    },
    {
      key: '/merchant/messages',
      icon: <MessageOutlined />,
      label: '消息通知',
    },
    {
      key: '/merchant/account',
      icon: <UserOutlined />,
      label: '账户设置',
    },
  ];

  // 用户下拉菜单
  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
    { key: 'switch', icon: <ShopOutlined />, label: '切换至管理后台' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ];

  const handleMenuClick = (info: { key: string }) => {
    navigate(info.key);
  };

  const handleLogout = () => {
    // MVP: 清除 token 并跳转
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: MERCHANT_COLORS.bgLight }}>
      {/* ===== 侧边栏 ===== */}
      <Sider
        width={220}
        style={{
          background: MERCHANT_COLORS.sidebarBg,
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        {/* Logo 区域 */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
          onClick={() => navigate('/merchant/dashboard')}
        >
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #6B8E3D, #8DB560)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            marginRight: 10,
          }}>
            乌
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>
              商家管理后台
            </div>
            <div style={{ color: MERCHANT_COLORS.sidebarText, fontSize: 11 }}>
              乌东文旅平台
            </div>
          </div>
        </div>

        {/* 菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={[]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            background: 'transparent',
            borderRight: 'none',
            padding: '8px 0',
          }}
        />
      </Sider>

      {/* ===== 主区域 ===== */}
      <Layout style={{ marginLeft: 220, background: MERCHANT_COLORS.bgLight }}>
        {/* ===== 顶部栏 ===== */}
        <Header
          style={{
            background: MERCHANT_COLORS.headerBg,
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          {/* 左侧：店铺名称 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShopOutlined style={{ fontSize: 20, color: MERCHANT_COLORS.primary }} />
            <Text strong style={{ fontSize: 16, color: '#262626' }}>
              乌东苗绣工坊
            </Text>
            <span style={{
              display: 'inline-block',
              padding: '2px 10px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              background: '#FFF7E6',
              color: '#D48806',
              border: '1px solid #FFE7BA',
            }}>
              正常营业
            </span>
          </div>

          {/* 右侧：操作区 */}
          <Space size={16}>
            <Tooltip title="消息通知">
              <span style={{ padding: '4px 8px', cursor: 'pointer', fontSize: 18, color: '#666' }}>
                <BellOutlined />
              </span>
            </Tooltip>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 6, transition: 'background 0.2s' }}>
                <Avatar
                  size="small"
                  style={{ backgroundColor: MERCHANT_COLORS.primary, verticalAlign: 'middle' }}
                  icon={<UserOutlined />}
                />
                <Text style={{ fontSize: 13, color: '#666' }}>苗绣工坊</Text>
              </Space>
            </Dropdown>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ color: '#8c8c8c' }}
            >
              退出
            </Button>
          </Space>
        </Header>

        {/* ===== 内容区域 ===== */}
        <Content style={{ margin: 24, minHeight: 'calc(100vh - 112px)' }}>
          <Routes>
            <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
            <Route path="/merchant/settings" element={<MerchantSettings />} />
            <Route path="/merchant/products" element={<Placeholder name="商品管理" />} />
            <Route path="/merchant/orders" element={<Placeholder name="订单管理" />} />
            <Route path="/merchant/messages" element={<MerchantMessages />} />
            <Route path="/merchant/account" element={<MerchantAccount />} />
            <Route path="/merchant" element={<Navigate to="/merchant/dashboard" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MerchantLayout;
