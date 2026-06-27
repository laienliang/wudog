import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tour_routes')
export class TourRoute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ name: 'merchant_id', type: 'int', nullable: true, comment: '商家ID' })
  merchantId: number;

  @Column({ type: 'int', default: 1, comment: '行程天数' })
  days: number;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '主题' })
  theme: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '套餐价格' })
  price: number;

  @Column({ name: 'main_image', type: 'varchar', length: 500, nullable: true, comment: '主图' })
  mainImage: string;

  @Column({ type: 'json', nullable: true, comment: '图片集' })
  images: string[];

  @Column({ type: 'text', nullable: true, comment: '路线简介' })
  intro: string;

  @Column({ type: 'text', nullable: true, comment: '包含项目' })
  includes: string;

  @Column({ type: 'text', nullable: true, comment: '不包含项目' })
  excludes: string;

  @Column({ type: 'text', nullable: true, comment: '注意事项' })
  notes: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'int', default: 0, comment: '销量' })
  sales: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
