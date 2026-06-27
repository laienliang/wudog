import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 200, nullable: true })
  subtitle: string;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'merchant_id', nullable: true })
  merchantId: number;

  @Column({ name: 'main_image', length: 500, nullable: true })
  mainImage: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'market_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  marketPrice: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  sales: number;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @Column({ name: 'craft_intro', length: 1000, nullable: true })
  craftIntro: string;

  @Column({ name: 'inheritor_name', length: 50, nullable: true })
  inheritorName: string;

  @Column({ type: 'enum', enum: ['draft', 'reviewing', 'published', 'rejected', 'removed'], default: 'draft' })
  status: string;

  @Column({ name: 'review_count', default: 0 })
  reviewCount: number;

  @Column({ name: 'avg_rating', type: 'decimal', precision: 2, scale: 1, nullable: true })
  avgRating: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
