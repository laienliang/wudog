import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 敏感词
 */
@Entity('platform_sensitive_word')
export class PlatformSensitiveWordEntity extends BaseEntity {
  @Column({ comment: '敏感词', length: 100 })
  word: string;

  @Column({ comment: '类型 1=违禁词 2=广告词 3=辱骂词', default: 1 })
  type: number;
}
