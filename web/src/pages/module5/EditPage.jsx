import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import request from '../../utils/request';

export default function EditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [topicId, setTopicId] = useState('');
  const [topics, setTopics] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    request.get('/api/topic/list').then((res) => setTopics(res.data.list || [])).catch(() => {});
    if (isEdit) {
      request.get(`/api/travel-note/detail/${id}`).then((res) => {
        const d = res.data;
        setTitle(d.title);
        setContent(d.content);
        setImages(d.images || []);
        setTopicId(d.topic_id || '');
      }).catch(() => { navigate('/module5/list'); }).finally(() => setLoading(false));
    }
  }, [id]);

  const [uploading, setUploading] = useState(false);

  const addImageUrl = async () => {
    const url = imageUrl.trim();
    if (!url) return;
    if (!/^https?:\/\/.+/.test(url)) {
      alert('请输入有效的图片URL（以 http:// 或 https:// 开头）');
      return;
    }
    if (images.length >= 9) {
      alert('最多添加9张图片');
      return;
    }
    setUploading(true);
    try {
      const res = await request.post('/public/upload-url', { url });
      const localUrl = res.data?.url;
      if (localUrl) {
        setImages([...images, localUrl]);
        setImageUrl('');
      } else {
        alert('上传失败');
      }
    } catch {
      alert('URL图片下载失败，请检查链接是否可访问');
    }
    setUploading(false);
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (images.length + files.length > 9) {
      alert(`最多9张，当前${images.length}张，还能添加${9 - images.length}张`);
      return;
    }

    setUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await request.post('/public/upload', formData);
        const fileUrls = res.data?.files || [];
        if (fileUrls.length > 0) {
          setImages((prev) => [...prev, ...fileUrls.map(f => f.url)]);
        }
      } catch {
        alert(`${file.name} 上传失败`);
      }
    }
    setUploading(false);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const moveImage = (index, direction) => {
    const newImages = [...images];
    const target = index + direction;
    if (target < 0 || target >= newImages.length) return;
    [newImages[index], newImages[target]] = [newImages[target], newImages[index]];
    setImages(newImages);
  };

  const handleSubmit = async (submitReview = false) => {
    if (!title.trim() || !content.trim()) {
      alert('标题和正文不能为空');
      return;
    }
    setSubmitting(true);
    try {
      const body = { title: title.trim(), content: content.trim(), images, topic_id: topicId || null };
      let noteId = Number(id);
      if (isEdit) {
        await request.put(`/api/travel-note/update/${id}`, body);
      } else {
        const res = await request.post('/api/travel-note/create', body);
        noteId = res.data.id;
      }
      if (submitReview) {
        await request.post(`/api/travel-note/submit-review/${noteId}`);
        alert('已提交审核');
      } else {
        alert('已保存草稿');
      }
      navigate('/module5/list');
    } catch (e) {
      alert(e.response?.data?.message || '操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60 }}>加载中...</div>;
  }

  return (
    <div style={{ maxWidth: 750, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24 }}>{isEdit ? '编辑游记' : '发布游记'}</h2>

      <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>标题 *</label>
          <input placeholder="请输入游记标题" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>正文 *</label>
          <textarea placeholder="写下你的游记内容..." value={content} onChange={(e) => setContent(e.target.value)} rows={14}
            style={{ width: '100%', padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 15, outline: 'none', resize: 'vertical', lineHeight: 1.8, boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>
            图片（{images.length}/9 张）
          </label>

          {images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 12 }}>
              {images.map((url, i) => (
                <div key={i} style={{
                  position: 'relative', border: '1px solid #eee', borderRadius: 8, overflow: 'hidden',
                  aspectRatio: '1', background: '#f9f9f9',
                }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = ''; e.target.alt = '图片加载失败'; }} />
                  <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 4 }}>
                    {i > 0 && (
                      <button onClick={() => moveImage(i, -1)} title="左移"
                        style={{ width: 22, height: 22, borderRadius: 4, border: 'none', background: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'pointer', fontSize: 12, lineHeight: '22px', textAlign: 'center' }}>←</button>
                    )}
                    {i < images.length - 1 && (
                      <button onClick={() => moveImage(i, 1)} title="右移"
                        style={{ width: 22, height: 22, borderRadius: 4, border: 'none', background: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'pointer', fontSize: 12, lineHeight: '22px', textAlign: 'center' }}>→</button>
                    )}
                    <button onClick={() => removeImage(i)} title="删除"
                      style={{ width: 22, height: 22, borderRadius: 4, border: 'none', background: 'rgba(255,0,0,0.6)', color: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: '22px', textAlign: 'center' }}>✕</button>
                  </div>
                  <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: 3, padding: '1px 6px', fontSize: 11 }}>
                    {i === 0 ? '封面' : i + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <label style={{
                display: 'inline-block', padding: '8px 20px', border: '1px dashed #1677ff', borderRadius: 8,
                color: '#1677ff', cursor: images.length >= 9 ? 'not-allowed' : 'pointer', fontSize: 13,
                opacity: images.length >= 9 ? 0.5 : 1, background: '#f6f9ff',
              }}>
                {uploading ? '上传中...' : '📁 选择本地图片'}
                <input type="file" accept="image/*" multiple onChange={handleFileUpload}
                  disabled={images.length >= 9 || uploading}
                  style={{ display: 'none' }} />
              </label>
            </div>

            <span style={{ color: '#ccc', paddingTop: 8, fontSize: 13 }}>或</span>

            <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 280 }}>
              <input
                placeholder="粘贴网络图片URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                disabled={images.length >= 9 || uploading}
                style={{ flex: 1, padding: '8px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, outline: 'none' }}
              />
              <button onClick={addImageUrl} disabled={images.length >= 9 || !imageUrl.trim() || uploading}
                style={{
                  padding: '8px 20px', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                  background: images.length >= 9 ? '#ccc' : '#1677ff', color: '#fff', whiteSpace: 'nowrap',
                }}>
                + 添加
              </button>
            </div>
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: '#999' }}>
            支持：本地图片自动上传 或 粘贴网络URL。第一张图片将作为游记封面
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>话题</label>
          <select value={topicId} onChange={(e) => setTopicId(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
            <option value="">不选择话题</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={() => navigate(-1)}
            style={{ padding: '10px 28px', border: '1px solid #ddd', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
            取消
          </button>
          <button onClick={() => handleSubmit(false)} disabled={submitting}
            style={{ padding: '10px 28px', border: '1px solid #1677ff', background: '#fff', color: '#1677ff', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
            保存草稿
          </button>
          <button onClick={() => handleSubmit(true)} disabled={submitting}
            style={{ padding: '10px 28px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
            提交审核
          </button>
        </div>
      </div>
    </div>
  );
}
