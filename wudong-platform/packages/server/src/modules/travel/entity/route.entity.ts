import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_travel_route')
export class Route extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'cover_image', type: 'varchar', length: 500 })
  coverImage: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '行程天数（如2天1晚）' })
  duration: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'max_people', nullable: true })
  maxPeople: number;

  @Column({ name: 'scenic_ids', type: 'simple-json', nullable: true })
  scenicIds: number[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  itinerary: any;

  @Column({ type: 'tinyint', default: 1 })
  status: number;
}
