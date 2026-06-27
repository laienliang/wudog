import {
  Entity, Column, Index, OneToMany,
  PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Room } from './room';
import { HouseRule } from './house-rule';

@Entity('homestay')
export class Homestay {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'merchant_id', type: 'bigint', unsigned: true, nullable: true, comment: '商家用户ID' })
  merchant_id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, comment: '民宿名称' })
  name: string;

  @Column({ name: 'address', type: 'varchar', length: 200, nullable: true, comment: '详细地址' })
  address: string;

  @Column({ name: 'lng', type: 'decimal', precision: 10, scale: 6, nullable: true, comment: '经度' })
  longitude: number;

  @Column({ name: 'lat', type: 'decimal', precision: 10, scale: 6, nullable: true, comment: '纬度' })
  latitude: number;

  @Column({ name: 'style_tags', type: 'varchar', length: 200, nullable: true, comment: '风格标签' })
  style_tags: string;

  @Column({ name: 'facility_tags', type: 'varchar', length: 200, nullable: true, comment: '设施标签' })
  facilities: string;

  @Column({ name: 'cover_image', type: 'varchar', length: 255, nullable: true, comment: '封面图URL' })
  cover_image: string;

  @Column({ name: 'description', type: 'text', nullable: true, comment: '民宿简介' })
  description: string;

  @Column({ name: 'min_price', type: 'decimal', precision: 10, scale: 2, default: 0, comment: '最低价格' })
  min_price: number;

  @Column({ name: 'rating', type: 'decimal', precision: 2, scale: 1, default: 5.0, comment: '平均评分' })
  rating: number;

  @Column({ name: 'review_count', type: 'int', unsigned: true, default: 0, comment: '评价数量' })
  review_count: number;

  @Index()
  @Column({ name: 'status', type: 'tinyint', default: 1, comment: '状态' })
  status: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', comment: '更新时间' })
  updated_at: Date;

  @Index()
  @Column({ name: 'is_deleted', type: 'tinyint', width: 1, default: 0, comment: '软删除' })
  is_deleted: number;

  @OneToMany(() => Room, (room) => room.homestay)
  rooms: Room[];

  @OneToMany(() => HouseRule, (rule) => rule.homestay)
  house_rules: HouseRule[];
}
