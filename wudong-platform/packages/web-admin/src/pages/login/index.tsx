import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { adminApi } from '../../services/admin';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 已登录则直接跳转
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await adminApi.login(values.username, values.password);
      // 统一返回格式: { code, message, data: { accessToken, refreshToken, ... } }
      if (res.code === 200) {
        localStorage.setItem('admin_token', res.data.accessToken);
        localStorage.setItem('admin_refresh_token', res.data.refreshToken);
        message.success('登录成功');
        navigate('/dashboard', { replace: true });
      } else {
        message.error(res.message || '登录失败');
      }
    } catch (err: any) {
      // Axios interceptor already handles API errors
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a3a6b 0%, #1F5FA8 50%, #2B7BD4 100%)',
        padding: 24,
      }}
    >
      <Card
        style={{
          width: 400,
          maxWidth: '100%',
          borderRadius: 12,
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.2)',
        }}
        bodyStyle={{ padding: '40px 32px' }}
      >
        {/* Logo & 标题 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #1F5FA8, #2B7BD4)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 28,
              marginBottom: 16,
            }}
          >
            乌
          </div>
          <Title level={3} style={{ margin: 0, color: '#1F5FA8' }}>
            乌东文旅管理后台
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            管理员登录
          </Text>
        </div>

        <Form
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="用户名"
              autoFocus
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 44,
                fontSize: 16,
                background: '#1F5FA8',
                borderColor: '#1F5FA8',
                borderRadius: 8,
              }}
            >
              登 录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            © {new Date().getFullYear()} 乌东文旅综合服务平台
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
