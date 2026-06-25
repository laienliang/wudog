import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('room_calendar')
export class RoomCalendarEntity extends BaseEntity {
  @Column({ type: 'bigint', unsigned: true, name: 'room_id', comment: '房型ID' })
  roomId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'accommodation_id', comment: '住宿ID（冗余）' })
  accommodationId: number;

  @Column({ type: 'date', comment: '日期' })
  date: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '当日价格/晚' })
  price: number;

  @Column({ type: 'int', default: 0, comment: '当日可用库存' })
  stock: number;

  @Column({ type: 'tinyint', default: 0, name: 'is_closed', comment: '是否关闭:0正常 1关闭' })
  isClosed: number;

  @Column({ type: 'varchar', length: 128, nullable: true, comment: '备注' })
  remark: string;
}
