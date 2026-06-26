import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

// 农产品订单明细
@Entity('order_food_product')
export class OrderFoodProductEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '农产品ID', type: 'int' })
  goodsId: number;

  @Column({ comment: '商品标题', length: 100 })
  goodsTitle: string;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({ comment: '单价', type: 'decimal', precision: 10, scale: 2 })
  price: number;
}

// 餐位预订订单
@Entity('order_food_booking')
export class OrderFoodBookingEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '餐厅ID', type: 'int' })
  restaurantId: number;

  @Column({ comment: '餐厅名称', length: 100 })
  restaurantName: string;

  @Column({ comment: '预订日期', type: 'date' })
  bookingDate: Date;

  @Column({ comment: '时段ID', type: 'int' })
  timeSlotId: number;

  @Column({ comment: '人数', default: 1 })
  personCount: number;

  @Column({ comment: '总金额', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ comment: '预订人姓名', length: 50 })
  contactName: string;

  @Column({ comment: '联系电话', length: 20 })
  contactPhone: string;

  @Column({ comment: '备注', length: 200, nullable: true })
  remark: string;
}
