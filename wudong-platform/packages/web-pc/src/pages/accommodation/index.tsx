import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Select, Tag, Skeleton, Empty, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { StarFilled } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const { Search } = Input;
const api = axios.create({ baseURL: '/api/v1' });

const sortOptions = [
  { value: 'rating', label: '评分最高' },
  { value: 'price', label: '价格最低' },
  { value: 'default', label: '默认排序' },
];

const AccommodationList: React.FC = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => { fetchData(); }, [keyword, sortBy]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/homestays', { params: { page: 1, pageSize: 50, keyword: keyword || undefined } });
      let data = res.data?.data?.list || [];
      if (sortBy === 'rating') data.sort((a: any, b: any) => Number(b.rating) - Number(a.rating));
      if (sortBy === 'price') data.sort((a: any, b: any) => (Number(a.min_price) || 0) - (Number(b.min_price) || 0));
      setList(data);
    } catch { message.error('加载失败'); }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      {/* 标题 + 筛选（跟服装页完全一致） */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Search placeholder="搜索民宿..." allowClear onSearch={v => setKeyword(v)} style={{ width: 280 }} />
        <Select placeholder="排序方式" value={sortBy} onChange={v => setSortBy(v)} style={{ width: 120 }}
          options={sortOptions} />
        <span style={{ color: '#999', fontSize: 13 }}>共 {list.length} 家民宿</span>
      </div>

      {/* 列表 */}
      {loading ? (
        <Row gutter={[16, 24]}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <Col xs={24} sm={12} md={8} lg={6} key={i}>
              <Card><Skeleton active paragraph={{ rows: 4 }} /></Card>
            </Col>
          ))}
        </Row>
      ) : list.length === 0 ? (
        <Empty description="暂无民宿" style={{ padding: 80 }} />
      ) : (
        <Row gutter={[16, 24]}>
          {list.map(h => (
            <Col xs={24} sm={12} md={8} lg={6} key={h.id}>
              <Card hoverable
                cover={<div style={{ height: 200, background: '#f5f5f5' }}>
                  <img alt={h.name} src={h.coverImage}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { (e.target as HTMLImageElement).src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='; }} />
                </div>}
                onClick={() => navigate(`/accommodation/${h.id}`)}
                style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                styles={{ body: { padding: '12px 16px' } }}>
                <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>{h.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#E85D2F' }}>¥{h.min_price || '??'}</span>
                  <span style={{ fontSize: 12, color: '#BFBFBF' }}>起</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#8C8C8C' }}>
                  <span><StarFilled style={{ color: '#FAAD14' }} /> {h.rating || 5.0}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                    {h.facilities?.slice(0, 2).join(' · ') || ''}
                  </span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default AccommodationList;
