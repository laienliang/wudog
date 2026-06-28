import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

/**
 * 商品
 */
@Entity('product')
export class WudongProductEntity extends BaseEntity {
  @Index()
  @Column({ comment: '分类ID' })
  categoryId: number;

  @Index()
  @Column({ comment: '商品标题', length: 120 })
  title: string;

  @Column({ comment: '副标题', nullable: true, length: 255 })
  subtitle: string;

  @Column({ comment: '商品简介', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '工艺介绍', type: 'text', nullable: true })
  craftIntro: string;

  @Column({ comment: '传承人姓名', nullable: true, length: 100 })
  inheritorName: string;

  @Column({ comment: '传承人介绍', type: 'text', nullable: true })
  inheritorIntro: string;

  @Column({
    comment: '最低售价',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  minPrice: number;

  @Column({
    comment: '最高售价',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  maxPrice: number;

  @Index()
  @Column({ comment: '状态 0-下架 1-上架', default: 0 })
  status: number;

  @Column({ comment: '排序值', default: 0 })
  sortOrder: number;

  @Index()
  @Column({ comment: '软删除 0-否 1-是', default: 0 })
  deleted: number;
}
