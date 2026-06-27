import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum FarmProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  REMOVED = 'removed',
}

@Entity('farm_products')
export class FarmProduct {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'category_id' }) categoryId: number;

  @Column({ name: 'merchant_id', nullable: true }) merchantId: number;

  @Column({ length: 100 }) name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) price: number;

  @Column({ type: 'int', default: 0 }) stock: number;

  @Column({ type: 'int', default: 0 }) sales: number;

  @Column({ name: 'main_image', length: 500, nullable: true }) mainImage: string;

  @Column({ type: 'text', nullable: true }) detail: string;

  @Column({ length: 100, nullable: true }) origin: string;

  @Column({ name: 'shelf_life', length: 50, nullable: true }) shelfLife: string;

  @Column({ name: 'storage_method', length: 100, nullable: true }) storageMethod: string;

  @Column({ length: 100, nullable: true }) spec: string;

  @Column({ type: 'enum', enum: FarmProductStatus, default: FarmProductStatus.DRAFT }) status: FarmProductStatus;

  @Column({ name: 'avg_rating', type: 'decimal', precision: 2, scale: 1, nullable: true }) avgRating: number;

  @Column({ name: 'review_count', type: 'int', default: 0 }) reviewCount: number;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
