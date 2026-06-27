import {
  Entity, Column, Index, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'bigint', unsigned: true, comment: '订单ID' })
  order_id: number;

  @Index()
  @Column({ type: 'bigint', unsigned: true, comment: '用户ID' })
  user_id: number;

  @Index()
  @Column({ type: 'bigint', unsigned: true, comment: '民宿ID' })
  homestay_id: number;

  @Index()
  @Column({ type: 'tinyint', unsigned: true, default: 5, comment: '评分 1-5' })
  rating: number;

  @Column({ type: 'text', nullable: true, comment: '评价内容' })
  content: string;

  @Column({ type: 'json', nullable: true, comment: '评价图片' })
  images: string[];

  @Column({ type: 'tinyint', default: 1, comment: '状态: 1=显示 0=隐藏' })
  status: number;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间' })
  updated_at: Date;

  @Index()
  @Column({ type: 'tinyint', width: 1, default: 0, comment: '软删除' })
  is_deleted: number;
}
