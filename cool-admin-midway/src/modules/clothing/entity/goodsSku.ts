import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('clothing_goods_sku')
export class ClothingGoodsSkuEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商品ID', type: 'int' })
  goodsId: number;

  @Column({ comment: '规格名称', length: 100 })
  specName: string;

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '库存', default: 0 })
  stock: number;

  @Column({ comment: '图片', length: 500, nullable: true })
  image: string;
}
