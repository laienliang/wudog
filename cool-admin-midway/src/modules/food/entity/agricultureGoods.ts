import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('food_agriculture_goods')
export class FoodAgricultureGoodsEntity extends BaseEntity {
  @Index()
  @Column({ comment: '分类ID', type: 'int' })
  categoryId: number;

  @Index()
  @Column({ comment: '商家ID', type: 'int', nullable: true })
  merchantId: number;

  @Column({ comment: '商品名称', length: 100 })
  name: string;

  @Column({ comment: '主图', length: 500, nullable: true })
  mainImage: string;

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '规格', length: 50, nullable: true })
  specification: string;

  @Column({ comment: '库存', default: 0 })
  stock: number;

  @Column({ comment: '产地', length: 100, nullable: true })
  origin: string;

  @Column({ comment: '保质期', length: 50, nullable: true })
  shelfLife: string;

  @Column({ comment: '详情', type: 'text', nullable: true })
  detailContent: string;

  @Column({ comment: '状态 0=下架 1=上架', default: 1 })
  status: number;
}
