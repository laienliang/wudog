// ============================================================
// 房态日历实体 — 绑定房型+日期，支持独立定价和库存
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\entity\calendar.ts
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
@Unique('uk_room_date', ['room_id', 'date'])
export class Calendar {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, comment: '房型ID' })
  room_id: number;

  @Index()
  @Column({ type: 'date', comment: '日期' })
  date: string;

  @Column({ type: 'int', unsigned: true, default: 5, comment: '可售库存' })
  available_stock: number;

  @Column({ type: 'int', unsigned: true, default: 0, comment: '已预订库存' })
  booked_stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '当日价格(NULL则用base_price)' })
  price: number;

  @Index()
  @Column({ type: 'tinyint', default: 1, comment: '状态: 1=可售 2=满房 3=关房' })
  status: number;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间' })
  updated_at: Date;

  @Index()
  @Column({ type: 'tinyint', width: 1, default: 0, comment: '软删除' })
  is_deleted: number;

  // ---- 关联 ----
  @ManyToOne(() => Room, (r) => r.calendars)
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
