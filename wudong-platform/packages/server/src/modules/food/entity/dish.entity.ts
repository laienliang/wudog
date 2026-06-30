import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_food_dish')
export class Dish extends BaseEntity {
  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'main_image', type: 'varchar', length: 500, nullable: true })
  mainImage: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_signature', type: 'tinyint', default: 0, comment: '是否招牌' })
  isSignature: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;
}
