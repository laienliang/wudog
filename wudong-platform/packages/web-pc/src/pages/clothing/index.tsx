import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Select, Pagination, Skeleton, Empty, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StarFilled } from '@ant-design/icons';
import { productApi } from '../../services/api';

const { Search } = Input;

const sortOptions = [
  { value: 'createdAt', label: '最新' },
  { value: 'sales', label: '销量' },
  { value: 'price', label: '价格' },
  { value: 'rating', label: '评分' },
];

const ClothingList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [priceRange, setPriceRange] = useState<string | undefined>();
  const [minRating, setMinRating] = useState<number | undefined>();
  const [sortField, setSortField] = useState<string>('sales');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [page, setPage] = useState(1);

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [page, categoryId, sortField, sortOrder, priceRange, minRating]);

  const fetchCategories = async () => {
    try { const res = await productApi.categories(); setCategories(res.data?.data || res.data || []); } catch {}
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = { page, pageSize: 12, sortField, sortOrder };
      if (categoryId) params.categoryId = categoryId;
      if (keyword) params.keyword = keyword;
      if (priceRange) { const [min, max] = priceRange.split('-'); params.minPrice = min; if (max !== '+') params.maxPrice = max; }
      if (minRating) params.minRating = minRating;
      const res = await productApi.list(params);
      const data = res.data?.data || res.data;
      setProducts(data.list || []);
      setTotal(data.pagination?.total || 0);
    } catch { message.error('加载失败'); }
    setLoading(false);
  };

  const handleSearch = (value: string) => {
    setKeyword(value); setPage(1);
    setSearchParams(value ? { keyword: value } : {});
    fetchProducts();
  };

  const handleCategoryClick = (id?: number) => { setCategoryId(id); setPage(1); };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Search placeholder="搜索商品..." value={keyword} onChange={e => setKeyword(e.target.value)} onSearch={handleSearch} style={{ width: 280 }} allowClear />
        <Select placeholder="价格区间" style={{ width: 130 }} allowClear onChange={v => { setPriceRange(v); setPage(1); }}
          options={[{value:'0-50',label:'¥0-50'},{value:'50-100',label:'¥50-100'},{value:'100-200',label:'¥100-200'},{value:'200-500',label:'¥200-500'},{value:'500+',label:'¥500以上'}]} />
        <Select placeholder="评分" style={{ width: 100 }} allowClear onChange={v => { setMinRating(Number(v)); setPage(1); }}
          options={[{value:4,label:'★4以上'},{value:3,label:'★3以上'}]} />
        <Select options={sortOptions} value={sortField} onChange={v => setSortField(v)} style={{ width: 100 }} />
        <Select options={[{value:'DESC',label:'⬇降序'},{value:'ASC',label:'⬆升序'}]} value={sortOrder} onChange={v => setSortOrder(v)} style={{ width: 90 }} />
        <span style={{ color: '#999', fontSize: 13 }}>共 {total} 件</span>
      </div>

      <Row gutter={24}>
        <Col span={4}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: '#1A1A1A' }}>商品分类</div>
            <div onClick={() => handleCategoryClick(undefined)}
              style={{ padding: '6px 0', cursor: 'pointer', color: !categoryId ? '#1F5FA8' : '#595959', fontWeight: !categoryId ? 600 : 400 }}>全部分类</div>
            {categories.map((cat: any) => (
              <div key={cat.id} onClick={() => handleCategoryClick(cat.id)}
                style={{ padding: '6px 0', cursor: 'pointer', color: categoryId === cat.id ? '#1F5FA8' : '#595959', fontWeight: categoryId === cat.id ? 600 : 400 }}>{cat.name}</div>
            ))}
          </div>
        </Col>

        <Col span={20}>
          {loading ? <div style={{ textAlign: 'center', padding: 80 }}><Skeleton active paragraph={{ rows: 6 }} /></div>
          : products.length === 0 ? <Empty description="暂无商品" style={{ padding: 80 }} />
          : <>
            <Row gutter={[16, 24]}>
              {products.map((p: any) => (
                <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
                  <Card hoverable cover={<div style={{ height: 220, background: '#f5f5f5' }}><img alt={p.name} src={p.mainImage || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                    onClick={() => navigate(`/clothing/${p.id}`)} style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>{p.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#E85D2F' }}>¥{p.price}</span>
                      {p.marketPrice && <span style={{ fontSize: 12, color: '#BFBFBF', textDecoration: 'line-through' }}>¥{p.marketPrice}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#8C8C8C' }}>
                      <span><StarFilled style={{ color: '#FAAD14' }} /> {p.rating || 5.0}</span>
                      <span>已售 {p.sales || 0}</span>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Pagination current={page} total={total} pageSize={12} onChange={p => setPage(p)} showSizeChanger={false} />
            </div>
          </>}
        </Col>
      </Row>
    </div>
  );
};

export default ClothingList;
