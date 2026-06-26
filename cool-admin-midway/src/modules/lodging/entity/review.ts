import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('lodging_review')
export class LodgingReviewEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单ID', type: 'int' })
  orderId: number;

  @Index()
  @Column({ comment: '民宿ID', type: 'int' })
  hostelId: number;

  @Index()
  @Column({ comment: '用户ID', type: 'int' })
  userId: number;

  @Column({ comment: '评分', type: 'tinyint' })
  rating: number;

  @Column({ comment: '评价内容', type: 'text', nullable: true })
  content: string;

  @Column({ comment: '图片列表', type: 'json', nullable: true })
  images: string[];

  @Column({ comment: '商家回复', type: 'text', nullable: true })
  reply: string;
}
