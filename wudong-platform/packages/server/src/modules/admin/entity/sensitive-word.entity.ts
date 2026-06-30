import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_sensitive_word')
export class SensitiveWord extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  word: string;

  @Column({ type: 'tinyint', default: 1, comment: '0禁用 1启用' })
  status: number;
}
