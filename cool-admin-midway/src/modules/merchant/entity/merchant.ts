import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('merchant')
export class MerchantEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '关联用户ID', type: 'int', nullable: true })
  userId: number;

  @Column({ comment: '所属模块 1=衣 2=食 3=住 4=行', type: 'tinyint' })
  moduleType: number;

  @Column({ comment: '店铺名称', length: 100 })
  shopName: string;

  @Column({ comment: '联系人', length: 50, nullable: true })
  contactName: string;

  @Column({ comment: '联系电话', length: 20, nullable: true })
  contactPhone: string;

  @Column({ comment: '状态 0=禁用 1=正常', default: 1 })
  status: number;
}
