import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import request from '../../utils/request';

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const token = localStorage.getItem('token');

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await request.get(`/api/travel-note/detail/${id}`);
      setDetail(res.data);
    } catch {
      setDetail(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetail(); window.scrollTo(0, 0); }, [id]);

  const handleLike = async () => {
    if (!token) { navigate('/module5/login'); return; }
    try {
      const res = await request.post('/api/like/toggle', { target_type: 'note', target_id: detail.id });
      setDetail({ ...detail, liked: res.data.liked, like_count: detail.like_count + (res.data.liked ? 1 : -1) });
    } catch { /* */ }
  };

  const handleFavorite = async () => {
    if (!token) { navigate('/module5/login'); return; }
    try {
      const res = await request.post('/api/favorite/toggle', { note_id: detail.id });
      setDetail({ ...detail, favorited: res.data.favorited, favorite_count: detail.favorite_count + (res.data.favorited ? 1 : -1) });
    } catch { /* */ }
  };

  const handleFollow = async () => {
    if (!token) { navigate('/module5/login'); return; }
    try {
      await request.post('/api/follow/toggle', { followed_id: detail.user_id });
      setDetail({ ...detail, followed: !detail.followed });
    } catch { /* */ }
  };

  const handleReport = async () => {
    if (!token) { navigate('/module5/login'); return; }
    if (!reportReason.trim()) return;
    try {
      await request.post('/api/report/create', { target_type: 'note', target_id: detail.id, reason: reportReason });
      alert('举报已提交，感谢您的反馈');
      setShowReport(false);
      setReportReason('');
    } catch (e) {
      alert(e.response?.data?.message || '举报失败');
    }
  };

  const handleComment = async () => {
    if (!token) { navigate('/module5/login'); return; }
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await request.post('/api/comment/create', { note_id: detail.id, content: commentText });
      setCommentText('');
      fetchDetail();
    } catch { /* */ } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: 60 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #eee', borderTopColor: '#1677ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
      </div>
    );
  }

  if (!detail) {
    return <div style={{ textAlign: 'center', padding: 80, color: '#999' }}>游记不存在或已删除</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {detail.images?.length > 0 && (
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 24, background: '#000' }}>
          <img src={detail.images[currentImage]} alt="" style={{ width: '100%', height: 420, objectFit: 'contain' }} />
          {detail.images.length > 1 && (
            <>
              <button onClick={() => setCurrentImage((currentImage - 1 + detail.images.length) % detail.images.length)}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: '#fff', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18 }}>‹</button>
              <button onClick={() => setCurrentImage((currentImage + 1) % detail.images.length)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: '#fff', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18 }}>›</button>
              <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                {detail.images.map((_, i) => (
                  <span key={i} onClick={() => setCurrentImage(i)} style={{
                    width: 8, height: 8, borderRadius: '50%', background: i === currentImage ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer',
                  }} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {detail.video_url && (
        <div style={{ marginBottom: 24 }}>
          <video src={detail.video_url} controls style={{ width: '100%', borderRadius: 12, maxHeight: 450 }} />
        </div>
      )}

      <h1 style={{ fontSize: 28, marginBottom: 8 }}>{detail.title}</h1>

      {detail.location && (
        <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>📍 {detail.location}</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
        <div>
          <Link to={`/module5/user/${detail.user_id}`} style={{ fontWeight: 500, color: '#333' }}>
            {detail.author_nickname || '匿名用户'}
          </Link>
          <div style={{ fontSize: 12, color: '#999' }}>{new Date(detail.created_at).toLocaleString('zh-CN')} · {detail.view_count || 0} 浏览</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={handleFollow}
            style={{
              padding: '6px 18px', borderRadius: 18, border: detail.followed ? '1px solid #1677ff' : '1px solid #1677ff',
              background: detail.followed ? '#1677ff' : '#fff', color: detail.followed ? '#fff' : '#1677ff',
              cursor: 'pointer', fontSize: 13,
            }}>
            {detail.followed ? '已关注' : '+ 关注'}
          </button>
          <button onClick={handleLike}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 18px', borderRadius: 18, border: '1px solid #ff4d4f', background: detail.liked ? '#fff0f0' : '#fff', cursor: 'pointer', fontSize: 13 }}>
            <span style={{ color: detail.liked ? '#ff4d4f' : '#999', fontSize: 18 }}>{detail.liked ? '❤️' : '🤍'}</span>
            {detail.like_count || 0}
          </button>
          <button onClick={handleFavorite}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 18px', borderRadius: 18, border: '1px solid #faad14', background: detail.favorited ? '#fffbe6' : '#fff', cursor: 'pointer', fontSize: 13 }}>
            <span style={{ color: detail.favorited ? '#faad14' : '#999', fontSize: 18 }}>{detail.favorited ? '⭐' : '☆'}</span>
            {detail.favorite_count || 0}
          </button>
        </div>
      </div>

      <div style={{ lineHeight: 2, fontSize: 16, marginBottom: 32 }}
        dangerouslySetInnerHTML={{ __html: detail.content.replace(/\n/g, '<br/>') }} />

      {detail.topic_name && (
        <Link to={`/module5/topic/${detail.topic_id}`} style={{ display: 'inline-block', padding: '4px 14px', background: '#f0f5ff', color: '#1677ff', borderRadius: 12, fontSize: 13, marginBottom: 32, marginRight: 12 }}>
          #{detail.topic_name}
        </Link>
      )}

      <span onClick={() => setShowReport(!showReport)}
        style={{ display: 'inline-block', padding: '4px 14px', background: '#fff1f0', color: '#ff4d4f', borderRadius: 12, fontSize: 13, cursor: 'pointer', marginBottom: 32 }}>
        ⚑ 举报
      </span>
      {showReport && (
        <div style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
          <input placeholder="举报原因..." value={reportReason} onChange={(e) => setReportReason(e.target.value)}
            style={{ flex: 1, padding: '8px 14px', border: '1px solid #ff4d4f', borderRadius: 8, outline: 'none', fontSize: 13 }} />
          <button onClick={handleReport}
            style={{ padding: '8px 16px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>提交举报</button>
        </div>
      )}

      <div style={{ borderTop: '1px solid #eee', paddingTop: 24 }}>
        <h3 style={{ marginBottom: 16 }}>评论（{detail.comments?.length || 0}）</h3>

        {detail.comments?.map((c) => (
          <div key={c.id} style={{ padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 500, fontSize: 14 }}>{c.author_nickname || '匿名'}</span>
              <span style={{ fontSize: 12, color: '#bbb' }}>{new Date(c.created_at).toLocaleString('zh-CN')}</span>
            </div>
            <div style={{ fontSize: 14, color: '#444' }}>{c.content}</div>
            {c.replies?.length > 0 && (
              <div style={{ marginTop: 8, padding: '8px 12px', background: '#f9f9f9', borderRadius: 8 }}>
                {c.replies.map((r) => (
                  <div key={r.id} style={{ marginBottom: 4, fontSize: 13 }}>
                    <span style={{ color: '#1677ff' }}>{r.author_nickname || '匿名'}</span>：{r.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {detail.comments?.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#ccc' }}>暂无评论，来写第一条吧</div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <input
            placeholder="写下你的评论..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
            style={{ flex: 1, padding: '10px 16px', border: '1px solid #e0e0e0', borderRadius: 24, outline: 'none', fontSize: 14 }}
          />
          <button onClick={handleComment} disabled={submitting || !commentText.trim()}
            style={{
              padding: '10px 24px', background: commentText.trim() ? '#1677ff' : '#ccc', color: '#fff', border: 'none', borderRadius: 24, cursor: commentText.trim() ? 'pointer' : 'not-allowed', fontSize: 14,
            }}>
            发送
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
