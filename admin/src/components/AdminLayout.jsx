import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined, ShopOutlined, CoffeeOutlined, HomeOutlined,
  CarOutlined, FileTextOutlined, SettingOutlined, LogoutOutlined,
} from '@ant-design/icons';

const { Sider, Content, Header } = Layout;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '工作台' },
  {
    key: 'module1', icon: <ShopOutlined />, label: '衣·非遗好物',
    children: [
      { key: '/module1/categories', label: '商品分类' },
      { key: '/module1/products', label: '商品管理' },
      { key: '/module1/orders', label: '订单管理' },
      { key: '/module1/reviews', label: '评价管理' },
    ],
  },
  {
    key: 'module2', icon: <CoffeeOutlined />, label: '食·餐饮美食',
    children: [
      { key: '/module2/restaurants', label: '餐厅管理' },
      { key: '/module2/dishes', label: '菜品管理' },
      { key: '/module2/bookings', label: '预订管理' },
      { key: '/module2/farm-products', label: '农产品管理' },
    ],
  },
  {
    key: 'module3', icon: <HomeOutlined />, label: '住·民宿预订',
    children: [
      { key: '/module3/homestays', label: '民宿管理' },
      { key: '/module3/room-types', label: '房型管理' },
      { key: '/module3/orders', label: '订单管理' },
    ],
  },
  {
    key: 'module4', icon: <CarOutlined />, label: '行·景区出行',
    children: [
      { key: '/module4/scenic-spots', label: '景区管理' },
      { key: '/module4/tickets', label: '票种管理' },
      { key: '/module4/routes', label: '路线管理' },
      { key: '/module4/e-tickets', label: '电子票核销' },
    ],
  },
  {
    key: 'module5', icon: <FileTextOutlined />, label: '社区·分享',
    children: [
      { key: '/module5/notes', label: '游记审核' },
      { key: '/module5/topics', label: '话题管理' },
      { key: '/module5/comments', label: '评论管理' },
      { key: '/module5/reports', label: '举报处理' },
    ],
  },
  {
    key: 'admin', icon: <SettingOutlined />, label: '系统管理',
    children: [
      { key: '/admin/users', label: '用户管理' },
      { key: '/admin/merchant-applications', label: '商家入驻审核' },
      { key: '/admin/banners', label: '轮播图管理' },
      { key: '/admin/notifications', label: '消息中心' },
      { key: '/admin/orders', label: '全局订单' },
      { key: '/admin/logs', label: '操作日志' },
    ],
  },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{
          height: 48, margin: 16, color: '#fff',
          fontSize: collapsed ? 14 : 18, fontWeight: 'bold',
          textAlign: 'center', lineHeight: '48px',
        }}>
          {collapsed ? '乌东' : '乌东村管理'}
        </div>
        <Menu
          theme="dark" mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['module1', 'module2', 'module3', 'module4', 'module5', 'admin']}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>退出登录</Button>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
