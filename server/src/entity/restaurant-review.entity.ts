import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ReviewTargetType {
  RESTAURANT = 'restaurant',
  DISH = 'dish',
  FARM_PRODUCT = 'farm_product',
}

@Entity('restaurant_reviews')
export class RestaurantReview {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'target_type', type: 'enum', enum: ReviewTargetType }) targetType: ReviewTargetType;

  @Column({ name: 'target_id' }) targetId: number;

  @Column({ name: 'order_id', nullable: true }) orderId: number;

  @Column({ name: 'user_id' }) userId: number;

  @Column({ type: 'tinyint' }) rating: number;

  @Column({ type: 'text', nullable: true }) content: string;

  @Column({ type: 'json', nullable: true }) images: string[];

  @Column({ name: 'merchant_reply', type: 'text', nullable: true }) merchantReply: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
