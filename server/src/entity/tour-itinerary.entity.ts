import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tour_itineraries')
export class TourItinerary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'route_id', type: 'int', comment: '路线ID' })
  routeId: number;

  @Column({ name: 'day_number', type: 'int', comment: '第几天' })
  dayNumber: number;

  @Column({ type: 'text', nullable: true, comment: '行程描述' })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '途经景点' })
  spots: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '用餐安排' })
  meals: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '住宿安排' })
  accommodation: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '交通方式' })
  transport: string;

  @Column({ name: 'sort_order', type: 'int', default: 0, comment: '排序' })
  sortOrder: number;
}
