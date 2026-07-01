import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin, userRegister } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('两次密码不一致');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await userLogin({ username, password });
        login(res.data.token, res.data.user);
      } else {
        const res = await userRegister({ username, password, nickname: nickname || username });
        login(res.data.token, res.data.user);
      }
      navigate('/list');
    } catch (err) {
      setError(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? '用户登录' : '用户注册'}</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>用户名</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="请输入用户名"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="请输入密码"
              style={styles.input}
            />
          </div>

          {!isLogin && (
            <>
              <div style={styles.field}>
                <label style={styles.label}>确认密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>昵称（可选）</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="请输入昵称"
                  style={styles.input}
                />
              </div>
            </>
          )}

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>
        </form>

        <div style={styles.switch}>
          {isLogin ? '还没有账号？' : '已有账号？'}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={styles.switchBtn}>
            {isLogin ? '去注册' : '去登录'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  card: {
    width: 400,
    background: '#fff',
    borderRadius: 12,
    padding: '40px 36px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1a1a2e',
    textAlign: 'center',
    margin: '0 0 32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: '#333',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  error: {
    padding: '10px 12px',
    background: '#fff2f0',
    border: '1px solid #ffccc7',
    borderRadius: 6,
    color: '#ff4d4f',
    fontSize: 13,
  },
  submitBtn: {
    padding: '12px 0',
    background: '#c9a96e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
    transition: 'opacity 0.2s',
  },
  switch: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: '#c9a96e',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    marginLeft: 4,
  },
};
