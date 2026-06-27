import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('farm_product_categories')
export class FarmProductCategory {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 50 }) name: string;

  @Column({ length: 500, nullable: true }) icon: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 }) sortOrder: number;

  @Column({ type: 'tinyint', default: 1 }) status: number;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
