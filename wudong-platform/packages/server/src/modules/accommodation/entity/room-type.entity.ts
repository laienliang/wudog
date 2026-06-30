import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_accommodation_room_type')
export class RoomType extends BaseEntity {
  @Column({ name: 'homestay_id' })
  homestayId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '面积（如30㎡）' })
  area: string;

  @Column({ name: 'bed_type', type: 'varchar', length: 100, nullable: true })
  bedType: string;

  @Column({ name: 'max_guests', nullable: true })
  maxGuests: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'weekend_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  weekendPrice: number;

  @Column({ type: 'simple-json', nullable: true })
  images: string[];

  @Column({ type: 'simple-json', nullable: true })
  facilities: string[];

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
