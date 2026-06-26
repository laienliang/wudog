import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('lodging_room_type')
export class LodgingRoomTypeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '民宿ID', type: 'int' })
  hostelId: number;

  @Column({ comment: '房型名', length: 50 })
  name: string;

  @Column({ comment: '床型', length: 50, nullable: true })
  bedType: string;

  @Column({ comment: '面积(平方米)', type: 'decimal', precision: 5, scale: 1, nullable: true })
  area: number;

  @Column({ comment: '容纳人数', default: 2 })
  capacity: number;

  @Column({ comment: '设施', type: 'text', nullable: true })
  facilities: string;

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '库存(房间数)', default: 5 })
  stock: number;

  @Column({ comment: '主图', length: 500, nullable: true })
  mainImage: string;
}
