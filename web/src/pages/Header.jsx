import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/list');
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <Link to="/list" style={styles.logo}>
          <span style={styles.logoIcon}>W</span>
          <span style={styles.logoText}>乌东非遗商品</span>
        </Link>

        <nav style={styles.nav}>
          <Link to="/list" style={styles.navLink}>商品列表</Link>
          <Link to="/cart" style={styles.navLink}>购物车</Link>
          <Link to="/favorites" style={styles.navLink}>我的收藏</Link>
        </nav>

        <div style={styles.authArea}>
          {isLoggedIn ? (
            <div style={styles.userDropdown} ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} style={styles.userBtn}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="" style={styles.userAvatar} />
                ) : (
                  <div style={styles.userAvatarPlaceholder}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
                <span style={styles.username}>{user?.nickname || user?.username}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {dropdownOpen && (
                <div style={styles.dropdownMenu}>
                  <button onClick={() => { setDropdownOpen(false); navigate('/profile'); }} style={styles.dropdownItem}>个人中心</button>
                  <button onClick={() => { setDropdownOpen(false); navigate('/my-orders'); }} style={styles.dropdownItem}>我的订单</button>
                  <button onClick={() => { setDropdownOpen(false); navigate('/my-reviews'); }} style={styles.dropdownItem}>我的评价</button>
                  <button onClick={() => { setDropdownOpen(false); navigate('/address'); }} style={styles.dropdownItem}>地址管理</button>
                  <div style={styles.dropdownDivider} />
                  <button onClick={handleLogout} style={{ ...styles.dropdownItem, color: '#ff4d4f' }}>退出登录</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={styles.loginBtn}>登录</Link>
          )}
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: '#fff',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: 1200,
    margin: '0 auto',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    color: '#fff',
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: '#c9a96e',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 700,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 600,
  },
  nav: {
    display: 'flex',
    gap: 32,
  },
  navLink: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  authArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  username: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  userDropdown: {
    position: 'relative',
  },
  userBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 12px 4px 4px',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 20,
    fontSize: 14,
    cursor: 'pointer',
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userAvatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    minWidth: 140,
    overflow: 'hidden',
    zIndex: 200,
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '10px 16px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: 14,
    color: '#333',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  dropdownDivider: {
    height: 1,
    background: '#f0f0f0',
  },
  loginBtn: {
    padding: '6px 16px',
    background: '#c9a96e',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    textDecoration: 'none',
    cursor: 'pointer',
  },
};
