import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import request from '../../utils/request';

export default function TopicPage() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      request.get(`/api/topic/detail/${id}`),
      request.get('/api/travel-note/list', { params: { page: 1, pageSize, topic: id, status: 'published' } }),
    ]).then(([topicRes, notesRes]) => {
      setTopic(topicRes.data);
      setNotes(notesRes.data.list);
      setTotal(notesRes.data.total);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const fetchNotes = async (p) => {
    try {
      const res = await request.get('/api/travel-note/list', { params: { page: p, pageSize, topic: id, status: 'published' } });
      setNotes(res.data.list);
      setPage(p);
    } catch { /* */ }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}>加载中...</div>;
  if (!topic) return <div style={{ textAlign: 'center', padding: 80, color: '#999' }}>话题不存在</div>;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #1677ff 0%, #764ba2 100%)', borderRadius: 16, padding: '40px 32px', marginBottom: 32, color: '#fff' }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>#{topic.name}</h1>
        {topic.description && <p style={{ opacity: 0.9, fontSize: 15, marginBottom: 16 }}>{topic.description}</p>}
        <div style={{ display: 'flex', gap: 24, fontSize: 14 }}>
          <span>{topic.note_count || 0} 篇游记</span>
          <span>{topic.follow_count || 0} 人关注</span>
        </div>
      </div>

      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>该话题下暂无游记</div>
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
                  <span>{item.author_nickname || '匿名'}</span>
                  <span>❤ {item.like_count || 0}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {total > pageSize && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 }}>
          <button onClick={() => fetchNotes(page - 1)} disabled={page <= 1}
            style={{ padding: '8px 18px', border: '1px solid #ddd', borderRadius: 6, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>上一页</button>
          <span style={{ lineHeight: '36px', color: '#666' }}>{page} / {Math.ceil(total / pageSize)}</span>
          <button onClick={() => fetchNotes(page + 1)} disabled={page >= Math.ceil(total / pageSize)}
            style={{ padding: '8px 18px', border: '1px solid #ddd', borderRadius: 6, cursor: page >= Math.ceil(total / pageSize) ? 'not-allowed' : 'pointer' }}>下一页</button>
        </div>
      )}
    </div>
  );
}
