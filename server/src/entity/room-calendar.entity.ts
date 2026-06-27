import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum CalendarStatus {
  AVAILABLE = 'available',
  SOLD_OUT = 'sold_out',
  CLOSED = 'closed',
}

@Entity('room_calendars')
export class RoomCalendar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'room_type_id', type: 'int', comment: '房型ID' })
  roomTypeId: number;

  @Column({ type: 'date', comment: '日期' })
  date: string;

  @Column({ name: 'available_rooms', type: 'int', default: 0, comment: '可用房间数' })
  availableRooms: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '当日价格' })
  price: number;

  @Column({ type: 'enum', enum: CalendarStatus, default: CalendarStatus.AVAILABLE })
  status: CalendarStatus;
}
