import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

/**
 * 商品图片
 */
@Entity('product_image')
export class WudongProductImageEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商品ID' })
  productId: number;

  @Column({ comment: '图片地址', length: 500 })
  url: string;

  @Column({ comment: '是否主图 0-否 1-是', default: 0 })
  isMain: number;

  @Column({ comment: '排序值', default: 0 })
  sortOrder: number;

  @Index()
  @Column({ comment: '软删除 0-否 1-是', default: 0 })
  deleted: number;
}
