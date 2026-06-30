import { Entity, Column, OneToMany, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_clothing_product')
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 200, comment: '商品标题' })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '副标题' })
  subtitle: string;

  @Column({ name: 'category_id', comment: '分类ID' })
  categoryId: number;

  @Column({ name: 'merchant_id', comment: '商家ID' })
  merchantId: number;

  @Column({ name: 'main_image', type: 'varchar', length: 500, comment: '主图URL' })
  mainImage: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '售价' })
  price: number;

  @Column({ name: 'market_price', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '市场价' })
  marketPrice: number;

  @Column({ type: 'int', default: 0, comment: '销量' })
  sales: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0, comment: '评分' })
  rating: number;

  @Column({ type: 'text', nullable: true, comment: '富文本详情' })
  description: string;

  @Column({ name: 'craft_description', type: 'text', nullable: true, comment: '制作工艺/文化介绍' })
  craftDescription: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态：0下架 1上架' })
  status: number;
}
