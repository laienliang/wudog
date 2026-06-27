import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 100 }) name: string;

  @Column({ name: 'merchant_id', nullable: true }) merchantId: number;

  @Column({ length: 200, nullable: true }) address: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true }) latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true }) longitude: number;

  @Column({ name: 'business_hours', length: 100, nullable: true }) businessHours: string;

  @Column({ type: 'int', default: 0 }) capacity: number;

  @Column({ type: 'text', nullable: true }) intro: string;

  @Column({ name: 'main_image', length: 500, nullable: true }) mainImage: string;

  @Column({ type: 'json', nullable: true }) images: string[];

  @Column({ name: 'avg_rating', type: 'decimal', precision: 2, scale: 1, nullable: true }) avgRating: number;

  @Column({ type: 'tinyint', default: 1 }) status: number;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
