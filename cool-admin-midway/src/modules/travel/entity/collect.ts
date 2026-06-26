import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('travel_collect')
export class TravelCollectEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', type: 'int' })
  userId: number;

  @Column({ comment: '类型 1=景区 2=路线', type: 'tinyint' })
  targetType: number;

  @Index()
  @Column({ comment: '目标ID', type: 'int' })
  targetId: number;
}
