import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('meal_time_slots')
export class MealTimeSlot {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'restaurant_id' }) restaurantId: number;

  @Column({ name: 'slot_name', length: 50 }) slotName: string;

  @Column({ name: 'max_bookings', type: 'int', default: 20 }) maxBookings: number;

  @Column({ type: 'tinyint', default: 1 }) status: number;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
