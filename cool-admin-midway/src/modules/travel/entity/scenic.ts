import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('travel_scenic')
export class TravelScenicEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商家ID', type: 'int', nullable: true })
  merchantId: number;

  @Column({ comment: '景区名称', length: 100 })
  name: string;

  @Column({ comment: '地址', length: 200 })
  address: string;

  @Column({ comment: '主图', length: 500, nullable: true })
  mainImage: string;

  @Column({ comment: '介绍', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '开放时间', length: 100, nullable: true })
  openHours: string;

  @Column({ comment: '评分', type: 'decimal', precision: 3, scale: 2, default: 5.00 })
  rating: number;

  @Column({ comment: '状态 0=关闭 1=开放', default: 1 })
  status: number;
}
