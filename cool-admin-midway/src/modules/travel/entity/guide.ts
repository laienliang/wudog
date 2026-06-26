import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

@Entity('travel_guide')
export class TravelGuideEntity extends BaseEntity {
  @Column({ comment: '标题', length: 100 })
  title: string;

  @Column({ comment: '出发地', length: 50 })
  departure: string;

  @Column({ comment: '交通方式', length: 50 })
  transport: string;

  @Column({ comment: '时长', length: 50 })
  duration: string;

  @Column({ comment: '费用', length: 50 })
  cost: string;

  @Column({ comment: '详细说明', type: 'text' })
  content: string;

  @Column({ comment: '攻略图', type: 'json', nullable: true })
  images: string[];
}
