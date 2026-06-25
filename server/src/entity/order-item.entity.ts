import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column({ length: 30 })
  item_type: string;

  @Column()
  item_id: number;

  @Column({ length: 200 })
  item_name: string;

  @Column({ length: 500, nullable: true })
  item_image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'json', nullable: true })
  snapshot_json: any;
}
