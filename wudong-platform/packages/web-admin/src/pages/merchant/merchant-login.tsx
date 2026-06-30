import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/admin';

const { Text, Title } = Typography;

/* ============================================================
   商家品牌色
   ============================================================ */
const COLORS = {
  primary: '#6B8E3D',
  primaryLight: '#8DB560',
  sidebarBg: '#2C3A1F',
};

/* ============================================================
   商家登录页面
   ============================================================ */
const MerchantLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await adminApi.login(values.username, values.password);
      const data = res.data || res;
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        message.success('登录成功');
        navigate('/merchant/dashboard');
      } else {
        // MVP: allow mock login for demo
        localStorage.setItem('admin_token', 'mock-merchant-token');
        message.success('登录成功（演示模式）');
        navigate('/merchant/dashboard');
      }
    } catch {
      // MVP: fallback mock login
      localStorage.setItem('admin_token', 'mock-merchant-token');
      message.success('登录成功（演示模式）');
      navigate('/merchant/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #2C3A1F 0%, #4A6B2A 50%, #6B8E3D 100%)',
      padding: 24,
    }}>
      <Card
        style={{
          width: 420,
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          border: 'none',
        }}
        styles={{ body: { padding: '40px 32px' } }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #6B8E3D, #8DB560)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 28,
            fontWeight: 700,
            margin: '0 auto 16px',
          }}>
            <ShopOutlined />
          </div>
          <Title level={3} style={{ margin: 0, color: '#262626' }}>商家管理后台</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>乌东文旅综合服务平台</Text>
        </div>

        <Form
          layout="vertical"
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="用户名"
              size="large"
              style={{ borderRadius: 8, height: 48 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="密码"
              size="large"
              style={{ borderRadius: 8, height: 48 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                borderRadius: 8,
                height: 48,
                background: COLORS.primary,
                borderColor: COLORS.primary,
                boxShadow: '0 4px 12px rgba(107, 142, 61, 0.3)',
                fontSize: 16,
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            演示账号：admin / admin123
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default MerchantLogin;
