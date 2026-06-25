import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card } from 'antd';
import request from '../utils/request';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('admin_token');
  if (token) { navigate('/'); return null; }

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await request.post('/admin/login', values);
      localStorage.setItem('admin_token', res.data.token);
      navigate('/');
    } catch {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card title="乌东文旅 · 管理后台" style={{ width: 400 }}>
        <Form onFinish={handleSubmit}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="用户名" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">登录</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
