import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import request from '../../utils/request';

export default function ListPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request.get('/api/travel-note/list', { params: { status: 'published' } }).then(res => {
      setNotes(res.data?.list || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>加载中...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>精彩游记</h2>
      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>暂无游记</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {notes.map(note => (
            <Link to={`/detail/${note.id}`} key={note.id} style={{
              background: '#fff', borderRadius: 8, overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)', transition: 'transform 0.2s'
            }}>
              <div style={{ height: 180, background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                {note.images?.[0] ? <img src={note.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '暂无图片'}
              </div>
              <div style={{ padding: 12 }}>
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>{note.title}</h3>
                <p style={{ fontSize: 13, color: '#999' }}>{note.like_count || 0} 赞 · {note.view_count || 0} 浏览</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
