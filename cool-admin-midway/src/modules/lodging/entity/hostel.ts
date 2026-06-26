import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('lodging_hostel')
export class LodgingHostelEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商家ID', type: 'int', nullable: true })
  merchantId: number;

  @Column({ comment: '民宿名称', length: 100 })
  name: string;

  @Column({ comment: '地址', length: 200 })
  address: string;

  @Column({ comment: '主图', length: 500, nullable: true })
  mainImage: string;

  @Column({ comment: '图片列表', type: 'json', nullable: true })
  images: string[];

  @Column({ comment: '介绍', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '评分', type: 'decimal', precision: 3, scale: 2, default: 5.00 })
  rating: number;

  @Column({ comment: '风格标签', length: 200, nullable: true })
  styleTags: string;

  @Column({ comment: '设施标签', length: 200, nullable: true })
  facilityTags: string;

  @Column({ comment: '状态 0=停业 1=营业', default: 1 })
  status: number;
}
