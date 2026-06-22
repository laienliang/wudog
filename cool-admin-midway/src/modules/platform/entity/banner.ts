import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 轮播图
 */
@Entity('platform_banner')
export class PlatformBannerEntity extends BaseEntity {
  @Column({ comment: '标题', length: 100 })
  title: string;

  @Column({ comment: '图片URL', length: 500 })
  imageUrl: string;

  @Column({ comment: '跳转链接', length: 500, nullable: true })
  linkUrl: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态 0=停用 1=启用', default: 1 })
  status: number;
}
