import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyReviews } from '../utils/api';
import Header from './Header';

export default function MyReviews() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadReviews();
  }, [user]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await getMyReviews();
      setReviews(res.data?.list || []);
    } catch { setReviews([]); }
    finally { setLoading(false); }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#fadb14' : '#ddd', fontSize: 16 }}>&#9733;</span>
    ));
  };

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.title}>我的评价</h2>
        {loading && <div style={styles.loading}><div style={styles.spinner} /><span>加载中...</span></div>}
        {!loading && reviews.length === 0 && (
          <div style={styles.empty}>
            <p style={styles.emptyText}>暂无评价</p>
            <button onClick={() => navigate('/list')} style={styles.primaryBtn}>去逛逛</button>
          </div>
        )}
        {!loading && reviews.length > 0 && (
          <div style={styles.list}>
            {reviews.map(review => (
              <div key={review.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.rating}>{renderStars(review.rating)}</span>
                  <span style={styles.time}>{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p style={styles.content}>{review.content || '用户未填写评价内容'}</p>
                {review.reply && (
                  <div style={styles.reply}>
                    <span style={styles.replyLabel}>商家回复：</span>
                    <span>{review.reply}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
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
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  rating: { display: 'flex', gap: 2 },
  time: { fontSize: 12, color: '#999' },
  content: { fontSize: 14, color: '#333', lineHeight: 1.6, margin: 0 },
  reply: { marginTop: 10, padding: '10px 14px', background: '#f6f8fa', borderRadius: 6, fontSize: 13, color: '#555' },
  replyLabel: { fontWeight: 600, color: '#c9a96e', marginRight: 4 },
};
