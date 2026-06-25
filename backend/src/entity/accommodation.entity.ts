import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('accommodation')
export class AccommodationEntity extends BaseEntity {
  @Column({ type: 'bigint', unsigned: true, name: 'village_id', comment: '所属苗寨ID' })
  villageId: number;

  @Column({ type: 'varchar', length: 128, comment: '民宿名称' })
  name: string;

  @Column({ type: 'varchar', length: 32, default: 'minsute', comment: '类型:minsute民宿 inn客栈 hotel酒店' })
  type: string;

  @Column({ type: 'text', nullable: true, comment: '民宿详情' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '详细地址' })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true, comment: '经度' })
  longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true, comment: '纬度' })
  latitude: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'cover_image', comment: '封面图URL' })
  coverImage: string;

  @Column({ type: 'text', nullable: true, comment: '图片列表(JSON)' })
  images: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'lowest_price', default: 0, comment: '最低价格' })
  lowestPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'highest_price', comment: '最高价格' })
  highestPrice: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0, comment: '评分' })
  rating: number;

  @Column({ type: 'int', name: 'review_count', default: 0, comment: '评价数' })
  reviewCount: number;

  @Column({ type: 'text', nullable: true, comment: '设施(JSON)' })
  facilities: string;

  @Column({ type: 'text', nullable: true, name: 'house_rules', comment: '入住须知' })
  houseRules: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态:0下架 1上架' })
  status: number;
}
