import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('clothing_goods')
export class ClothingGoodsEntity extends BaseEntity {
  @Index()
  @Column({ comment: '分类ID', type: 'int' })
  categoryId: number;

  @Index()
  @Column({ comment: '商家ID', type: 'int', nullable: true })
  merchantId: number;

  @Column({ comment: '商品标题', length: 100 })
  title: string;

  @Column({ comment: '副标题', length: 200, nullable: true })
  subtitle: string;

  @Column({ comment: '主图', length: 500, nullable: true })
  mainImage: string;

  @Column({ comment: '图片列表', type: 'json', nullable: true })
  images: string[];

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '市场价', type: 'decimal', precision: 10, scale: 2, nullable: true })
  marketPrice: number;

  @Column({ comment: '库存', default: 0 })
  stock: number;

  @Column({ comment: '销量', default: 0 })
  sales: number;

  @Column({ comment: '评分', type: 'decimal', precision: 3, scale: 2, default: 5.00 })
  rating: number;

  @Column({ comment: '工艺介绍', type: 'text', nullable: true })
  craftIntro: string;

  @Column({ comment: '传承人', length: 50, nullable: true })
  inheritorName: string;

  @Column({ comment: '详情', type: 'text', nullable: true })
  detailContent: string;

  @Column({ comment: '状态 0=下架 1=上架', default: 1 })
  status: number;
}
