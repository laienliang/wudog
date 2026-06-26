import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('travel_route')
export class TravelRouteEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商家ID', type: 'int', nullable: true })
  merchantId: number;

  @Column({ comment: '路线标题', length: 100 })
  title: string;

  @Column({ comment: '主图', length: 500, nullable: true })
  mainImage: string;

  @Column({ comment: '行程天数', type: 'tinyint' })
  days: number;

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '包含项目', type: 'text', nullable: true })
  includes: string;

  @Column({ comment: '注意事项', type: 'text', nullable: true })
  notes: string;

  @Column({ comment: '详情', type: 'text', nullable: true })
  detailContent: string;

  @Column({ comment: '状态 0=下架 1=上架', default: 1 })
  status: number;
}
