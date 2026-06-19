import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'merchant_application', comment: '商家入驻申请表' })
export class MerchantApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true, comment: '申请人用户ID' })
  user_id: number;

  @Column({ type: 'varchar', length: 50, comment: '申请人姓名' })
  applicant_name: string;

  @Column({ type: 'varchar', length: 20, comment: '申请人电话' })
  applicant_phone: string;

  @Column({ type: 'varchar', length: 100, comment: '店铺名称' })
  shop_name: string;

  @Column({ type: 'varchar', length: 50, comment: '申请模块：clothing/food/stay/travel' })
  module_type: string;

  @Column({ type: 'text', nullable: true, comment: '申请说明' })
  description: string;

  @Column({ type: 'json', nullable: true, comment: '资质材料（图片URL数组）' })
  materials: any;

  @Column({ type: 'varchar', length: 20, default: 'pending', comment: '审核状态：pending/approved/rejected' })
  status: string;

  @Column({ type: 'int', nullable: true, comment: '审核人ID' })
  reviewer_id: number;

  @Column({ type: 'datetime', nullable: true, comment: '审核时间' })
  review_time: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '驳回原因' })
  reject_reason: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '软删除标记' })
  is_deleted: number;
}
