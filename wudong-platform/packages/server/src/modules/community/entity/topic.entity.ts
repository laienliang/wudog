import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_community_topic')
export class Topic extends BaseEntity {
  @Column({ type: 'varchar', length: 100 }) name: string;

  @Column({ type: 'varchar', length: 500, nullable: true }) icon: string;

  @Column({ name: 'sort_order', nullable: true }) sortOrder: number;
}
