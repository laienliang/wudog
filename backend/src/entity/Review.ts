import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  product_id: number;

  @Column()
  order_id: number;

  @Column({ default: 5, comment: '1-5星' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ length: 500, nullable: true })
  images: string;

  @Column({ type: 'text', nullable: true, comment: '管理员回复' })
  reply: string;

  @Column({ default: 0, comment: '0未读回复 1已读' })
  reply_read: number;

  @Column({ default: 0 })
  is_deleted: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
