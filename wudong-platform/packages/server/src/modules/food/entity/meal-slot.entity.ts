import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_food_meal_slot')
export class MealSlot extends BaseEntity {
  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'max_capacity', type: 'int', default: 0 })
  maxCapacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;
}
