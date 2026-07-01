import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getOrderList, getMyReviews, createReview, markReviewsRead } from '../utils/api';
import Header from './Header';

export default function MyReviews() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadData();
    const timer = setInterval(loadData, 5000);
    return () => clearInterval(timer);
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [orderRes, reviewRes] = await Promise.all([
        getOrderList({ userId: user.id }),
        getMyReviews(),
      ]);
      const orders = (orderRes.data?.list || []).filter(o => o.status === 3);
      const reviews = reviewRes.data?.list || [];
      const reviewMap = new Map(reviews.map(r => [r.order_id, r]));

      const merged = orders.map(order => ({
        ...order,
        review: reviewMap.get(order.id) || null,
      }));

      // 已评价的放前面，未评价的放后面
      merged.sort((a, b) => {
        if (a.review && !b.review) return -1;
        if (!a.review && b.review) return 1;
        return 0;
      });

      setItems(merged);
      markReviewsRead().catch(() => {});
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#fadb14' : '#ddd', fontSize: 16 }}>&#9733;</span>
    ));
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
        loadData();
      } else {
        alert(res.message || '评价失败');
      }
    } catch { alert('评价失败'); }
    finally { setReviewSubmitting(false); }
  };

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.title}>我的评价</h2>
        {loading && <div style={styles.loading}><div style={styles.spinner} /><span>加载中...</span></div>}
        {!loading && items.length === 0 && (
          <div style={styles.empty}>
            <p style={styles.emptyText}>暂无已完成的订单</p>
            <button onClick={() => navigate('/list')} style={styles.primaryBtn}>去逛逛</button>
          </div>
        )}
        {!loading && items.length > 0 && (
          <div style={styles.list}>
            {items.map(item => (
              <div key={item.id} style={styles.card}>
                <div style={styles.orderInfo}>
                  <span style={styles.orderNo}>订单号: {item.order_no}</span>
                  <span style={styles.time}>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <div style={styles.productRow}>
                  <div style={styles.productDetail}>
                    <p style={styles.productName}>{item.product_name}</p>
                    {item.spec_name && <p style={styles.specName}>规格: {item.spec_name}</p>}
                    <p style={styles.price}>¥{(item.price * item.quantity).toFixed(2)} × {item.quantity}</p>
                  </div>
                  {item.review ? (
                    <div style={styles.reviewArea}>
                      <div style={styles.cardHeader}>
                        <span style={styles.rating}>{renderStars(item.review.rating)}</span>
                        <span style={styles.reviewTime}>{new Date(item.review.created_at).toLocaleDateString()}</span>
                      </div>
                      <p style={styles.content}>{item.review.content || '用户未填写评价内容'}</p>
                      {item.review.reply && (
                        <div style={styles.reply}>
                          <span style={styles.replyLabel}>商家回复：</span>
                          <span>{item.review.reply}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={styles.unreviewedArea}>
                      <span style={styles.unreviewedTag}>待评价</span>
                      <button
                        onClick={() => { setReviewModal(item); setReviewRating(5); setReviewContent(''); }}
                        style={styles.reviewBtn}
                      >
                        去评价
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  container: { maxWidth: 800, margin: '0 auto', padding: '24px' },
  title: { fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: '0 0 24px' },
  loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', color: '#666', gap: 16 },
  spinner: { width: 32, height: 32, border: '3px solid #e8e8e8', borderTopColor: '#c9a96e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 16 },
  emptyText: { fontSize: 16, color: '#666', margin: 0 },
  primaryBtn: { padding: '10px 24px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { background: '#fff', borderRadius: 10, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  orderInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' },
  orderNo: { fontSize: 13, color: '#666' },
  time: { fontSize: 12, color: '#999' },
  productRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 },
  productDetail: { flex: 1 },
  productName: { fontSize: 15, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px' },
  specName: { fontSize: 12, color: '#999', margin: '0 0 4px' },
  price: { fontSize: 14, color: '#c9a96e', fontWeight: 600, margin: 0 },
  reviewArea: { flex: 1 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  rating: { display: 'flex', gap: 2 },
  reviewTime: { fontSize: 12, color: '#999' },
  content: { fontSize: 14, color: '#333', lineHeight: 1.6, margin: 0 },
  reply: { marginTop: 10, padding: '10px 14px', background: '#f6f8fa', borderRadius: 6, fontSize: 13, color: '#555' },
  replyLabel: { fontWeight: 600, color: '#c9a96e', marginRight: 4 },
  unreviewedArea: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 },
  unreviewedTag: { fontSize: 12, color: '#e6a23c', background: '#fdf6ec', padding: '3px 10px', borderRadius: 12, fontWeight: 500 },
  reviewBtn: { padding: '6px 16px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { background: '#fff', borderRadius: 12, padding: '28px 32px', width: 420, maxWidth: '90%' },
  modalTitle: { fontSize: 18, fontWeight: 600, margin: '0 0 8px', color: '#1a1a2e' },
  modalProductName: { fontSize: 14, color: '#666', margin: '0 0 16px' },
  starRow: { display: 'flex', gap: 6, marginBottom: 16 },
  reviewTextarea: { width: '100%', minHeight: 100, padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 },
  modalCancelBtn: { padding: '8px 20px', background: '#fff', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, cursor: 'pointer' },
  modalSubmitBtn: { padding: '8px 20px', background: '#c9a96e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, cursor: 'pointer' },
};
