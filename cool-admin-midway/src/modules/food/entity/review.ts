import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('food_review')
export class FoodReviewEntity extends BaseEntity {
  @Index()
  @Column({ comment: '餐厅ID', type: 'int', nullable: true })
  restaurantId: number;

  @Index()
  @Column({ comment: '商品ID', type: 'int', nullable: true })
  goodsId: number;

  @Index()
  @Column({ comment: '用户ID', type: 'int' })
  userId: number;

  @Column({ comment: '评分', type: 'tinyint' })
  rating: number;

  @Column({ comment: '评价内容', type: 'text', nullable: true })
  content: string;

  @Column({ comment: '图片列表', type: 'json', nullable: true })
  images: string[];
}
