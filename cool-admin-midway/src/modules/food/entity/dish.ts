import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('food_dish')
export class FoodDishEntity extends BaseEntity {
  @Index()
  @Column({ comment: '餐厅ID', type: 'int' })
  restaurantId: number;

  @Column({ comment: '菜品名称', length: 100 })
  name: string;

  @Column({ comment: '主图', length: 500, nullable: true })
  mainImage: string;

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '介绍', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '是否招牌 0=否 1=是', default: 0 })
  isSignature: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;
}
