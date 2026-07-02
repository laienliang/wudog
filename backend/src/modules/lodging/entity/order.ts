// ============================================================
// 住宿订单实体 — 含入住人、退改状态、核销码
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\entity\order.ts
// ============================================================
import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('booking_order')
export class Order {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'order_no', type: 'varchar', length: 32, comment: '订单号', unique: true })
  order_no: string;

  @Index()
  @Column({ name: 'user_id', type: 'bigint', unsigned: true, comment: '用户ID' })
  user_id: number;

  @Index()
  @Column({ name: 'homestay_id', type: 'bigint', unsigned: true, comment: '民宿ID' })
  homestay_id: number;

  @Index()
  @Column({ name: 'room_id', type: 'bigint', unsigned: true, comment: '房型ID' })
  room_id: number;

  @Index()
  @Column({ name: 'checkin_date', type: 'date', comment: '入住日期' })
  check_in_date: string;

  @Column({ name: 'checkout_date', type: 'date', comment: '离店日期' })
  check_out_date: string;

  @Column({ name: 'nights', type: 'int', unsigned: true, default: 1, comment: '入住晚数' })
  nights: number;

  @Column({ name: 'room_count', type: 'int', unsigned: true, default: 1, comment: '预订间数' })
  room_count: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2, default: 0, comment: '订单总价' })
  total_price: number;

  @Index()
  @Column({ name: 'status', type: 'tinyint', default: 0, comment: '订单状态 0待支付1已支付2已确认3入住中4已完成5已取消6退款中7已退款' })
  status: number;

  @Column({ name: 'contact_name', type: 'varchar', length: 50, comment: '入住联系人姓名' })
  contact_name: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20, comment: '入住联系人电话' })
  contact_phone: string;

  @Column({ name: 'guest_count', type: 'tinyint', unsigned: true, default: 1, comment: '入住人数' })
  guest_count: number;

  @Column({ name: 'check_in_code', type: 'varchar', length: 16, nullable: true, comment: '入住核销码', unique: true })
  check_in_code: string;

  @Column({ name: 'check_in_time', type: 'datetime', nullable: true, comment: '实际核销时间' })
  check_in_time: Date;

  @Column({ name: 'cancel_reason', type: 'varchar', length: 500, nullable: true, comment: '取消原因' })
  cancel_reason: string;

  @Column({ name: 'cancel_time', type: 'datetime', nullable: true, comment: '取消时间' })
  cancel_time: Date;

  @Column({ name: 'cancel_status', type: 'tinyint', nullable: true, comment: '退改状态 0无1部分2全额3拒绝' })
  cancel_status: number;

  @Column({ name: 'refund_amount', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '退款金额' })
  refund_amount: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', comment: '更新时间' })
  updated_at: Date;

  @Index()
  @Column({ name: 'is_deleted', type: 'tinyint', width: 1, default: 0, comment: '软删除' })
  is_deleted: number;
}
