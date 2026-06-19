import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'financial_record', comment: '财务记录表' })
export class FinancialRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true, comment: '订单ID' })
  order_id: number;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '订单编号' })
  order_no: string;

  @Column({ type: 'int', comment: '商家ID' })
  merchant_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '订单金额' })
  order_amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 4, default: 0, comment: '平台抽佣比例' })
  commission_rate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '平台抽佣金额' })
  commission_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '商家收入' })
  merchant_income: number;

  @Column({ type: 'varchar', length: 20, default: 'pending', comment: '结算状态：pending/settled' })
  settlement_status: string;

  @Column({ type: 'datetime', nullable: true, comment: '结算时间' })
  settled_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '软删除标记' })
  is_deleted: number;
}
