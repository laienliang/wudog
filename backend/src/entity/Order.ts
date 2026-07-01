import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('product_order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, unique: true })
  order_no: string;

  @Column()
  product_id: number;

  @Column({ nullable: true })
  sku_id: number;

  @Column({ length: 100 })
  product_name: string;

  @Column({ length: 100, nullable: true })
  spec_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ length: 50 })
  receiver_name: string;

  @Column({ length: 20 })
  receiver_phone: string;

  @Column({ length: 500 })
  receiver_address: string;

  @Column({ length: 20, nullable: true, comment: 'wechat/alipay/cod' })
  payment_method: string;

  @Column({ default: 0 })
  user_id: number;

  @Column({ default: 0, comment: '0待处理 1已确认 2已发货 3已完成 4已取消' })
  status: number;

  @Column({ default: 0, comment: '0无取消请求 1用户已申请取消' })
  cancel_request: number;

  @Column({ default: 0, comment: '0无 1取消 2退货' })
  cancel_type: number;

  @Column({ default: 1, comment: '1用户未读状态变更 0已读' })
  status_read: number;

  @Column({ default: 0 })
  is_deleted: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
