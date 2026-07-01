import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavoriteList, toggleFavorite } from '../utils/api';
import Header from './Header';

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await getFavoriteList();
      setFavorites(res.data || []);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfavorite = async (e, productId) => {
    e.stopPropagation();
    try {
      await toggleFavorite({ product_id: productId });
      setFavorites(items => items.filter(f => f.product_id !== productId));
    } catch {}
  };

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.container}>
        <h2 style={styles.title}>我的收藏</h2>

        {loading && (
          <div style={styles.loadingState}>
            <div style={styles.loadingSpinner} />
            <span>加载中...</span>
          </div>
        )}

        {!loading && favorites.length === 0 && (
          <div style={styles.emptyState}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, color: '#ccc' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p style={styles.emptyText}>暂无收藏商品</p>
            <button onClick={() => navigate('/list')} style={styles.primaryButton}>去逛逛</button>
          </div>
        )}

        {!loading && favorites.length > 0 && (
          <div style={styles.grid}>
            {favorites.map((fav, index) => {
              const product = fav.product;
              if (!product) return null;
              return (
                <div
                  key={fav.id}
                  onClick={() => navigate(`/detail/${product.id}`)}
                  style={{ ...styles.card, animationDelay: `${index * 50}ms` }}
                >
                  <div style={styles.imageWrapper}>
                    {product.images?.length > 0 ? (
                      <img src={product.images[0].image_url} alt={product.name} style={styles.cardImage} />
                    ) : (
                      <div style={styles.placeholderImage}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 32, height: 32, opacity: 0.3 }}>
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    <button
                      onClick={(e) => handleUnfavorite(e, product.id)}
                      style={styles.unfavBtn}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>

                  <div style={styles.cardBody}>
                    <h3 style={styles.cardName}>{product.name}</h3>
                    <span style={styles.cardPrice}>
                      {product.min_price != null ? `¥${product.min_price}` : '暂无价格'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '24px',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1a1a2e',
    margin: '0 0 24px',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 0',
    color: '#666',
    gap: 16,
  },
  loadingSpinner: {
    width: 32,
    height: 32,
    border: '3px solid #e8e8e8',
    borderTopColor: '#c9a96e',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '80px 0',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    margin: 0,
  },
  primaryButton: {
    padding: '10px 24px',
    background: '#c9a96e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 20,
  },
  card: {
    background: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    animation: 'fadeInUp 0.4s ease-out forwards',
    opacity: 0,
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  imageWrapper: {
    position: 'relative',
    paddingTop: '100%',
    background: '#f5f5f5',
  },
  cardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fafafa',
  },
  unfavBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.5)',
    color: '#c9a96e',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: '14px 16px',
  },
  cardName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1a1a2e',
    margin: '0 0 8px',
    lineHeight: 1.4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: 700,
    color: '#c9a96e',
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
