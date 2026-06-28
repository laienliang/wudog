import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

/**
 * 收藏
 */
@Entity('favorite')
@Index('idx_favorite_user_product_unique', ['userId', 'productId'], {
  unique: true,
})
export class WudongFavoriteEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '商品ID' })
  productId: number;

  @Index()
  @Column({ comment: '软删除 0-否 1-是', default: 0 })
  deleted: number;
}
