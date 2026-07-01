import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 50, comment: '收货人' })
  name: string;

  @Column({ length: 20, comment: '手机号' })
  phone: string;

  @Column({ length: 50, comment: '省份' })
  province: string;

  @Column({ length: 50, comment: '城市' })
  city: string;

  @Column({ length: 50, comment: '区县' })
  district: string;

  @Column({ length: 50, nullable: true, comment: '镇/街道' })
  town: string;

  @Column({ length: 200, comment: '详细地址' })
  detail: string;

  @Column({ default: 0, comment: '是否默认地址' })
  is_default: number;

  @Column({ default: 0 })
  is_deleted: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
