import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('scenic_spots')
export class ScenicSpot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ name: 'open_time', type: 'varchar', length: 100, nullable: true, comment: '开放时间' })
  openTime: string;

  @Column({ type: 'text', nullable: true, comment: '景区介绍' })
  intro: string;

  @Column({ name: 'main_image', type: 'varchar', length: 500, nullable: true, comment: '主图' })
  mainImage: string;

  @Column({ type: 'json', nullable: true, comment: '图片集' })
  images: string[];

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
