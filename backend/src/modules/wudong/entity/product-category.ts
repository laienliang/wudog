import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

/**
 * 商品分类
 */
@Entity('product_category')
export class WudongProductCategoryEntity extends BaseEntity {
  @Index()
  @Column({ comment: '分类名称', length: 100 })
  name: string;

  @Column({ comment: '排序值', default: 0 })
  sortOrder: number;

  @Column({ comment: '状态 0-停用 1-启用', default: 1 })
  status: number;

  @Column({ comment: '备注', nullable: true, length: 255 })
  remark: string;

  @Index()
  @Column({ comment: '软删除 0-否 1-是', default: 0 })
  deleted: number;
}
