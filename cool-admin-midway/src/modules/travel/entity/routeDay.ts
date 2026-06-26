import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('travel_route_day')
export class TravelRouteDayEntity extends BaseEntity {
  @Index()
  @Column({ comment: '路线ID', type: 'int' })
  routeId: number;

  @Column({ comment: '天数', type: 'tinyint' })
  day: number;

  @Column({ comment: '行程描述', type: 'text' })
  description: string;

  @Column({ comment: '景点', length: 200, nullable: true })
  spots: string;

  @Column({ comment: '用餐', length: 100, nullable: true })
  meals: string;

  @Column({ comment: '住宿', length: 100, nullable: true })
  accommodation: string;
}
