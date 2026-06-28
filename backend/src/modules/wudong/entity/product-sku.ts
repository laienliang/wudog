import { Column, Entity, Index } from 'typeorm';
import { BaseEntity, transformerJson } from '../../base/entity/base';

/**
 * 商品 SKU
 */
@Entity('product_sku')
export class WudongProductSkuEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商品ID' })
  productId: number;

  @Column({ comment: 'SKU编码', nullable: true, length: 64 })
  code: string;

  @Column({ comment: 'SKU名称', length: 120 })
  name: string;

  @Column({
    comment: '规格描述',
    nullable: true,
    type: 'json',
    transformer: transformerJson,
  })
  specs: Record<string, any> | string[];

  @Column({
    comment: '销售价',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  salePrice: number;

  @Column({
    comment: '原价',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  originalPrice: number;

  @Column({ comment: '库存', default: 0 })
  stock: number;

  @Column({ comment: '状态 0-停用 1-启用', default: 1 })
  status: number;

  @Column({ comment: '排序值', default: 0 })
  sortOrder: number;

  @Index()
  @Column({ comment: '软删除 0-否 1-是', default: 0 })
  deleted: number;
}
