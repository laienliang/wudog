import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/request';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await request.post('/admin/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/list');
    } catch (err) {
      setError(err.response?.data?.message || '登录失败');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 40, background: '#fff', borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>登录</h2>
      <form onSubmit={handleLogin}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="用户名" style={{ width: '100%', padding: 10, marginBottom: 16, border: '1px solid #ddd', borderRadius: 4 }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密码" style={{ width: '100%', padding: 10, marginBottom: 16, border: '1px solid #ddd', borderRadius: 4 }} />
        {error && <p style={{ color: '#e74c3c', marginBottom: 12, fontSize: 14 }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: 12, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16 }}>
          登录
        </button>
      </form>
    </div>
  );
}
