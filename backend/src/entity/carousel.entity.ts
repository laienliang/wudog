import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'carousel', comment: '首页轮播图表' })
export class Carousel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, comment: '标题' })
  title: string;

  @Column({ type: 'varchar', length: 500, comment: '图片URL' })
  image_url: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '跳转链接' })
  link_url: string;

  @Column({ type: 'int', default: 0, comment: '排序（越大越靠前）' })
  sort_order: number;

  @Column({ type: 'tinyint', default: 1, comment: '状态：1-上架 0-下架' })
  status: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '软删除标记' })
  is_deleted: number;
}
