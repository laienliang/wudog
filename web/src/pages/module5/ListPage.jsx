import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import request from '../../utils/request';

export default function ListPage() {
  const [list, setList] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [activeTopic, setActiveTopic] = useState('');
  const [sort, setSort] = useState('latest');
  const pageSize = 20;

  const fetchList = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, pageSize, status: 'published' };
      if (activeTopic) params.topic = activeTopic;
      if (keyword) params.keyword = keyword;
      if (sort === 'popular') params.sort = 'popular';
      if (sort === 'views') params.sort = 'views';
      const res = await request.get('/api/travel-note/list', { params });
      setList(res.data?.list || []);
      setTotal(res.data?.total || 0);
      setPage(p);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await request.get('/api/topic/list');
      setTopics(res.data.list || []);
    } catch { /* */ }
  };

  useEffect(() => { fetchTopics(); }, []);
  useEffect(() => { fetchList(); }, [activeTopic, sort]);

  const handleSearch = () => {
    setPage(1);
    fetchList(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  if (loading && list.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #eee', borderTopColor: '#1677ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="搜索游记标题..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: 20, width: 260, outline: 'none' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px 20px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 20, cursor: 'pointer' }}>搜索</button>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          style={{ padding: '8px 14px', border: '1px solid #ddd', borderRadius: 20, outline: 'none', fontSize: 13, cursor: 'pointer' }}>
          <option value="latest">最新</option>
          <option value="popular">最热</option>
          <option value="views">最多浏览</option>
        </select>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginLeft: 8 }}>
          <span
            onClick={() => setActiveTopic('')}
            style={{
              padding: '6px 16px', borderRadius: 16, cursor: 'pointer', fontSize: 13,
              background: activeTopic === '' ? '#1677ff' : '#f0f0f0',
              color: activeTopic === '' ? '#fff' : '#666',
            }}
          >全部</span>
          {topics.map((t) => (
            <Link key={t.id} to={`/module5/topic/${t.id}`} style={{ textDecoration: 'none' }}>
              <span
                onClick={() => setActiveTopic(t.id)}
                style={{
                  padding: '6px 16px', borderRadius: 16, cursor: 'pointer', fontSize: 13,
                  background: activeTopic === String(t.id) ? '#1677ff' : '#f0f0f0',
                  color: activeTopic === String(t.id) ? '#fff' : '#666',
                }}
              >{t.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#999' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
          <div>暂无游记，快去发布第一篇吧！</div>
          <Link to="/module5/edit" style={{ display: 'inline-block', marginTop: 16, padding: '8px 24px', background: '#1677ff', color: '#fff', borderRadius: 20 }}>发布游记</Link>
        </div>
      ) : (
        <div className="waterfall" style={{ columnCount: 3, columnGap: 20 }}>
          {list.map((item) => (
            <Link key={item.id} to={`/module5/detail/${item.id}`} style={{
              display: 'inline-block', width: '100%', marginBottom: 20,
              background: '#fff', borderRadius: 10, overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
            >
              {item.images?.[0] ? (
                <img src={item.images[0]} alt="" style={{ width: '100%', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: 160, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>
                  暂无封面
                </div>
              )}
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: 16, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h3>
                <div style={{ fontSize: 12, color: '#999', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item.topic_name || '未分类'}</span>
                  <span style={{ color: '#ff4d4f' }}>❤ {item.like_count || 0}</span>
                </div>
                <div style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>
                  {new Date(item.created_at).toLocaleDateString('zh-CN')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {total > pageSize && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 32 }}>
          <button onClick={() => fetchList(page - 1)} disabled={page <= 1}
            style={{ padding: '8px 18px', border: '1px solid #ddd', background: page <= 1 ? '#f5f5f5' : '#fff', borderRadius: 6, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>
            上一页
          </button>
          <span style={{ fontSize: 14, color: '#666' }}>第 {page} / {Math.ceil(total / pageSize)} 页（共 {total} 篇）</span>
          <button onClick={() => fetchList(page + 1)} disabled={page >= Math.ceil(total / pageSize)}
            style={{ padding: '8px 18px', border: '1px solid #ddd', background: page >= Math.ceil(total / pageSize) ? '#f5f5f5' : '#fff', borderRadius: 6, cursor: page >= Math.ceil(total / pageSize) ? 'not-allowed' : 'pointer' }}>
            下一页
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
