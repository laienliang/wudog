import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ length: 500 })
  url: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
