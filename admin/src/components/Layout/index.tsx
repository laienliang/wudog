/* ============================================================
   管理后台布局 — Ant Design ProLayout 风格
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\components\Layout\index.tsx
   ============================================================ */
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme, Dropdown } from 'antd';
import {
  DashboardOutlined, HomeOutlined, AppstoreOutlined,
  CalendarOutlined, ShoppingCartOutlined, StarOutlined,
  FileTextOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
} from '@ant-design/icons';
import { removeToken } from '../../store/auth';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/homestay', icon: <HomeOutlined />, label: '民宿管理' },
  { key: '/room', icon: <AppstoreOutlined />, label: '房型管理' },
  { key: '/calendar', icon: <CalendarOutlined />, label: '房态日历' },
  { key: '/order', icon: <ShoppingCartOutlined />, label: '订单管理' },
  { key: '/review', icon: <StarOutlined />, label: '评价管理' },
  { key: '/house-rule', icon: <FileTextOutlined />, label: '入住须知' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const { token: antToken } = theme.useToken();

  const handleLogout = () => {
    removeToken();
    nav('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: collapsed ? 14 : 18, fontWeight: 700, whiteSpace: 'nowrap' }}>
          {collapsed ? '乌东' : '乌东文旅·管理后台'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[loc.pathname]}
          items={menuItems}
          onClick={({ key }) => nav(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: antToken.colorBgContainer, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} />
          <Dropdown menu={{ items: [{ key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout }] }}>
            <Button type="text">管理员</Button>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: antToken.colorBgContainer, borderRadius: 8, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
