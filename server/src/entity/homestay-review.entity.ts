import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('homestay_reviews')
export class HomestayReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'homestay_id', type: 'int', comment: '民宿ID' })
  homestayId: number;

  @Column({ name: 'order_id', type: 'int', nullable: true, comment: '订单ID' })
  orderId: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ type: 'tinyint', comment: '评分 1-5' })
  rating: number;

  @Column({ type: 'text', nullable: true, comment: '评价内容' })
  content: string;

  @Column({ type: 'json', nullable: true, comment: '评价图片' })
  images: string[];

  @Column({ name: 'merchant_reply', type: 'text', nullable: true, comment: '商家回复' })
  merchantReply: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
