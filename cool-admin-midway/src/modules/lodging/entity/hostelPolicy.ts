import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('lodging_hostel_policy')
export class LodgingHostelPolicyEntity extends BaseEntity {
  @Index()
  @Column({ comment: '民宿ID', type: 'int' })
  hostelId: number;

  @Column({ comment: '入住时间', length: 20, default: '14:00' })
  checkInTime: string;

  @Column({ comment: '离店时间', length: 20, default: '12:00' })
  checkOutTime: string;

  @Column({ comment: '宠物政策', length: 50, nullable: true })
  petPolicy: string;

  @Column({ comment: '是否含早 0=否 1=是', default: 0 })
  includeBreakfast: number;

  @Column({ comment: '押金金额', type: 'decimal', precision: 10, scale: 2, nullable: true })
  deposit: number;
}
