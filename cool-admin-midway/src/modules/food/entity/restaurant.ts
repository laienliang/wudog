import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('food_restaurant')
export class FoodRestaurantEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商家ID', type: 'int', nullable: true })
  merchantId: number;

  @Column({ comment: '餐厅名称', length: 100 })
  name: string;

  @Column({ comment: '简介', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '主图', length: 500, nullable: true })
  mainImage: string;

  @Column({ comment: '地址', length: 200, nullable: true })
  address: string;

  @Column({ comment: '营业时间', length: 100, nullable: true })
  businessHours: string;

  @Column({ comment: '容纳人数', default: 0 })
  capacity: number;

  @Column({ comment: '评分', type: 'decimal', precision: 3, scale: 2, default: 5.00 })
  rating: number;

  @Column({ comment: '状态 0=停业 1=营业', default: 1 })
  status: number;
}
