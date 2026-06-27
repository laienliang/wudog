/* ============================================================
   图片画廊 — 轮播查看
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\components\ImageGallery\index.tsx
   ============================================================ */
import { Image } from 'antd';
import './style.css';

interface Props {
  images: string[];
  cover?: string;
}

export default function ImageGallery({ images, cover }: Props) {
  const all = cover ? [cover, ...images.filter(i => i !== cover)] : images;

  if (!all.length) {
    return <div className="gallery-empty">暂无图片</div>;
  }

  return (
    <div className="image-gallery">
      <div className="gallery-main">
        <Image src={all[0]} alt="主图" className="gallery-main-img" />
      </div>
      {all.length > 1 && (
        <div className="gallery-thumbs">
          {all.slice(1, 5).map((src, i) => (
            <div key={i} className="gallery-thumb">
              <Image src={src} alt={`图片${i + 2}`} preview={{ mask: `${all.length - 1}张全部` }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
