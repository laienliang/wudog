import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_sms_code')
export class SmsCode extends BaseEntity {
  @Column({ type: 'varchar', length: 20, comment: '手机号' })
  phone: string;

  @Column({ type: 'varchar', length: 6, comment: '验证码' })
  code: string;

  @Column({ type: 'tinyint', default: 0, comment: '是否已使用' })
  used: number;

  @Column({ name: 'expire_at', type: 'datetime', nullable: false, comment: '过期时间' })
  expireAt: Date;
}
