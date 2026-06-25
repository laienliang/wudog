import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Typography, Space, theme } from 'antd'
import {
  HomeOutlined,
  ShopOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  StarOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'

const { Sider, Header, Content } = Layout
const { Text } = Typography

const menuItems = [
  { key: '/accommodation', icon: <ShopOutlined />, label: '住宿管理' },
  { key: '/room', icon: <AppstoreOutlined />, label: '房型管理' },
  { key: '/calendar', icon: <CalendarOutlined />, label: '房态日历' },
  { key: '/order', icon: <OrderedListOutlined />, label: '订单管理' },
  { key: '/review', icon: <StarOutlined />, label: '评论管理' },
  { key: '/village', icon: <EnvironmentOutlined />, label: '苗寨管理' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const userStr = localStorage.getItem('admin_user')
  const user = userStr ? JSON.parse(userStr) : { name: '管理员' }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/login')
  }

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        danger: true,
        onClick: handleLogout,
      },
    ],
  }

  const currentKey = '/' + location.pathname.split('/')[1]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        style={{ background: '#1a2e1a' }}
        width={220}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: collapsed ? 20 : 16,
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '0 16px',
          gap: 8,
        }}>
          <span>🏡</span>
          {!collapsed && <span>乌东文旅后台</span>}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[currentKey]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: '#1a2e1a', marginTop: 8 }}
        />
      </Sider>

      <Layout>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}>
          <Text strong style={{ fontSize: 16, color: '#1a6b3a' }}>
            {menuItems.find(m => m.key === currentKey)?.label || '乌东文旅后台管理'}
          </Text>
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar style={{ background: '#1a6b3a' }} icon={<UserOutlined />} />
              <Text>{user.name}</Text>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
