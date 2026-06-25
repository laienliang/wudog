import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('miao_village')
export class MiaoVillageEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 128, comment: '苗寨名称' })
  name: string;

  @Column({ type: 'text', nullable: true, comment: '苗寨简介' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '详细地址' })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true, comment: '经度' })
  longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true, comment: '纬度' })
  latitude: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'cover_image', comment: '封面图URL' })
  coverImage: string;

  @Column({ type: 'text', nullable: true, comment: '图片列表(JSON数组)' })
  images: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'ticket_price', comment: '门票价格' })
  ticketPrice: number;

  @Column({ type: 'varchar', length: 128, nullable: true, name: 'open_time', comment: '开放时间' })
  openTime: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态:0下架 1上架' })
  status: number;
}
