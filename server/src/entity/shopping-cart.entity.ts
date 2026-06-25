import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('shopping_cart')
@Unique(['user_id', 'product_id', 'sku_id'])
export class ShoppingCart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  product_id: number;

  @Column({ nullable: true })
  sku_id: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ length: 20, default: 'module1' })
  source_module: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
