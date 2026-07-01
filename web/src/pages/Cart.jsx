import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartList, updateCartItem, deleteCartItem } from '../utils/api';
import Header from './Header';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await getCartList();
      setCartItems(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error('加载购物车失败:', e);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartItem(id, { quantity });
      setCartItems(items => items.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定删除该商品？')) return;
    try {
      await deleteCartItem(id);
      setCartItems(items => items.filter(item => item.id !== id));
    } catch {}
  };

  const handleOrder = (item) => {
    navigate('/order-confirm', {
      state: {
        items: [{
          cart_id: item.id,
          product_id: item.product_id,
          product: item.product,
          sku_id: item.sku_id,
          sku: item.sku,
          quantity: item.quantity,
          image_url: item.product?.images?.[0]?.image_url,
        }],
      },
    });
  };

  const getPrice = (item) => {
    if (!item) return 0;
    const price = item.sku?.price || item.product?.price || 0;
    return Number(price) || 0;
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + getPrice(item) * (item?.quantity || 1);
  }, 0);

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.container}>
        <h2 style={styles.title}>购物车</h2>

        {loading && (
          <div style={styles.loadingState}>
            <div style={styles.loadingSpinner} />
            <span>加载中...</span>
          </div>
        )}

        {!loading && cartItems.length === 0 && (
          <div style={styles.emptyState}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, color: '#ccc' }}>
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <p style={styles.emptyText}>购物车是空的</p>
            <button onClick={() => navigate('/list')} style={styles.primaryButton}>去逛逛</button>
          </div>
        )}

        {!loading && cartItems.length > 0 && (
          <>
            <div style={styles.cartList}>
              {cartItems.filter(item => item && item.id).map(item => (
                <div key={item.id} style={styles.cartItem}>
                  <div style={styles.itemImage}>
                    {item.product?.images?.length > 0 ? (
                      <img src={item.product.images[0].image_url} alt="" style={styles.itemImg} />
                    ) : (
                      <div style={styles.placeholder}>暂无图片</div>
                    )}
                  </div>

                  <div style={styles.itemInfo}>
                    <h4 style={styles.itemName} onClick={() => item.product_id && navigate(`/detail/${item.product_id}`)}>
                      {item.product?.name || '商品已下架'}
                    </h4>
                    <p style={styles.itemSpec}>{item.sku?.spec_name || '默认规格'}</p>
                    <p style={styles.itemPrice}>¥{getPrice(item).toFixed(2)}</p>
                  </div>

                  <div style={styles.itemActions}>
                    <div style={styles.quantityControl}>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        style={styles.qtyBtn}
                        disabled={item.quantity <= 1}
                      >-</button>
                      <span style={styles.qtyValue}>{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        style={styles.qtyBtn}
                      >+</button>
                    </div>

                    <div style={styles.itemRight}>
                      <span style={styles.itemTotal}>¥{(getPrice(item) * (item.quantity || 1)).toFixed(2)}</span>
                      <div style={styles.itemBtns}>
                        <button onClick={() => handleOrder(item)} style={styles.orderBtn}>下单</button>
                        <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>删除</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.summary}>
              <span style={styles.totalLabel}>合计：</span>
              <span style={styles.totalPrice}>¥{totalPrice.toFixed(2)}</span>
            </div>
          </>
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
    maxWidth: 900,
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
  cartList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  cartItem: {
    display: 'flex',
    gap: 16,
    padding: 20,
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
    background: '#f5f5f5',
  },
  itemImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    color: '#999',
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1a1a2e',
    margin: '0 0 4px',
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemSpec: {
    fontSize: 13,
    color: '#999',
    margin: '0 0 4px',
  },
  itemPrice: {
    fontSize: 14,
    color: '#c9a96e',
    fontWeight: 600,
    margin: 0,
  },
  itemActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    border: '1px solid #e8e8e8',
    borderRadius: 6,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 32,
    height: 32,
    border: 'none',
    background: '#fafafa',
    fontSize: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    width: 40,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 500,
  },
  itemRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 6,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 700,
    color: '#c9a96e',
  },
  itemBtns: {
    display: 'flex',
    gap: 8,
  },
  orderBtn: {
    padding: '4px 12px',
    background: '#c9a96e',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    fontSize: 12,
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '4px 12px',
    background: 'none',
    color: '#999',
    border: '1px solid #e8e8e8',
    borderRadius: 4,
    fontSize: 12,
    cursor: 'pointer',
  },
  summary: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    padding: '20px 0',
    marginTop: 12,
    borderTop: '1px solid #e8e8e8',
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 700,
    color: '#c9a96e',
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
