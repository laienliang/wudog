import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'message_template', comment: '消息模板表' })
export class MessageTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, comment: '模板编码' })
  code: string;

  @Column({ type: 'varchar', length: 100, comment: '模板名称' })
  name: string;

  @Column({ type: 'varchar', length: 200, comment: '标题模板（含占位符）' })
  title_template: string;

  @Column({ type: 'text', comment: '内容模板（含占位符）' })
  content_template: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态：1-启用 0-禁用' })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '软删除标记' })
  is_deleted: number;
}
