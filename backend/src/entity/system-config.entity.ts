import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'system_config', comment: '系统配置表' })
export class SystemConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, comment: '配置键' })
  config_key: string;

  @Column({ type: 'text', nullable: true, comment: '配置值' })
  config_value: string;

  @Column({ type: 'varchar', length: 20, default: 'string', comment: '值类型：string/number/json/boolean' })
  config_type: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '配置说明' })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '软删除标记' })
  is_deleted: number;
}
