import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('order_travel')
export class OrderTravelEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '类型 1=门票 2=路线', type: 'tinyint' })
  itemType: number;

  @Column({ comment: '关联ID(景区ID或路线ID)', type: 'int' })
  targetId: number;

  @Column({ comment: '标题', length: 100 })
  title: string;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({ comment: '单价', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '使用日期', type: 'date', nullable: true })
  useDate: Date;

  @Column({ comment: '游客姓名', length: 50 })
  visitorName: string;

  @Column({ comment: '联系电话', length: 20 })
  visitorPhone: string;
}
