import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_accommodation_calendar')
export class Calendar extends BaseEntity {
  @Column({ name: 'room_type_id' })
  roomTypeId: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'tinyint', nullable: true, comment: 'NULL正常 1满房 2维护' })
  status: number | null;
}
