import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme, Avatar, Dropdown, Badge } from 'antd';
import {
  ShoppingOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  UserOutlined,
  SettingOutlined,
  MessageOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { getAdminConversations, getOrderList, getReviewList } from '../utils/api';

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const pollRef = useRef(null);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [chatRes, orderRes, reviewRes] = await Promise.all([
          getAdminConversations(),
          getOrderList({ pageSize: 100 }),
          getReviewList({ pageSize: 100 }),
        ]);
        const chatTotal = (chatRes.data?.list || chatRes.data || []).reduce((sum, c) => sum + (c.unread || 0), 0);
        setUnreadCount(chatTotal);
        const orders = orderRes.data?.list || [];
        setPendingOrders(orders.filter(o => o.cancel_request === 1).length);
        const reviews = reviewRes.data?.list || [];
        setPendingReviews(reviews.filter(r => !r.reply).length);
      } catch {}
    };
    fetchAll();
    pollRef.current = setInterval(fetchAll, 5000);
    return () => clearInterval(pollRef.current);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: '商品管理',
    },
    {
      key: '/categories',
      icon: <AppstoreOutlined />,
      label: '分类管理',
    },
    {
      key: '/orders',
      icon: <OrderedListOutlined />,
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          订单管理
          {pendingOrders > 0 && <Badge count={pendingOrders} size="small" offset={[0, 0]} />}
        </span>
      ),
    },
    {
      key: '/chat',
      icon: <MessageOutlined />,
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          客服聊天
          {unreadCount > 0 && <Badge count={unreadCount} size="small" offset={[0, 0]} />}
        </span>
      ),
    },
    {
      key: '/reviews',
      icon: <StarOutlined />,
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          评价管理
          {pendingReviews > 0 && <Badge count={pendingReviews} size="small" offset={[0, 0]} />}
        </span>
      ),
    },
  ];

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        }}
      >
        {/* Logo区域 */}
        <div style={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          gap: collapsed ? 0 : 10,
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'rgba(201, 169, 110, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c9a96e',
            flexShrink: 0,
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          {!collapsed && (
            <div>
              <div style={{ color: '#fff', fontSize: 16, fontWeight: 600, lineHeight: 1.2 }}>乌东文旅</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>管理后台</div>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: 'transparent',
            border: 'none',
            marginTop: 8,
          }}
        />
      </Sider>

      <Layout>
        <Header style={{
          padding: '0 24px',
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 40, height: 40 }}
          />

          <Dropdown
            menu={{ items: userMenuItems, onClick: handleMenuClick }}
            placement="bottomRight"
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 8,
              transition: 'background 0.2s',
            }}>
              <Avatar
                size={36}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: '#c9a96e',
                }}
              />
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>管理员</div>
                <div style={{ fontSize: 11, color: '#999' }}>超级管理员</div>
              </div>
            </div>
          </Dropdown>
        </Header>

        <Content style={{
          margin: 24,
          minHeight: 280,
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
