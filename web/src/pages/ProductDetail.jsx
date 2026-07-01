import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetail, toggleFavorite, addCartItem, getFavoriteList, getProductReviews } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import ChatDrawer from '../components/ChatDrawer';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSku, setSelectedSku] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (isLoggedIn && product) {
      getFavoriteList().then(res => {
        const list = res.data || [];
        setFavorited(list.some(fav => fav.product_id === Number(id)));
      }).catch(() => {});
    } else {
      setFavorited(false);
    }
  }, [isLoggedIn]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const res = await getProductDetail(id);
      setProduct(res.data);
      if (res.data?.skus?.length > 0) {
        setSelectedSku(res.data.skus[0]);
      }
      if (isLoggedIn) {
        try {
          const favRes = await getFavoriteList();
          const list = favRes.data || [];
          setFavorited(list.some(fav => fav.product_id === Number(id)));
        } catch {}
      }
    } catch {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getProductReviews(id).then(res => setReviews(res.data?.list || [])).catch(() => {});
    }
  }, [id]);

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    try {
      const res = await toggleFavorite({ product_id: Number(id) });
      setFavorited(res.data?.favorited ?? !favorited);
    } catch {
      alert('操作失败');
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    const hasSku = product.skus?.length > 0;
    const sku = selectedSku || (hasSku ? product.skus[0] : null);
    setAddingToCart(true);
    try {
      await addCartItem({
        product_id: Number(id),
        sku_id: sku?.id || null,
        quantity: 1,
      });
      alert('已加入购物车');
    } catch {
      alert('加入购物车失败');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleOrder = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    const hasSku = product.skus?.length > 0;
    const sku = selectedSku || (hasSku ? product.skus[0] : null);
    navigate('/order-confirm', {
      state: {
        items: [{
          product_id: product.id,
          product: {
            ...product,
            images: product.images,
          },
          sku_id: sku?.id || null,
          sku: sku,
          quantity: 1,
        }],
      },
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingSpinner} />
        <span>加载中...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={styles.errorPage}>
        <div style={styles.errorIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p style={styles.errorText}>商品不存在或已删除</p>
        <button onClick={() => navigate('/list')} style={styles.primaryButton}>返回列表</button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Header />

      {/* 面包屑导航 */}
      <div style={styles.breadcrumb}>
        <button onClick={() => navigate('/list')} style={styles.breadcrumbLink}>商品列表</button>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span style={styles.breadcrumbCurrent}>{product.name}</span>
      </div>

      <div style={styles.mainContent}>
        {/* 图片区域 */}
        <div style={styles.imageSection}>
          <div style={styles.mainImageWrapper}>
            {product.images?.length > 0 ? (
              <img
                src={product.images[currentImage]?.image_url}
                alt={product.name}
                style={styles.mainImage}
              />
            ) : (
              <div style={styles.placeholderImage}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 64, height: 64, opacity: 0.2 }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
            {product.sold_out && (
              <div style={styles.soldOutOverlay}>已售罄</div>
            )}
          </div>

          {/* 缩略图 */}
          {product.images?.length > 1 && (
            <div style={styles.thumbnailRow}>
              {product.images.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => setCurrentImage(idx)}
                  style={{
                    ...styles.thumbnail,
                    ...(idx === currentImage ? styles.thumbnailActive : {}),
                  }}
                >
                  <img src={img.image_url} alt="" style={styles.thumbnailImage} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 商品信息 */}
        <div style={styles.infoSection}>
          <div style={styles.categoryBadge}>
            {product.category?.name || '未分类'}
          </div>

          <h1 style={styles.productTitle}>{product.name}</h1>

          <div style={styles.priceBlock}>
            <span style={styles.priceSymbol}>¥</span>
            <span style={styles.priceValue}>
              {selectedSku ? selectedSku.price : (product.min_price || '0.00')}
            </span>
            {selectedSku && (
              <span style={styles.priceUnit}>/ {selectedSku.spec_name}</span>
            )}
          </div>

          <div style={styles.stockLine}>
            库存: {selectedSku ? selectedSku.stock : (product.stock ?? '-')}
          </div>

          {!selectedSku && product.skus?.length > 0 && (
            <div style={styles.selectHint}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              请先选择规格
            </div>
          )}

          {product.description && (
            <p style={styles.description}>{product.description}</p>
          )}

          {/* SKU选择 */}
          {product.skus?.length > 0 && (
            <div style={styles.skuSection}>
              <div style={styles.sectionLabel}>规格选择</div>
              <div style={styles.skuList}>
                {product.skus.map(sku => (
                  <button
                    key={sku.id}
                    onClick={() => setSelectedSku(sku)}
                    style={{
                      ...styles.skuButton,
                      ...(selectedSku?.id === sku.id ? styles.skuButtonActive : {}),
                      ...(sku.stock === 0 ? styles.skuButtonDisabled : {}),
                    }}
                    disabled={sku.stock === 0}
                  >
                    <span style={styles.skuName}>{sku.spec_name}</span>
                    <span style={styles.skuStock}>
                      {sku.stock > 0 ? `库存 ${sku.stock}` : '售罄'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 售罄提示 */}
          {product.sold_out && (
            <div style={styles.soldOutNotice}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              该商品已售罄
            </div>
          )}

          {/* 操作按钮 */}
          <div style={styles.actionButtons}>
            <button
              onClick={handleFavorite}
              style={{
                ...styles.favoriteButton,
                ...(favorited ? { color: '#ff4d4f', borderColor: '#ff4d4f', background: '#fff1f0' } : {}),
              }}
            >
              <svg viewBox="0 0 24 24" fill={favorited ? '#ff4d4f' : 'none'} stroke={favorited ? '#ff4d4f' : 'currentColor'} strokeWidth="2" style={{ width: 18, height: 18 }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {favorited ? '已收藏' : '收藏'}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.sold_out}
              style={{
                ...styles.cartButton,
                ...(product.sold_out ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {addingToCart ? '加入中...' : '加入购物车'}
            </button>
            <button
              onClick={handleOrder}
              disabled={product.sold_out}
              style={{
                ...styles.orderButton,
                ...(product.sold_out ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              立即下单
            </button>
          </div>
        </div>
      </div>

      {/* 详情内容 */}
      <div style={styles.detailSection}>
        {product.craft_intro && (
          <div style={styles.detailCard}>
            <div style={styles.detailHeader}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20, color: '#c9a96e' }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <h3 style={styles.detailTitle}>工艺介绍</h3>
            </div>
            <p style={styles.detailContent}>{product.craft_intro}</p>
          </div>
        )}

        {product.artisan_info && (
          <div style={styles.detailCard}>
            <div style={styles.detailHeader}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20, color: '#c9a96e' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <h3 style={styles.detailTitle}>传承人信息</h3>
            </div>
            <p style={styles.detailContent}>{product.artisan_info}</p>
          </div>
        )}

        {/* 用户评价 */}
        {reviews.length > 0 && (
          <div style={styles.detailCard}>
            <div style={styles.detailHeader}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20, color: '#c9a96e' }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <h3 style={styles.detailTitle}>用户评价 ({reviews.length})</h3>
            </div>
            <div style={styles.reviewList}>
              {reviews.map(review => (
                <div key={review.id} style={styles.reviewItem}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewStars}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} style={{ color: i < review.rating ? '#fadb14' : '#ddd', fontSize: 14 }}>&#9733;</span>
                      ))}
                    </div>
                    <span style={styles.reviewTime}>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <p style={styles.reviewContent}>{review.content || '用户未填写评价内容'}</p>
                  {review.reply && (
                    <div style={styles.reviewReply}>
                      <span style={styles.replyLabel}>商家回复：</span>
                      <span>{review.reply}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 客服悬浮按钮 */}
      {isLoggedIn && (
        <button onClick={() => setChatOpen(true)} style={styles.chatFab}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  loadingPage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: 16,
    color: '#666',
  },
  loadingSpinner: {
    width: 32,
    height: 32,
    border: '3px solid #e8e8e8',
    borderTopColor: '#c9a96e',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  errorPage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: 16,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: '#fff5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ff4d4f',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    margin: 0,
  },
  breadcrumb: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#666',
  },
  breadcrumbLink: {
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    padding: 0,
    fontSize: 13,
  },
  breadcrumbSeparator: {
    color: '#ccc',
  },
  breadcrumbCurrent: {
    color: '#1a1a2e',
    fontWeight: 500,
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
  mainContent: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px 40px',
    display: 'flex',
    gap: 48,
  },
  imageSection: {
    flex: '0 0 480px',
  },
  mainImageWrapper: {
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  mainImage: {
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
  soldOutOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    fontSize: 24,
    fontWeight: 600,
  },
  thumbnailRow: {
    display: 'flex',
    gap: 8,
    marginTop: 12,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 8,
    overflow: 'hidden',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'border-color 0.2s',
  },
  thumbnailActive: {
    borderColor: '#c9a96e',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  infoSection: {
    flex: 1,
    paddingTop: 8,
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    background: '#f0f0f0',
    color: '#666',
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 4,
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#1a1a2e',
    margin: '0 0 20px',
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  priceBlock: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 24,
    padding: '16px 20px',
    background: '#fefcf8',
    borderRadius: 8,
    border: '1px solid #f0e6d3',
  },
  stockLine: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
    padding: '0 20px',
  },
  priceSymbol: {
    fontSize: 18,
    fontWeight: 600,
    color: '#c9a96e',
  },
  priceValue: {
    fontSize: 36,
    fontWeight: 700,
    color: '#c9a96e',
    lineHeight: 1,
  },
  priceUnit: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 1.7,
    margin: '0 0 24px',
  },
  selectHint: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 14px',
    background: '#fff7e6',
    border: '1px solid #ffe7ba',
    borderRadius: 6,
    color: '#d48806',
    fontSize: 14,
    marginBottom: 20,
  },
  skuSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#333',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  skuList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },
  skuButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 20px',
    background: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: 100,
  },
  skuButtonActive: {
    borderColor: '#c9a96e',
    background: '#fefcf8',
    boxShadow: '0 0 0 1px #c9a96e',
  },
  skuButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  skuName: {
    fontSize: 14,
    fontWeight: 500,
    color: '#333',
    marginBottom: 4,
  },
  skuStock: {
    fontSize: 12,
    color: '#999',
  },
  soldOutNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 16px',
    background: '#fff7e6',
    border: '1px solid #ffe7ba',
    borderRadius: 8,
    color: '#d48806',
    fontSize: 14,
    marginBottom: 24,
  },
  actionButtons: {
    display: 'flex',
    gap: 12,
    marginTop: 32,
  },
  favoriteButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 28px',
    background: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#333',
  },
  cartButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 28px',
    background: '#c9a96e',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#fff',
  },
  orderButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 28px',
    background: '#1a1a2e',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#fff',
  },
  detailSection: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px 48px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  detailCard: {
    background: '#fff',
    borderRadius: 12,
    padding: 28,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: '1px solid #f0f0f0',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1a1a2e',
    margin: 0,
  },
  detailContent: {
    fontSize: 15,
    color: '#555',
    lineHeight: 1.8,
    margin: 0,
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  reviewItem: {
    padding: '14px 0',
    borderBottom: '1px solid #f5f5f5',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewStars: {
    display: 'flex',
    gap: 2,
  },
  reviewTime: {
    fontSize: 12,
    color: '#999',
  },
  reviewContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 1.6,
    margin: '0 0 8px',
  },
  reviewReply: {
    padding: '8px 12px',
    background: '#f6f8fa',
    borderRadius: 6,
    fontSize: 13,
    color: '#555',
  },
  replyLabel: {
    fontWeight: 600,
    color: '#c9a96e',
    marginRight: 4,
  },
  chatFab: {
    position: 'fixed',
    bottom: 32,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: '#c9a96e',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 16px rgba(201,169,110,0.4)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    transition: 'transform 0.2s',
  },
};

// 添加CSS动画
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
