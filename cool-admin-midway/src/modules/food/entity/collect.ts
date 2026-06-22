import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('food_collect')
export class FoodCollectEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', type: 'int' })
  userId: number;

  @Column({ comment: '类型 1=餐厅 2=农产品', type: 'tinyint' })
  targetType: number;

  @Index()
  @Column({ comment: '目标ID(餐厅ID或商品ID)', type: 'int' })
  targetId: number;
}
