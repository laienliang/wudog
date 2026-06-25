import React, { useState } from 'react'
import { Form, Input, Button, Card, message, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

// 模拟管理员账号（实际项目应调后端登录接口）
const ADMIN_ACCOUNTS = [
  { username: 'admin', password: 'admin123', name: '超级管理员' },
  { username: 'manager', password: '123456', name: '运营经理' },
]

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = (values) => {
    setLoading(true)
    setTimeout(() => {
      const account = ADMIN_ACCOUNTS.find(
        a => a.username === values.username && a.password === values.password
      )
      if (account) {
        // 生成 mock token
        const token = `mock_token_${account.username}_${Date.now()}`
        localStorage.setItem('admin_token', token)
        localStorage.setItem('admin_user', JSON.stringify({ username: account.username, name: account.name }))
        message.success(`欢迎回来，${account.name}！`)
        navigate('/')
      } else {
        message.error('账号或密码错误')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a6b3a 0%, #2d9b5a 50%, #4ecdc4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Card
        style={{
          width: 420,
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          padding: '20px 10px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏡</div>
          <Title level={3} style={{ margin: 0, color: '#1a6b3a' }}>乌东文旅平台</Title>
          <Text type="secondary">后台管理系统</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          size="large"
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入管理员账号' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="管理员账号" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" block loading={loading}
              style={{ background: '#1a6b3a', borderColor: '#1a6b3a', height: 44 }}>
              登 录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>
            测试账号：admin / admin123 &nbsp;|&nbsp; manager / 123456
          </div>
        </Form>
      </Card>
    </div>
  )
}
