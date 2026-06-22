import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

@Entity('clothing_category')
export class ClothingCategoryEntity extends BaseEntity {
  @Column({ comment: '父分类ID，0=顶级', type: 'int', default: 0 })
  parentId: number;

  @Column({ comment: '分类名称', length: 50 })
  name: string;

  @Column({ comment: '图标', length: 200, nullable: true })
  icon: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态 0=停用 1=启用', default: 1 })
  status: number;
}
