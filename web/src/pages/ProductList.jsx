import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductList, getCategoryList } from '../utils/api';
import Header from './Header';

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const pageSize = 12;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, categoryId]);

  const loadCategories = async () => {
    try {
      const res = await getCategoryList();
      setCategories(res.data || []);
    } catch {}
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = { page, pageSize };
      if (keyword) params.keyword = keyword;
      if (categoryId) params.categoryId = categoryId;
      const res = await getProductList(params);
      setProducts(res.data?.list || []);
      setTotal(res.data?.total || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadProducts();
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.banner}>
        <h1 style={styles.bannerTitle}>乌东非遗商品</h1>
        <p style={styles.bannerSubtitle}>探索传统工艺，发现文化之美</p>
      </div>

      {/* 搜索筛选栏 */}
      <div style={styles.toolbar}>
        <div style={styles.searchGroup}>
          <div style={styles.searchInputWrapper}>
            <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="搜索商品名称..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              style={styles.searchInput}
            />
          </div>
          <select
            value={categoryId}
            onChange={e => { setCategoryId(e.target.value); setPage(1); }}
            style={styles.select}
          >
            <option value="">全部分类</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button onClick={handleSearch} style={styles.searchButton}>
            搜索
          </button>
        </div>
        <div style={styles.resultCount}>
          共 {total} 件商品
        </div>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div style={styles.loadingState}>
          <div style={styles.loadingSpinner} />
          <span>加载中...</span>
        </div>
      )}

      {/* 空状态 */}
      {!loading && products.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48 }}>
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p style={styles.emptyText}>暂无商品数据</p>
        </div>
      )}

      {/* 商品列表 */}
      {!loading && products.length > 0 && (
        <div style={styles.productGrid}>
          {products.map((product, index) => (
            <div
              key={product.id}
              onClick={() => navigate(`/detail/${product.id}`)}
              style={{ ...styles.productCard, animationDelay: `${index * 50}ms` }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
            >
              <div style={styles.imageWrapper}>
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0].image_url}
                    alt={product.name}
                    style={styles.productImage}
                  />
                ) : (
                  <div style={styles.placeholderImage}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 32, height: 32, opacity: 0.3 }}>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
                {product.sold_out && (
                  <div style={styles.soldOutBadge}>售罄</div>
                )}
                {product.status === 0 && (
                  <div style={styles.offSaleBadge}>已下架</div>
                )}
              </div>

              <div style={styles.cardBody}>
                <div style={styles.cardMeta}>
                  {product.category && (
                    <span style={styles.categoryTag}>{product.category.name}</span>
                  )}
                </div>

                <h3 style={styles.productName}>{product.name}</h3>

                <div style={styles.priceRow}>
                  <span style={styles.price}>
                    {product.min_price != null ? `¥${product.min_price}` : '暂无价格'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            style={{ ...styles.pageButton, ...(page <= 1 ? styles.pageButtonDisabled : {}) }}
          >
            上一页
          </button>
          <div style={styles.pageNumbers}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  style={{
                    ...styles.pageNumber,
                    ...(pageNum === page ? styles.pageNumberActive : {}),
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            style={{ ...styles.pageButton, ...(page >= totalPages ? styles.pageButtonDisabled : {}) }}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  banner: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: '#fff',
    padding: '40px 24px',
    textAlign: 'center',
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    letterSpacing: '-0.02em',
  },
  bannerSubtitle: {
    fontSize: 15,
    margin: '8px 0 0',
    opacity: 0.7,
    fontWeight: 400,
  },
  toolbar: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    borderBottom: '1px solid #e8e8e8',
  },
  searchGroup: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  searchInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    width: 18,
    height: 18,
    color: '#999',
    pointerEvents: 'none',
  },
  searchInput: {
    padding: '10px 12px 10px 38px',
    border: '1px solid #d9d9d9',
    borderRadius: 8,
    fontSize: 14,
    width: 280,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    padding: '10px 32px 10px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: 8,
    fontSize: 14,
    background: '#fff',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  },
  searchButton: {
    padding: '10px 20px',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  resultCount: {
    fontSize: 13,
    color: '#666',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
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
    justifyContent: 'center',
    padding: '100px 24px',
    background: '#fff',
    margin: '24px auto',
    maxWidth: 1200,
    borderRadius: 12,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    color: '#ccc',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    margin: '0 0 20px',
  },
  emptyButton: {
    padding: '10px 24px',
    background: '#c9a96e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  productGrid: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 20,
  },
  productCard: {
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    animation: 'fadeInUp 0.4s ease-out forwards',
    opacity: 0,
  },
  imageWrapper: {
    position: 'relative',
    paddingTop: '100%',
    background: '#f5f5f5',
    overflow: 'hidden',
  },
  productImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
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
  soldOutBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: '4px 10px',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 4,
  },
  offSaleBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    padding: '4px 10px',
    background: '#ff4d4f',
    color: '#fff',
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 4,
  },
  cardBody: {
    padding: '16px',
  },
  cardMeta: {
    marginBottom: 8,
  },
  categoryTag: {
    display: 'inline-block',
    padding: '2px 8px',
    background: '#f0f0f0',
    color: '#666',
    fontSize: 12,
    borderRadius: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1a1a2e',
    margin: '0 0 8px',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 700,
    color: '#c9a96e',
  },
  pagination: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  pageButton: {
    padding: '8px 16px',
    background: '#fff',
    border: '1px solid #d9d9d9',
    borderRadius: 6,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pageButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  pageNumbers: {
    display: 'flex',
    gap: 4,
  },
  pageNumber: {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fff',
    border: '1px solid #d9d9d9',
    borderRadius: 6,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pageNumberActive: {
    background: '#1a1a2e',
    borderColor: '#1a1a2e',
    color: '#fff',
  },
};

// 添加CSS动画
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
