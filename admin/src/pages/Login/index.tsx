/* ============================================================
   管理后台登录页 — localStorage 存 token
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\Login\index.tsx
   ============================================================ */
import { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../store/auth';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      // 简化登录：直接存 token（后端实际返回 JWT token 后替换此处）
      const token = btoa(`${values.username}:${values.password}`);
      setToken(token);
      message.success('登录成功');
      nav('/dashboard');
    } catch {
      message.error('登录失败');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <Card style={{ width: 400, borderRadius: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <EnvironmentOutlined style={{ fontSize: 48, color: '#1F5FA8' }} />
          <h2 style={{ marginTop: 12, color: '#1F5FA8' }}>乌东文旅 · 管理后台</h2>
          <p style={{ color: '#999' }}>苗寨民宿预订管理系统</p>
        </div>
        <Form onFinish={handleLogin} size="large">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
