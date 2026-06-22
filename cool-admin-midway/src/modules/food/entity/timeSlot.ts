import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('food_time_slot')
export class FoodTimeSlotEntity extends BaseEntity {
  @Index()
  @Column({ comment: '餐厅ID', type: 'int' })
  restaurantId: number;

  @Column({ comment: '时段名称', length: 50 })
  name: string;

  @Column({ comment: '最大预订数', default: 50 })
  maxBookings: number;
}
