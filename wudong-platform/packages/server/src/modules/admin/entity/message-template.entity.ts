import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_message_template')
export class MessageTemplate extends BaseEntity {
  @Column({ type: 'varchar', length: 100 }) name: string;
  @Column({ type: 'varchar', length: 50, comment: '订单/支付/退款等' }) type: string;
  @Column({ type: 'varchar', length: 200 }) title: string;
  @Column({ type: 'text', nullable: true }) content: string;
  @Column({ type: 'tinyint', default: 1, comment: '0禁用 1启用' }) status: number;
}
