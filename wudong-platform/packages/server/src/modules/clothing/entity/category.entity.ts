import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_clothing_category')
export class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 100, comment: '分类名称' })
  name: string;

  @Column({ name: 'parent_id', type: 'bigint', unsigned: true, default: 0, comment: '父分类ID（0=顶级）' })
  parentId: number;

  @Column({ name: 'sort_order', type: 'int', nullable: true, default: 0, comment: '排序序号' })
  sortOrder: number;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '图标URL' })
  icon: string;
}
