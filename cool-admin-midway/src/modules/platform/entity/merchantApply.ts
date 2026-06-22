import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商家入驻申请
 */
@Entity('platform_merchant_apply')
export class PlatformMerchantApplyEntity extends BaseEntity {
  @Index()
  @Column({ comment: '申请人用户ID', type: 'int' })
  userId: number;

  @Column({ comment: '店铺名称', length: 100 })
  shopName: string;

  @Column({ comment: '所属模块 1=衣 2=食 3=住 4=行', type: 'tinyint' })
  moduleType: number;

  @Column({ comment: '联系人', length: 50 })
  contactName: string;

  @Column({ comment: '联系电话', length: 20 })
  contactPhone: string;

  @Column({ comment: '资质材料(JSON)', type: 'text', nullable: true })
  materials: string;

  @Column({ comment: '审核状态 0=待审核 1=通过 2=驳回', default: 0 })
  status: number;

  @Column({ comment: '审核人', length: 50, nullable: true })
  reviewer: string;

  @Column({ comment: '审核时间', type: 'datetime', nullable: true })
  reviewTime: Date;

  @Column({ comment: '驳回原因', length: 200, nullable: true })
  rejectReason: string;
}
