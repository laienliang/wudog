import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/request';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await request.post('/public/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/module5/list');
    } catch (err) {
      setError(err.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ width: 380, background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8 }}>登录</h2>
        <p style={{ textAlign: 'center', color: '#999', fontSize: 13, marginBottom: 28 }}>乌东文旅 · 社区分享</p>

        {error && (
          <div style={{ padding: '8px 14px', background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 6, color: '#ff4d4f', fontSize: 13, marginBottom: 16 }}>{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <input
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, marginBottom: 14, outline: 'none', boxSizing: 'border-box' }}
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, marginBottom: 24, outline: 'none', boxSizing: 'border-box' }}
          />
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', background: loading ? '#ccc' : '#1677ff', color: '#fff', border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 16 }}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#ccc', fontSize: 12, marginTop: 20 }}>
          测试账号：admin / admin123
        </p>
      </div>
    </div>
  );
}
