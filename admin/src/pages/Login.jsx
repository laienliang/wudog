import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { adminLogin } from '../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await adminLogin(values);
      localStorage.setItem('admin_token', res.data.token);
      message.success('登录成功');
      navigate('/products');
    } catch (err) {
      message.error(err.message || '用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* 背景装饰 */}
      <div style={styles.bgPattern} />

      <div style={styles.loginWrapper}>
        {/* 左侧品牌区域 */}
        <div style={styles.brandSection}>
          <div style={styles.brandContent}>
            <div style={styles.logoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 40, height: 40 }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h1 style={styles.brandTitle}>乌东文旅</h1>
            <p style={styles.brandSubtitle}>非遗商品管理后台</p>
            <div style={styles.brandFeatures}>
              <div style={styles.featureItem}>
                <div style={styles.featureDot} />
                <span>商品管理</span>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureDot} />
                <span>规格配置</span>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureDot} />
                <span>订单处理</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧登录表单 */}
        <div style={styles.formSection}>
          <div style={styles.formWrapper}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>欢迎回来</h2>
              <p style={styles.formSubtitle}>请登录您的管理员账号</p>
            </div>

            <Form onFinish={onFinish} autoComplete="off" size="large">
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#999' }} />}
                  placeholder="用户名"
                  style={styles.input}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#999' }} />}
                  placeholder="密码"
                  style={styles.input}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={styles.submitButton}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>

            <div style={styles.footer}>
              <div style={styles.hint}>
                <span style={styles.hintLabel}>默认账号</span>
                <code style={styles.hintCode}>admin</code>
                <span style={styles.hintDivider}>/</span>
                <code style={styles.hintCode}>admin123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },
  bgPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 25% 25%, #c9a96e10 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, #1a1a2e10 0%, transparent 50%)`,
    pointerEvents: 'none',
  },
  loginWrapper: {
    display: 'flex',
    width: 900,
    minHeight: 520,
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  brandSection: {
    flex: '0 0 400px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  brandContent: {
    position: 'relative',
    zIndex: 1,
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 16,
    background: 'rgba(201, 169, 110, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#c9a96e',
    marginBottom: 24,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 8px',
    letterSpacing: '-0.02em',
  },
  brandSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    margin: '0 0 32px',
  },
  brandFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#c9a96e',
  },
  formSection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 40px',
  },
  formWrapper: {
    width: '100%',
    maxWidth: 320,
  },
  formHeader: {
    marginBottom: 36,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#1a1a2e',
    margin: '0 0 8px',
  },
  formSubtitle: {
    fontSize: 14,
    color: '#666',
    margin: 0,
  },
  input: {
    borderRadius: 8,
  },
  submitButton: {
    height: 48,
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 500,
    background: '#c9a96e',
    borderColor: '#c9a96e',
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
    color: '#999',
  },
  hintLabel: {
    marginRight: 8,
  },
  hintCode: {
    padding: '2px 6px',
    background: '#f5f5f5',
    borderRadius: 4,
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666',
  },
  hintDivider: {
    margin: '0 4px',
    color: '#ccc',
  },
};
