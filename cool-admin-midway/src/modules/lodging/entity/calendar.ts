import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('lodging_calendar')
export class LodgingCalendarEntity extends BaseEntity {
  @Index()
  @Column({ comment: '房型ID', type: 'int' })
  roomTypeId: number;

  @Column({ comment: '日期', type: 'date' })
  date: Date;

  @Column({ comment: '可用库存', default: 0 })
  availableStock: number;

  @Column({ comment: '当日价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '是否可订 0=不可订 1=可订', default: 1 })
  isAvailable: number;
}
