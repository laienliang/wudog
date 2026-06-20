/**
 * 主布局组件
 * 管理后台的整体页面框架，包含侧边导航菜单、顶部用户操作栏和内容区域
 *
 * 设计特色：
 * - 侧边栏使用苗银蓝深色调（#0A1929），体现银饰冷冽质感
 * - Logo 区域底部有苗族蜡染几何纹样装饰带
 * - 内容区使用圆角卡片和品牌阴影
 */
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Space, message, Avatar } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  FileTextOutlined,
  PictureOutlined,
  AuditOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
  DollarOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

/** 侧边栏菜单配置项 */
const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '数据看板' },
  {
    key: 'admin-mgmt',
    icon: <SafetyCertificateOutlined />,
    label: '管理员管理',
    children: [
      { key: '/admin/list', label: '管理员列表' },
      { key: '/role/list', label: '角色管理' },
    ],
  },
  {
    key: 'user-mgmt',
    icon: <TeamOutlined />,
    label: '用户管理',
    children: [
      { key: '/user/list', label: '用户列表' },
    ],
  },
  {
    key: 'merchant-mgmt',
    icon: <ShopOutlined />,
    label: '商家管理',
    children: [
      { key: '/merchant/list', label: '商家列表' },
      { key: '/merchant/application', label: '入驻审核' },
    ],
  },
  {
    key: 'content-mgmt',
    icon: <FileTextOutlined />,
    label: '内容管理',
    children: [
      { key: '/content/announcement', label: '公告管理' },
      { key: '/content/carousel', label: '轮播图管理' },
      { key: '/content/banner', label: '活动横幅' },
      { key: '/content/recommendation', label: '推荐位管理' },
    ],
  },
  {
    key: 'order-mgmt',
    icon: <ShoppingCartOutlined />,
    label: '订单管理',
    children: [
      { key: '/order/list', label: '全局订单' },
      { key: '/order/refund', label: '退款审批' },
      { key: '/order/abnormal', label: '异常订单' },
    ],
  },
  {
    key: 'message-mgmt',
    icon: <MessageOutlined />,
    label: '消息中心',
    children: [
      { key: '/message/list', label: '系统消息' },
      { key: '/message/template', label: '消息模板' },
    ],
  },
  {
    key: 'finance-mgmt',
    icon: <DollarOutlined />,
    label: '财务结算',
    children: [
      { key: '/finance/list', label: '结算列表' },
      { key: '/finance/report', label: '财务报表' },
      { key: '/finance/reconciliation', label: '对账管理' },
    ],
  },
  {
    key: 'system-mgmt',
    icon: <SettingOutlined />,
    label: '系统设置',
    children: [
      { key: '/system/config', label: '系统配置' },
      { key: '/system/sensitive', label: '敏感词库' },
      { key: '/system/log', label: '操作日志' },
    ],
  },
];

/**
 * 主布局组件
 * 包含可折叠侧边栏、顶部导航和路由内容区域
 */
export default function MainLayout() {
  /** 侧边栏折叠状态 */
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  /** 从本地存储解析当前登录管理员信息 */
  const adminStr = localStorage.getItem('admin');
  const admin = adminStr ? JSON.parse(adminStr) : {};

  /** 退出登录，清除本地凭证并跳转登录页 */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    message.success('已退出登录');
    navigate('/login');
  };

  /** 用户下拉菜单配置 */
  const userMenu = {
    items: [
      { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout },
    ],
  };

  /** 根据当前路径计算需要展开的菜单项 */
  const openKeys = menuItems
    .filter((item) => item.children?.some((c) => c.key === location.pathname))
    .map((item) => item.key);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        style={{
          background: 'var(--color-sider-bg)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Logo 区域 */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: collapsed ? 0 : 10,
          color: '#FFFFFF',
          fontSize: collapsed ? 16 : 18,
          fontWeight: 'var(--weight-bold)',
          fontFamily: 'var(--font-family-heading)',
          whiteSpace: 'nowrap',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          letterSpacing: '0.5px',
          padding: '0 16px',
        }}>
          <img
            src="/logo.png"
            alt="乌东文旅"
            style={{
              width: collapsed ? 32 : 36,
              height: collapsed ? 32 : 36,
              objectFit: 'contain',
              transition: 'all 0.2s',
            }}
          />
          {!collapsed && <span>乌东文旅管理后台</span>}
        </div>

        {/* 导航菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={openKeys}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            borderRight: 0,
            background: 'transparent',
          }}
        />

        {/* 底部苗族蜡染装饰带 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `repeating-linear-gradient(
            90deg,
            var(--color-primary) 0px,
            var(--color-primary) 12px,
            transparent 12px,
            transparent 16px,
            var(--color-embroidery) 16px,
            var(--color-embroidery) 20px,
            transparent 20px,
            transparent 24px
          )`,
          opacity: 0.7,
        }} />
      </Sider>

      <Layout>
        {/* 顶部栏 */}
        <Header style={{
          background: 'var(--color-bg-card)',
          padding: '0 var(--spacing-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-light)',
          borderBottom: '1px solid var(--color-border-light)',
          height: 64,
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, color: 'var(--color-text-secondary)' }}
          />
          <Dropdown menu={userMenu}>
            <Space style={{ cursor: 'pointer', color: 'var(--color-text-primary)' }}>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ background: 'var(--color-primary)' }}
              />
              <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-medium)' }}>
                {admin.name || admin.username || '管理员'}
              </span>
            </Space>
          </Dropdown>
        </Header>

        {/* 内容区域 */}
        <Content style={{
          margin: 'var(--spacing-lg)',
          padding: 'var(--spacing-lg)',
          background: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-lg)',
          minHeight: 280,
          boxShadow: 'var(--shadow-light)',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
