import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '0 24px', height: 56, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      <Link to="/" style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>乌东文旅</Link>
      <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Link to="/module5/list" style={{ color: '#fff' }}>首页</Link>
        <Link to="/module1" style={{ color: '#fff' }}>非遗商品</Link>
        <Link to="/module2" style={{ color: '#fff' }}>餐饮美食</Link>
        <Link to="/module3" style={{ color: '#fff' }}>民宿预订</Link>
        <Link to="/module4" style={{ color: '#fff' }}>景区出行</Link>
        <Link to="/module5/list" style={{ color: '#fff' }}>社区</Link>
        {token ? (
          <button onClick={handleLogout} style={{
            background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', padding: '4px 16px', borderRadius: 4, cursor: 'pointer'
          }}>退出</button>
        ) : (
          <Link to="/login" style={{ color: '#fff' }}>登录</Link>
        )}
      </nav>
    </header>
  );
}
