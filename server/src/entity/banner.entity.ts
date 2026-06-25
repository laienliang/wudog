import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  title: string;

  @Column({ length: 500 })
  image_url: string;

  @Column({ length: 500, nullable: true })
  link_url: string;

  @Column({ length: 50, default: 'home' })
  position: string;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0 })
  is_deleted: number;
}
