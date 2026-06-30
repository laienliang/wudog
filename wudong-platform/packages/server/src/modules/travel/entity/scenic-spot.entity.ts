import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_travel_scenic_spot')
export class ScenicSpot extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'cover_image', type: 'varchar', length: 500 })
  coverImage: string;

  @Column({ type: 'simple-json', nullable: true })
  images: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'opening_hours', type: 'varchar', length: 200, nullable: true })
  openingHours: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0 })
  rating: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;
}
