/* ============================================================
   评价列表组件
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\components\ReviewList\index.tsx
   ============================================================ */
import { useEffect, useState } from 'react';
import { List, Rate, Avatar, Typography, Empty } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getReviews } from '../../api/lodging';

const { Paragraph } = Typography;

interface Props { homestayId: number; }

export default function ReviewList({ homestayId }: Props) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getReviews({ homestay_id: homestayId, page: 1, pageSize: 10 });
        setReviews(res.list || []);
        setTotal(res.total || 0);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [homestayId]);

  return (
    <List
      loading={loading}
      dataSource={reviews}
      locale={{ emptyText: <Empty description="暂无评价" /> }}
      pagination={{ total, pageSize: 10, current: page, onChange: (p) => { setPage(p); } }}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar icon={<UserOutlined />} />}
            title={
              <span>
                <Rate disabled value={item.rating} style={{ fontSize: 14 }} />
                <span style={{ marginLeft: 8, color: '#999', fontSize: 12 }}>{item.created_at}</span>
              </span>
            }
            description={
              <>
                <Paragraph>{item.content}</Paragraph>
                {item.owner_reply && (
                  <div style={{ background: '#f6f8fa', padding: 12, borderRadius: 8, marginTop: 8 }}>
                    <strong>房东回复：</strong>{item.owner_reply}
                  </div>
                )}
              </>
            }
          />
        </List.Item>
      )}
    />
  );
}
