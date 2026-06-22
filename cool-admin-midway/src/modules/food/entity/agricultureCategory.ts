import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

@Entity('food_agriculture_category')
export class FoodAgricultureCategoryEntity extends BaseEntity {
  @Column({ comment: '父分类ID，0=顶级', type: 'int', default: 0 })
  parentId: number;

  @Column({ comment: '分类名称', length: 50 })
  name: string;

  @Column({ comment: '图标', length: 200, nullable: true })
  icon: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;
}
