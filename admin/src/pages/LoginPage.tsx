import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function LoginPage() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('Admin@123456')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const result = await api.login(username, password)
      localStorage.setItem('admin_token', result.token)
      navigate('/dashboard')
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>乌东文旅 · 管理后台</h2>
        {error && <div style={{ color: 'var(--error)', marginBottom: 16, fontSize: 14 }}>{error}</div>}
        <div className="form-group">
          <label>用户名</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="请输入用户名" />
        </div>
        <div className="form-group">
          <label>密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', height: 44, fontSize: 15 }} onClick={handleLogin}>
          登 录
        </button>
      </div>
    </div>
  )
}
