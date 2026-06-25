import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('review')
export class ReviewEntity extends BaseEntity {
  @Column({ type: 'bigint', unsigned: true, name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'accommodation_id', comment: '住宿ID' })
  accommodationId: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'order_id', comment: '订单ID' })
  orderId: number;

  @Column({ type: 'tinyint', default: 5, comment: '评分1-5' })
  rating: number;

  @Column({ type: 'text', nullable: true, comment: '评价内容' })
  content: string;

  @Column({ type: 'text', nullable: true, comment: '评价图片(JSON)' })
  images: string;

  @Column({ type: 'tinyint', name: 'is_anonymous', default: 0, comment: '是否匿名:0否 1是' })
  isAnonymous: number;

  @Column({ type: 'tinyint', default: 1, comment: '状态:0隐藏 1显示' })
  status: number;
}
