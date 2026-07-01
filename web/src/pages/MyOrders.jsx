import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getOrderList, requestCancelOrder, requestReturnOrder, revokeCancelOrder, createReview } from '../utils/api';
import Header from './Header';

const STATUS_MAP = {
  0: { text: '待处理', color: '#e6a23c', bg: '#fdf6ec' },
  1: { text: '已确认', color: '#409eff', bg: '#ecf5ff' },
  2: { text: '已发货', color: '#909399', bg: '#f4f4f5' },
  3: { text: '已完成', color: '#67c23a', bg: '#f0f9eb' },
  4: { text: '已取消', color: '#f56c6c', bg: '#fef0f0' },
};

export default function MyOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrderList({ userId: user.id });
      setOrders(res.data?.list || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!confirm('确定要申请取消该订单吗？管理员审批通过后将取消订单。')) return;
    setActionLoading(orderId);
    try {
      await requestCancelOrder(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, cancel_request: 1, cancel_type: 1 } : o));
    } catch {
      alert('操作失败');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeCancel = async (orderId) => {
    if (!confirm('确定要撤销取消申请吗？')) return;
    setActionLoading(orderId);
    try {
      await revokeCancelOrder(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, cancel_request: 0 } : o));
    } catch {
      alert('操作失败');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReturn = async (orderId) => {
    if (!confirm('确定要申请退货吗？管理员审批通过后将进行退货。')) return;
    setActionLoading(orderId);
    try {
      await requestReturnOrder(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, cancel_request: 1, cancel_type: 2 } : o));
    } catch {
      alert('操作失败');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewModal) return;
    setReviewSubmitting(true);
    try {
      const res = await createReview({
        product_id: reviewModal.product_id,
        order_id: reviewModal.id,
        rating: reviewRating,
        content: reviewContent.trim(),
      });
      if (res.code === 200) {
        alert('评价成功');
        setReviewModal(null);
        setReviewRating(5);
        setReviewContent('');
      } else {
        alert(res.message || '评价失败');
      }
    } catch {
      alert('评价失败');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.title}>我的订单</h2>

        {loading && (
          <div style={styles.loadingState}>
            <div style={styles.loadingSpinner} />
            <span>加载中...</span>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div style={styles.emptyState}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, color: '#ccc' }}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
            </svg>
            <p style={styles.emptyText}>暂无订单</p>
            <button onClick={() => navigate('/list')} style={styles.primaryButton}>去逛逛</button>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div style={styles.orderList}>
            {orders.map(order => {
              const st = STATUS_MAP[order.status] || STATUS_MAP[0];
              return (
                <div key={order.id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <span style={styles.orderNo}>订单号: {order.order_no}</span>
                    <span style={{ ...styles.statusBadge, color: st.color, background: st.bg }}>{st.text}</span>
                  </div>

                  <div style={styles.orderBody}>
                    <div style={styles.productInfo}>
                      <div style={styles.productImageWrap}>
                        {order.product_image ? (
                          <img src={order.product_image} alt={order.product_name} style={styles.productImage} />
                        ) : (
                          <div style={styles.placeholderImage}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 24, height: 24, opacity: 0.3 }}>
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div style={styles.productDetail}>
                        <p style={styles.productName}>{order.product_name}</p>
                        {order.spec_name && <p style={styles.specName}>规格: {order.spec_name}</p>}
                        <p style={styles.quantity}>x{order.quantity}</p>
                      </div>
                    </div>

                    <div style={styles.priceArea}>
                      <span style={styles.price}>¥{(order.price * order.quantity).toFixed(2)}</span>
                    </div>
                  </div>

                  <div style={styles.orderFooter}>
                    <div style={styles.receiverInfo}>
                      <span style={styles.receiverLabel}>收货人:</span>
                      <span>{order.receiver_name} {order.receiver_phone}</span>
                    </div>
                    <div style={styles.actions}>
                      {order.cancel_request === 1 && (
                        <>
                          <span style={styles.pendingTag}>{order.cancel_type === 2 ? '退货申请中' : '取消申请中'}</span>
                          <button
                            onClick={() => handleRevokeCancel(order.id)}
                            disabled={actionLoading === order.id}
                            style={styles.revokeBtn}
                          >
                            {actionLoading === order.id ? '处理中...' : (order.cancel_type === 2 ? '撤销退货' : '撤销取消')}
                          </button>
                        </>
                      )}
                      {(order.status === 0 || order.status === 1) && order.cancel_request === 0 && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={actionLoading === order.id}
                          style={styles.cancelBtn}
                        >
                          {actionLoading === order.id ? '处理中...' : '取消订单'}
                        </button>
                      )}
                      {order.status === 3 && order.cancel_request === 0 && (
                        <>
                          <button
                            onClick={() => handleReturn(order.id)}
                            disabled={actionLoading === order.id}
                            style={styles.returnBtn}
                          >
                            {actionLoading === order.id ? '处理中...' : '申请退货'}
                          </button>
                          <button
                            onClick={() => { setReviewModal(order); setReviewRating(5); setReviewContent(''); }}
                            style={styles.reviewBtn}
                          >
                            评价
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 评价弹窗 */}
        {reviewModal && (
          <div style={styles.modalOverlay} onClick={() => setReviewModal(null)}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>评价订单</h3>
              <p style={styles.modalProductName}>{reviewModal.product_name}</p>
              <div style={styles.starRow}>
                {[1,2,3,4,5].map(star => (
                  <span
                    key={star}
                    onClick={() => setReviewRating(star)}
                    style={{ cursor: 'pointer', color: star <= reviewRating ? '#fadb14' : '#ddd', fontSize: 28 }}
                  >&#9733;</span>
                ))}
              </div>
              <textarea
                value={reviewContent}
                onChange={e => setReviewContent(e.target.value)}
                placeholder="分享您的使用体验..."
                style={styles.reviewTextarea}
              />
              <div style={styles.modalActions}>
                <button onClick={() => setReviewModal(null)} style={styles.modalCancelBtn}>取消</button>
                <button
                  onClick={handleSubmitReview}
                  disabled={reviewSubmitting}
                  style={styles.modalSubmitBtn}
                >
                  {reviewSubmitting ? '提交中...' : '提交评价'}
                </button>
              </div>
            </div>
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
    maxWidth: 800,
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
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  orderCard: {
    background: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    borderBottom: '1px solid #f0f0f0',
    background: '#fafafa',
  },
  orderNo: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 12,
  },
  orderBody: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
  },
  productInfo: {
    display: 'flex',
    gap: 14,
    flex: 1,
  },
  productImageWrap: {
    width: 72,
    height: 72,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
    background: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fafafa',
  },
  productDetail: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1a1a2e',
    margin: '0 0 4px',
  },
  specName: {
    fontSize: 12,
    color: '#999',
    margin: '0 0 4px',
  },
  quantity: {
    fontSize: 13,
    color: '#666',
    margin: 0,
  },
  priceArea: {
    textAlign: 'right',
  },
  price: {
    fontSize: 18,
    fontWeight: 700,
    color: '#c9a96e',
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    borderTop: '1px solid #f0f0f0',
    background: '#fafafa',
  },
  receiverInfo: {
    fontSize: 12,
    color: '#999',
  },
  receiverLabel: {
    marginRight: 4,
  },
  actions: {
    display: 'flex',
    gap: 8,
  },
  cancelBtn: {
    padding: '6px 16px',
    background: '#fff',
    color: '#f56c6c',
    border: '1px solid #f56c6c',
    borderRadius: 6,
    fontSize: 13,
    cursor: 'pointer',
  },
  pendingTag: {
    fontSize: 12,
    color: '#e6a23c',
    background: '#fdf6ec',
    padding: '3px 10px',
    borderRadius: 12,
    fontWeight: 500,
  },
  revokeBtn: {
    padding: '6px 16px',
    background: '#fff',
    color: '#909399',
    border: '1px solid #dcdfe6',
    borderRadius: 6,
    fontSize: 13,
    cursor: 'pointer',
  },
  returnBtn: {
    padding: '6px 16px',
    background: '#fff',
    color: '#e6a23c',
    border: '1px solid #e6a23c',
    borderRadius: 6,
    fontSize: 13,
    cursor: 'pointer',
  },
  reviewBtn: {
    padding: '6px 16px',
    background: '#c9a96e',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 13,
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: '#fff', borderRadius: 12, padding: '28px 32px', width: 420, maxWidth: '90%',
  },
  modalTitle: { fontSize: 18, fontWeight: 600, margin: '0 0 8px', color: '#1a1a2e' },
  modalProductName: { fontSize: 14, color: '#666', margin: '0 0 16px' },
  starRow: { display: 'flex', gap: 6, marginBottom: 16 },
  reviewTextarea: {
    width: '100%', minHeight: 100, padding: '10px 14px', border: '1px solid #ddd',
    borderRadius: 8, fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box',
  },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 },
  modalCancelBtn: {
    padding: '8px 20px', background: '#fff', border: '1px solid #ddd', borderRadius: 6,
    fontSize: 14, cursor: 'pointer',
  },
  modalSubmitBtn: {
    padding: '8px 20px', background: '#c9a96e', color: '#fff', border: 'none',
    borderRadius: 6, fontSize: 14, cursor: 'pointer',
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
