import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_clothing_sku')
export class Sku extends BaseEntity {
  @Column({ name: 'product_id', type: 'bigint', unsigned: true, comment: '商品ID' })
  productId: number;

  @Column({ type: 'varchar', length: 100, comment: 'SKU名称（如：红色-S）' })
  name: string;

  @Column({ type: 'json', nullable: true, comment: '规格属性（如：{"颜色":"红色","尺寸":"S"}）' })
  attrs: object;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: 'SKU售价' })
  price: number;

  @Column({ type: 'int', default: 0, comment: '库存' })
  stock: number;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: 'SKU图片' })
  image: string;
}
