import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('homestays')
export class Homestay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'merchant_id', type: 'int', nullable: true, comment: '商家ID' })
  merchantId: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ name: 'style_tags', type: 'varchar', length: 200, nullable: true, comment: '风格标签 逗号分隔' })
  styleTags: string;

  @Column({ name: 'facility_tags', type: 'varchar', length: 200, nullable: true, comment: '设施标签' })
  facilityTags: string;

  @Column({ name: 'main_image', type: 'varchar', length: 500, nullable: true, comment: '主图' })
  mainImage: string;

  @Column({ type: 'json', nullable: true, comment: '图片集' })
  images: string[];

  @Column({ type: 'text', nullable: true, comment: '民宿介绍' })
  intro: string;

  @Column({ name: 'avg_rating', type: 'decimal', precision: 2, scale: 1, nullable: true, comment: '平均评分' })
  avgRating: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
