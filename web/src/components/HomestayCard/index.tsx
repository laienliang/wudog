/* ============================================================
   民宿卡片组件
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\components\HomestayCard\index.tsx
   ============================================================ */
import { Card, Tag, Rate, Button, message } from 'antd';
import { HeartOutlined, HeartFilled, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Homestay, toggleFavorite } from '../../api/lodging';
import './style.css';

interface Props {
  homestay: Homestay;
  isFavorited?: boolean;
}

export default function HomestayCard({ homestay, isFavorited: initialFav = false }: Props) {
  const nav = useNavigate();
  const [fav, setFav] = useState(initialFav);

  const handleFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await toggleFavorite(homestay.id);
      setFav(res.isFavorited);
      message.success(res.isFavorited ? '已收藏' : '已取消收藏');
    } catch { /* ignore */ }
  };

  return (
    <Card
      className="homestay-card"
      hoverable
      onClick={() => nav(`/detail/${homestay.id}`)}
      cover={
        <div className="card-cover">
          <img src={homestay.cover_image ? '/img/' + homestay.cover_image.replace(/^.*[\\/]/, '') : '/placeholder.jpg'} alt={homestay.name} />
          <Button
            className="fav-btn"
            shape="circle"
            icon={fav ? <HeartFilled style={{ color: '#E85D2F' }} /> : <HeartOutlined />}
            onClick={handleFav}
          />
        </div>
      }
    >
      <div className="card-body">
        <h3 className="card-title">{homestay.name}</h3>
        <p className="card-address">
          <EnvironmentOutlined /> {homestay.address}
        </p>
        <div className="card-tags">
          {(() => {
            const arr = homestay.facilities ? homestay.facilities.split(',') : [];
            return arr.slice(0, 3).map((item: string) => (
              <span key={item}>{item.trim()}</span>
            ));
          })()}
        </div>
        <div className="card-footer">
          <span className="card-rating">
            <Rate disabled value={homestay.rating} allowHalf style={{ fontSize: 14 }} />
            <span className="rating-text">{homestay.rating}分 · {homestay.review_count}条评价</span>
          </span>
          <span className="card-price">
            <em>¥{homestay.min_price}</em> 起/晚
          </span>
        </div>
      </div>
    </Card>
  );
}
