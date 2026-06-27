import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('restaurant_bookings')
export class RestaurantBooking {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'restaurant_id' }) restaurantId: number;

  @Column({ name: 'user_id' }) userId: number;

  @Column({ name: 'order_id', nullable: true }) orderId: number;

  @Column({ name: 'booking_date', type: 'date' }) bookingDate: string;

  @Column({ name: 'slot_id' }) slotId: number;

  @Column({ name: 'guest_count', type: 'int' }) guestCount: number;

  @Column({ name: 'contact_name', length: 50 }) contactName: string;

  @Column({ name: 'contact_phone', length: 20 }) contactPhone: string;

  @Column({ length: 500, nullable: true }) remark: string;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING }) status: BookingStatus;

  @Column({ name: 'merchant_remark', length: 500, nullable: true }) merchantRemark: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
