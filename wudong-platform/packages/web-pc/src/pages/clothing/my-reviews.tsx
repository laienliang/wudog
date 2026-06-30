import React, { useState, useEffect } from 'react';
import { List, Rate, Empty, message, Spin, Tag } from 'antd';
import { productApi } from '../../services/api';

const MyReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取所有商品的评价（简化版：取前几个商品的评价作为展示）
    productApi.list({ page: 1, pageSize: 10 })
      .then(async (res) => {
        const products = res.data?.data?.list || [];
        const allReviews: any[] = [];
        for (const p of products.slice(0, 5)) {
          try {
            const revRes = await productApi.reviews(p.id, { page: 1, pageSize: 5 });
            const list = revRes.data?.data?.list || revRes.data?.data || revRes.data || [];
            list.forEach((r: any) => { r.productName = p.name; });
            allReviews.push(...list);
          } catch (e) { /* ignore */ }
        }
        setReviews(allReviews);
      })
      .catch(() => message.error('加载失败'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin /></div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <h2 style={{ marginBottom: 24 }}>📝 我的评价</h2>
      {reviews.length === 0 ? (
        <Empty description="还没有评价" />
      ) : (
        <List
          dataSource={reviews}
          renderItem={(item: any) => (
            <List.Item>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <Tag color="#1F5FA8">{item.productName}</Tag>
                  <Rate disabled value={item.rating} style={{ fontSize: 13 }} />
                  <span style={{ fontSize: 12, color: '#8C8C8C' }}>{item.createdAt}</span>
                </div>
                <div style={{ marginLeft: 4 }}>{item.content}</div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default MyReviewsPage;
