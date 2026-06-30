import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_clothing_review')
export class Review extends BaseEntity {
  @Column({ name: 'product_id', type: 'bigint', unsigned: true, comment: '商品ID' })
  productId: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true, comment: '用户ID' })
  userId: number;

  @Column({ name: 'order_id', type: 'bigint', unsigned: true, comment: '订单ID' })
  orderId: number;

  @Column({ type: 'tinyint', comment: '评分（1-5）' })
  rating: number;

  @Column({ type: 'text', nullable: true, comment: '评价内容' })
  content: string;

  @Column({ type: 'json', nullable: true, comment: '评价图片URL列表' })
  images: object;

  @Column({ type: 'varchar', length: 20, default: 'public', comment: '状态：pending待审 / public公开 / hidden屏蔽' })
  status: string;

  @Column({ type: 'text', nullable: true, comment: '商家回复' })
  reply: string;
}
