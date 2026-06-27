import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import request from '../../utils/request';

function getCurrentUserId() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.id;
  } catch { return null; }
}

export default function UserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      request.get('/api/follow/list', { params: { userId: id, type: 'following' } }),
      request.get('/api/follow/list', { params: { userId: id, type: 'follower' } }),
      request.get('/api/travel-note/list', { params: { page: 1, pageSize: 50, status: 'published' } }),
    ]).then(([followingRes, followerRes, notesRes]) => {
      setUser({
        id: Number(id),
        nickname: `用户${id}`,
        followingCount: followingRes.data.total,
        followerCount: followerRes.data.total,
        noteCount: notesRes.data.total,
      });
      setNotes(notesRes.data.list.filter((n) => n.user_id === Number(id)));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleFollow = async () => {
    if (!token) { navigate('/module5/login'); return; }
    try {
      await request.post('/api/follow/toggle', { followed_id: Number(id) });
      setFollowed(!followed);
      setUser({ ...user, followerCount: user.followerCount + (followed ? -1 : 1) });
    } catch { /* */ }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>加载中...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '32px', marginBottom: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #1677ff, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 32, fontWeight: 'bold' }}>
          {user?.nickname?.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: 8 }}>{user?.nickname}</h2>
          <div style={{ display: 'flex', gap: 24, fontSize: 14, color: '#666' }}>
            <span><strong>{user?.noteCount || 0}</strong> 游记</span>
            <span><strong>{user?.followerCount || 0}</strong> 粉丝</span>
            <span><strong>{user?.followingCount || 0}</strong> 关注</span>
          </div>
        </div>
        {token && String(getCurrentUserId()) !== String(id) && (
          <button onClick={handleFollow}
            style={{
              padding: '8px 24px', borderRadius: 20, border: '1px solid #1677ff',
              background: followed ? '#1677ff' : '#fff', color: followed ? '#fff' : '#1677ff',
              cursor: 'pointer', fontSize: 14,
            }}>
            {followed ? '已关注' : '+ 关注'}
          </button>
        )}
      </div>

      <h3 style={{ marginBottom: 16 }}>TA 的游记</h3>
      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无游记</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {notes.map((item) => (
            <Link key={item.id} to={`/module5/detail/${item.id}`} style={{
              background: '#fff', borderRadius: 10, overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
            >
              {item.images?.[0] ? (
                <img src={item.images[0]} alt="" style={{ width: '100%', height: 190, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: 190, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
              )}
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: 16, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h3>
                <div style={{ fontSize: 12, color: '#999', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{new Date(item.created_at).toLocaleDateString('zh-CN')}</span>
                  <span>❤ {item.like_count || 0}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
