import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum ETicketStatus {
  UNUSED = 'unused',
  USED = 'used',
  REFUNDED = 'refunded',
  EXPIRED = 'expired',
}

@Entity('e_tickets')
export class ETicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id', type: 'int', nullable: true, comment: '订单ID' })
  orderId: number;

  @Column({ name: 'ticket_type_id', type: 'int', comment: '票种ID' })
  ticketTypeId: number;

  @Column({ name: 'user_id', type: 'int', comment: '用户ID' })
  userId: number;

  @Column({ name: 'ticket_code', type: 'varchar', length: 32, unique: true, comment: '电子票号' })
  ticketCode: string;

  @Column({ name: 'qr_code_url', type: 'varchar', length: 500, nullable: true, comment: '二维码图片URL' })
  qrCodeUrl: string;

  @Column({ name: 'visit_date', type: 'date', comment: '游玩日期' })
  visitDate: string;

  @Column({ name: 'visitor_name', type: 'varchar', length: 50, comment: '游客姓名' })
  visitorName: string;

  @Column({ name: 'visitor_id_card', type: 'varchar', length: 20, nullable: true, comment: '游客身份证号' })
  visitorIdCard: string;

  @Column({ type: 'int', default: 1, comment: '数量' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '单价' })
  price: number;

  @Column({ type: 'enum', enum: ETicketStatus, default: ETicketStatus.UNUSED })
  status: ETicketStatus;

  @Column({ name: 'used_at', type: 'datetime', nullable: true, comment: '核销时间' })
  usedAt: Date;

  @Column({ name: 'expire_at', type: 'date', nullable: true, comment: '有效期截止' })
  expireAt: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
