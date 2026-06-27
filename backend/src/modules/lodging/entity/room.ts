import {
  Entity, Column, Index, ManyToOne, OneToMany,
  JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Homestay } from './homestay';
import { Calendar } from './calendar';

@Entity('room')
export class Room {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Index()
  @Column({ name: 'homestay_id', type: 'bigint', unsigned: true, comment: '所属民宿ID' })
  homestay_id: number;

  @Column({ name: 'room_name', type: 'varchar', length: 100, comment: '房型名称' })
  name: string;

  @Column({ name: 'bed_type', type: 'varchar', length: 50, nullable: true, comment: '床型' })
  bed_type: string;

  @Column({ name: 'area', type: 'int', nullable: true, comment: '面积(平方米)' })
  area: number;

  @Column({ name: 'max_people', type: 'int', default: 2, comment: '最大可住人数' })
  max_guests: number;

  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2, default: 0, comment: '基础价格(元/晚)' })
  base_price: number;

  @Column({ name: 'images', type: 'json', nullable: true, comment: '房型图片' })
  images: string[];

  @Column({ name: 'facility', type: 'json', nullable: true, comment: '房型设施' })
  facilities: string[];

  @Column({ name: 'description', type: 'text', nullable: true, comment: '房型描述' })
  description: string;

  @Column({ name: 'stock', type: 'int', default: 5, comment: '总库存' })
  default_stock: number;

  @Index()
  @Column({ name: 'status', type: 'tinyint', default: 1, comment: '状态: 1=启用 0=禁用' })
  status: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', comment: '更新时间' })
  updated_at: Date;

  @Index()
  @Column({ name: 'is_deleted', type: 'tinyint', width: 1, default: 0, comment: '软删除' })
  is_deleted: number;

  @ManyToOne(() => Homestay, (h) => h.rooms)
  @JoinColumn({ name: 'homestay_id' })
  homestay: Homestay;

  @OneToMany(() => Calendar, (c) => c.room)
  calendars: Calendar[];
}
