import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_food_product')
export class FoodProduct extends BaseEntity {
  @Column({ name: 'merchant_id' })
  @Column({ name: 'category_id', nullable: true, comment: '农产品分类ID' })
  categoryId: number;
  merchantId: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'main_image', type: 'varchar', length: 500 })
  mainImage: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '单位' })
  unit: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态：0下架 1上架' })
  status: number;
}
