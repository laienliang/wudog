import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 推荐位
 */
@Entity('platform_recommend')
export class PlatformRecommendEntity extends BaseEntity {
  @Column({ comment: '推荐位名称', length: 50 })
  name: string;

  @Column({ comment: '内容类型 1=商品 2=餐厅 3=民宿 4=景区 5=路线 6=游记', type: 'tinyint' })
  contentType: number;

  @Column({ comment: '关联内容ID', type: 'int' })
  contentId: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;
}
