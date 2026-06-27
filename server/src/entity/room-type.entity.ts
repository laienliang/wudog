import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('room_types')
export class RoomType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'homestay_id', type: 'int', comment: '民宿ID' })
  homestayId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'bed_type', type: 'varchar', length: 50, nullable: true, comment: '床型' })
  bedType: string;

  @Column({ type: 'int', nullable: true, comment: '面积(㎡)' })
  area: number;

  @Column({ type: 'int', default: 2, comment: '容纳人数' })
  capacity: number;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '房间设施' })
  facilities: string;

  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2, comment: '基础价格/晚' })
  basePrice: number;

  @Column({ name: 'total_rooms', type: 'int', default: 1, comment: '该房型总房间数' })
  totalRooms: number;

  @Column({ name: 'main_image', type: 'varchar', length: 500, nullable: true, comment: '房型图' })
  mainImage: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
