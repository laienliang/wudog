import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('merchant_applications')
export class MerchantApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 100 })
  shop_name: string;

  @Column({ length: 20 })
  module: string;

  @Column({ length: 50 })
  business_type: string;

  @Column({ length: 50 })
  contact_name: string;

  @Column({ length: 20 })
  contact_phone: string;

  @Column({ type: 'json', nullable: true })
  materials: any;

  @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: string;

  @Column({ length: 500, nullable: true })
  review_remark: string;

  @Column({ nullable: true })
  reviewer_id: number;

  @Column({ type: 'datetime', nullable: true })
  reviewed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
