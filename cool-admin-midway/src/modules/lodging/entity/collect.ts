import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('lodging_collect')
export class LodgingCollectEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', type: 'int' })
  userId: number;

  @Index()
  @Column({ comment: '民宿ID', type: 'int' })
  hostelId: number;
}
