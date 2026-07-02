import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import request from '../../utils/request';

function getPayload() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
  } catch { return null; }
}

const STATUS_MAP = {
  draft: { label: '草稿', color: '#faad14', bg: '#fffbe6' },
  reviewing: { label: '审核中', color: '#1677ff', bg: '#e6f4ff' },
  published: { label: '已发布', color: '#52c41a', bg: '#f6ffed' },
  rejected: { label: '已驳回', color: '#ff4d4f', bg: '#fff2f0' },
};

export default function MyPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const payload = getPayload();
  const myUserId = payload?.userId || payload?.id;

  const [tab, setTab] = useState('notes');
  const [statusFilter, setStatusFilter] = useState('');
  const [notes, setNotes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!token) { navigate('/module5/login'); return; }
    fetchData();
  }, [tab, statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === 'notes') {
        const params = { page: 1, pageSize: 200, userId: myUserId };
        if (statusFilter) params.status = statusFilter;
        const res = await request.get('/api/travel-note/list', { params });
        setNotes(res.data.list || []);
      } else if (tab === 'favorites') {
        const res = await request.get('/api/favorite/list', { params: { userId: myUserId, page: 1, pageSize: 200 } });
        setFavorites(res.data.list || []);
      }
    } catch {} finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('确认删除这篇游记？')) return;
    setActionLoading(id);
    try {
      await request.delete(`/api/travel-note/delete/${id}`);
      setNotes(notes.filter(n => n.id !== id));
    } catch (e) { alert(e.response?.data?.message || '删除失败'); }
    finally { setActionLoading(null); }
  };

  const handleSubmitReview = async (id) => {
    setActionLoading(id);
    try {
      await request.post(`/api/travel-note/submit-review/${id}`);
      alert('已提交审核');
      fetchData();
    } catch (e) { alert(e.response?.data?.message || '提交失败'); }
    finally { setActionLoading(null); }
  };

  const handleUnfavorite = async (id) => {
    setActionLoading(id);
    try {
      await request.post('/api/favorite/toggle', { note_id: id });
      setFavorites(favorites.filter(f => (f.note_id || f.id) !== id));
    } catch {}
    finally { setActionLoading(null); }
  };

  const stats = { noteCount: notes.length, publishedCount: notes.filter(n => n.status === 'published').length };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* 用户信息卡片 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 16, padding: '32px', marginBottom: 24, color: '#fff',
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 32, fontWeight: 'bold',
        }}>
          {payload?.username?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 22 }}>{payload?.username || '用户'}</h2>
          <div style={{ display: 'flex', gap: 24, fontSize: 14, opacity: 0.9 }}>
            <span>游记 <strong>{stats.noteCount}</strong></span>
            <span>已发布 <strong>{stats.publishedCount}</strong></span>
            <span>收藏 <strong>{favorites.length}</strong></span>
          </div>
        </div>
        <button onClick={() => navigate('/module5/edit')} style={{
          padding: '10px 24px', background: '#fff', color: '#667eea',
          border: 'none', borderRadius: 24, fontSize: 15, fontWeight: 600,
          cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>+ 写游记</button>
      </div>

      {/* Tab 切换 */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: '#fff', borderRadius: 12, padding: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        {[
          { key: 'notes', label: '我的游记' },
          { key: 'favorites', label: '我的收藏' },
        ].map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setStatusFilter(''); }}
            style={{
              flex: 1, padding: '10px 0', border: 'none', borderRadius: 10,
              background: tab === t.key ? '#1677ff' : 'transparent',
              color: tab === t.key ? '#fff' : '#666',
              fontSize: 14, fontWeight: tab === t.key ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.2s',
            }}>{t.label}</button>
        ))}
      </div>

      {/* 状态筛选栏（仅游记tab） */}
      {tab === 'notes' && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { key: '', label: '全部' },
            { key: 'draft', label: '草稿' },
            { key: 'reviewing', label: '审核中' },
            { key: 'published', label: '已发布' },
            { key: 'rejected', label: '已驳回' },
          ].map(s => (
            <button key={s.key} onClick={() => setStatusFilter(s.key)}
              style={{
                padding: '6px 18px', borderRadius: 20, border: '1px solid #e0e0e0',
                background: statusFilter === s.key ? '#1677ff' : '#fff',
                color: statusFilter === s.key ? '#fff' : '#666',
                fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
              }}>{s.label}</button>
          ))}
        </div>
      )}

      {/* 跨模块快捷入口 */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24,
      }}>
        {[
          { label: '非遗订单', path: '/module1/orders', icon: '🛍' },
          { label: '餐饮预订', path: '/module2/bookings', icon: '🍽' },
          { label: '民宿订单', path: '/module3/orders', icon: '🏠' },
          { label: '出行订单', path: '/module4/orders', icon: '🎫' },
        ].map(item => (
          <Link key={item.path} to={item.path} style={{
            background: '#fff', borderRadius: 10, padding: '16px', textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textDecoration: 'none',
            color: '#333', fontSize: 14, transition: 'transform 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</div>
            <div>{item.label}</div>
          </Link>
        ))}
      </div>

      {/* 内容区 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>加载中...</div>
      ) : tab === 'notes' ? (
        notes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 12 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
            <div style={{ color: '#999', marginBottom: 20, fontSize: 15 }}>
              {statusFilter ? `暂无${STATUS_MAP[statusFilter]?.label || ''}状态的游记` : '还没有游记'}
            </div>
            <button onClick={() => navigate('/module5/edit')} style={{
              padding: '10px 32px', background: '#1677ff', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer',
            }}>发布第一篇游记</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notes.map(item => {
              const st = STATUS_MAP[item.status] || { label: item.status, color: '#999', bg: '#f5f5f5' };
              return (
                <div key={item.id} style={{
                  background: '#fff', borderRadius: 12, padding: '20px 24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex',
                  gap: 16, alignItems: 'flex-start',
                }}>
                  {/* 缩略图 */}
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt="" style={{
                      width: 100, height: 75, borderRadius: 8, objectFit: 'cover', flexShrink: 0,
                    }} />
                  ) : (
                    <div style={{
                      width: 100, height: 75, borderRadius: 8, flexShrink: 0,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }} />
                  )}
                  {/* 信息 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Link to={`/module5/detail/${item.id}`} style={{
                        fontSize: 16, fontWeight: 600, color: '#333',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        textDecoration: 'none', flex: 1, minWidth: 0,
                      }}>{item.title}</Link>
                      <span style={{
                        padding: '2px 10px', borderRadius: 10, fontSize: 12,
                        background: st.bg, color: st.color, whiteSpace: 'nowrap',
                      }}>{st.label}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#999', marginBottom: 8 }}>
                      {new Date(item.created_at).toLocaleDateString('zh-CN')}
                      <span style={{ margin: '0 8px' }}>|</span>
                      浏览 {item.viewCount || 0}
                      <span style={{ margin: '0 8px' }}>|</span>
                      点赞 {item.likeCount || 0}
                    </div>
                    {/* 驳回原因 */}
                    {item.status === 'rejected' && item.rejectReason && (
                      <div style={{ fontSize: 12, color: '#ff4d4f', marginBottom: 6 }}>
                        驳回原因：{item.rejectReason}
                      </div>
                    )}
                  </div>
                  {/* 操作按钮 */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', maxWidth: 200, justifyContent: 'flex-end' }}>
                    {/* 查看 */}
                    {item.status === 'published' && (
                      <Link to={`/module5/detail/${item.id}`} style={{
                        padding: '5px 12px', background: '#f5f5f5', color: '#666',
                        borderRadius: 6, fontSize: 12, textDecoration: 'none',
                      }}>查看</Link>
                    )}
                    {/* 编辑 */}
                    {['draft', 'rejected'].includes(item.status) && (
                      <Link to={`/module5/edit/${item.id}`} style={{
                        padding: '5px 12px', background: '#e6f4ff', color: '#1677ff',
                        borderRadius: 6, fontSize: 12, textDecoration: 'none',
                      }}>编辑</Link>
                    )}
                    {/* 提交审核 */}
                    {['draft', 'rejected'].includes(item.status) && (
                      <button onClick={() => handleSubmitReview(item.id)}
                        disabled={actionLoading === item.id}
                        style={{
                          padding: '5px 12px', background: '#1677ff', color: '#fff',
                          border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                        }}>提交审核</button>
                    )}
                    {/* 删除 */}
                    <button onClick={() => handleDelete(item.id)}
                      disabled={actionLoading === item.id}
                      style={{
                        padding: '5px 12px', background: '#fff2f0', color: '#ff4d4f',
                        border: '1px solid #ffccc7', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                      }}>删除</button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* 收藏 Tab */
        favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 12 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
            <div style={{ color: '#999', fontSize: 15 }}>还没有收藏游记</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {favorites.map(item => {
              const note = item.note || item;
              return (
                <div key={item.id} style={{
                  background: '#fff', borderRadius: 12, padding: '16px 24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex',
                  gap: 16, alignItems: 'center',
                }}>
                  {note.images?.[0] ? (
                    <img src={note.images[0]} alt="" style={{
                      width: 80, height: 60, borderRadius: 8, objectFit: 'cover', flexShrink: 0,
                    }} />
                  ) : (
                    <div style={{
                      width: 80, height: 60, borderRadius: 8, flexShrink: 0,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/module5/detail/${note.id || item.note_id}`} style={{
                      fontSize: 15, fontWeight: 600, color: '#333', textDecoration: 'none',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block',
                    }}>{note.title || '无标题'}</Link>
                    <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                      {note.created_at ? new Date(note.created_at).toLocaleDateString('zh-CN') : ''}
                    </div>
                  </div>
                  <button onClick={() => handleUnfavorite(note.id || item.note_id)}
                    disabled={actionLoading === (note.id || item.note_id)}
                    style={{
                      padding: '5px 14px', background: '#fff', color: '#ff4d4f',
                      border: '1px solid #ffccc7', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                    }}>取消收藏</button>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
