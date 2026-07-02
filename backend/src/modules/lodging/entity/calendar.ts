// ============================================================
// 房态日历实体 — DB 实际列：id, room_id, booking_date, available_stock, price, created_at, updated_at
// status / booked_stock / is_deleted 为运行时字段（DB 暂无这三列）
// ============================================================
import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from './room';

@Entity('room_calendar')
@Unique('uk_room_date', ['room_id', 'bookingDate'])
export class Calendar {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Index()
  @Column({ name: 'room_id', type: 'bigint', unsigned: true, comment: '房型ID' })
  room_id: number;

  @Index()
  @Column({ name: 'booking_date', type: 'date', comment: '日期' })
  bookingDate: string;

  @Column({ name: 'available_stock', type: 'int', unsigned: true, default: 5, comment: '可售库存' })
  available_stock: number;

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '当日价格(NULL则用base_price)' })
  price: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', comment: '更新时间' })
  updated_at: Date;

  // ---- 运行时字段（DB 暂无，默认值保业务逻辑不报错） ----
  status: number = 1;
  bookedStock: number = 0;
  is_deleted: number = 0;

  // ---- 关联 ----
  @ManyToOne(() => Room, (r) => r.calendars)
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
