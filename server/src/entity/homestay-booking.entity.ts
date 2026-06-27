import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum BookingStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  REFUNDING = 'refunding',
  REFUNDED = 'refunded',
  COMPLETED = 'completed',
}

@Entity('homestay_bookings')
export class HomestayBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id', type: 'int', nullable: true, comment: '关联订单ID' })
  orderId: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'homestay_id', type: 'int', comment: '民宿ID' })
  homestayId: number;

  @Column({ name: 'room_type_id', type: 'int', comment: '房型ID' })
  roomTypeId: number;

  @Column({ name: 'check_in_date', type: 'date', comment: '入住日期' })
  checkInDate: string;

  @Column({ name: 'check_out_date', type: 'date', comment: '离店日期' })
  checkOutDate: string;

  @Column({ type: 'int', comment: '入住晚数' })
  nights: number;

  @Column({ name: 'room_count', type: 'int', default: 1, comment: '房间数' })
  roomCount: number;

  @Column({ name: 'guest_name', type: 'varchar', length: 50 })
  guestName: string;

  @Column({ name: 'guest_phone', type: 'varchar', length: 20 })
  guestPhone: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ name: 'check_in_code', type: 'varchar', length: 20, nullable: true, comment: '入住码' })
  checkInCode: string;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
