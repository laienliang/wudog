import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_community_favorite')
export class Favorite extends BaseEntity {
  @Column({ name: 'user_id' }) userId: number;
  @Column({ name: 'target_type', type: 'varchar', length: 50 }) targetType: string;
  @Column({ name: 'target_id' }) targetId: number;
}
