import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'operation_log', comment: '操作日志表' })
export class OperationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: '操作人ID' })
  operator_id: number;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '操作人姓名' })
  operator_name: string;

  @Column({ type: 'varchar', length: 20, default: 'admin', comment: '操作人类型：admin/merchant/user' })
  operator_type: string;

  @Column({ type: 'varchar', length: 50, comment: '操作类型' })
  action: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '操作对象' })
  target: string;

  @Column({ type: 'int', nullable: true, comment: '操作对象ID' })
  target_id: number;

  @Column({ type: 'text', nullable: true, comment: '操作内容' })
  content: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'IP地址' })
  ip: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '浏览器UA' })
  user_agent: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '软删除标记' })
  is_deleted: number;
}
