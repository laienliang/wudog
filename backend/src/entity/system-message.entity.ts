import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'system_message', comment: '系统消息表' })
export class SystemMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true, comment: '接收用户ID（NULL表示群发）' })
  user_id: number;

  @Column({ type: 'varchar', length: 30, comment: '消息类型：system/order/payment/refund/interaction' })
  message_type: string;

  @Column({ type: 'varchar', length: 200, comment: '消息标题' })
  title: string;

  @Column({ type: 'text', nullable: true, comment: '消息内容' })
  content: string;

  @Column({ type: 'tinyint', default: 0, comment: '已读状态：0-未读 1-已读' })
  is_read: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '软删除标记' })
  is_deleted: number;
}
