import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_food_restaurant')
export class Restaurant extends BaseEntity {
  @Column({ name: 'merchant_id', comment: '商家ID' })
  merchantId: number;

  @Column({ type: 'varchar', length: 200, comment: '餐厅名称' })
  name: string;

  @Column({ name: 'cover_image', type: 'varchar', length: 500, comment: '封面图' })
  coverImage: string;

  @Column({ type: 'simple-json', nullable: true, comment: '餐厅图片列表' })
  images: string[];

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '联系电话' })
  phone: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '地址' })
  address: string;

  @Column({ name: 'opening_hours', type: 'varchar', length: 200, nullable: true, comment: '营业时间' })
  openingHours: string;

  @Column({ name: 'cuisine_tags', type: 'simple-json', nullable: true, comment: '菜系标签' })
  cuisineTags: string[];

  @Column({ type: 'text', nullable: true, comment: '餐厅介绍' })
  description: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0, comment: '评分' })
  rating: number;

  @Column({ type: 'tinyint', default: 1, comment: '状态：0关闭 1营业' })
  status: number;
}
