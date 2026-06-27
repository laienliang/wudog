import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('restaurant_dishes')
export class RestaurantDish {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'restaurant_id' }) restaurantId: number;

  @Column({ length: 100 }) name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) price: number;

  @Column({ length: 500, nullable: true }) image: string;

  @Column({ length: 500, nullable: true }) intro: string;

  @Column({ name: 'is_signature', type: 'tinyint', default: 0 }) isSignature: number;

  @Column({ type: 'tinyint', default: 1 }) status: number;

  @Column({ name: 'sort_order', type: 'int', default: 0 }) sortOrder: number;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
