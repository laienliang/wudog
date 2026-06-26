import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('travel_ticket_type')
export class TravelTicketTypeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '景区ID', type: 'int' })
  scenicId: number;

  @Column({ comment: '票种名称', length: 50 })
  name: string;

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '库存', default: 0 })
  stock: number;

  @Column({ comment: '有效期规则', length: 100, nullable: true })
  validityRule: string;
}
