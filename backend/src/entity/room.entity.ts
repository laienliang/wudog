import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('room')
export class RoomEntity extends BaseEntity {
  @Column({ type: 'bigint', unsigned: true, name: 'accommodation_id', comment: '所属住宿ID' })
  accommodationId: number;

  @Column({ type: 'varchar', length: 128, comment: '房型名称' })
  name: string;

  @Column({ type: 'text', nullable: true, comment: '房型描述' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'cover_image', comment: '封面图URL' })
  coverImage: string;

  @Column({ type: 'text', nullable: true, comment: '图片列表(JSON)' })
  images: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true, comment: '面积(平方米)' })
  area: number;

  @Column({ type: 'int', name: 'max_guests', default: 2, comment: '最大入住人数' })
  maxGuests: number;

  @Column({ type: 'varchar', length: 32, name: 'bed_type', default: '大床房', comment: '床型' })
  bedType: string;

  @Column({ type: 'varchar', length: 32, nullable: true, comment: '楼层' })
  floor: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '价格/晚' })
  price: number;

  @Column({ type: 'int', default: 1, comment: '库存数量' })
  stock: number;

  @Column({ type: 'text', nullable: true, comment: '房间设施(JSON)' })
  facilities: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态:0下架 1上架' })
  status: number;
}
