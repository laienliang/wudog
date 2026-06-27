import { Repository } from 'typeorm';
import { ETicket, ETicketStatus } from '../entity/e-ticket.entity';

export class ETicketService {
  private validTransitions: Record<string, string[]> = {
    unused: ['used', 'refunded'],
    used: [],
    refunded: [],
    expired: [],
  };

  constructor(private repo: Repository<ETicket>) {}

  async list(userId: number) {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async listAll(query: { status?: string; spot_id?: number; page?: number; pageSize?: number }) {
    const { status, page = 1, pageSize = 50 } = query;
    const where: any = {};
    if (status) where.status = status;

    const [list, total] = await this.repo.findAndCount({
      where, order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize, take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async create(userId: number, data: {
    ticket_type_id: number; visit_date: string; visitor_name: string;
    visitor_id_card?: string; quantity?: number; price: number;
  }) {
    const ticket = this.repo.create({
      userId,
      ticketTypeId: data.ticket_type_id,
      ticketCode: 'T' + Date.now() + Math.random().toString(36).substr(2, 8).toUpperCase(),
      visitDate: data.visit_date,
      visitorName: data.visitor_name,
      visitorIdCard: data.visitor_id_card || undefined,
      quantity: data.quantity ?? 1,
      price: data.price,
      status: ETicketStatus.UNUSED,
      expireAt: data.visit_date,
    });
    return this.repo.save(ticket);
  }

  async verify(ticketCode: string) {
    const ticket = await this.repo.findOne({ where: { ticketCode } });
    if (!ticket) throw new Error('电子票不存在');
    if (ticket.status === ETicketStatus.USED) throw new Error('该电子票已核销');
    if (ticket.status === ETicketStatus.REFUNDED) throw new Error('该电子票已退款');
    if (ticket.status === ETicketStatus.EXPIRED) throw new Error('该电子票已过期');

    ticket.status = ETicketStatus.USED;
    ticket.usedAt = new Date();
    return this.repo.save(ticket);
  }

  async updateStatus(id: number, data: { status: string }) {
    const ticket = await this.repo.findOne({ where: { id } });
    if (!ticket) throw new Error('电子票不存在');

    const allowed = this.validTransitions[ticket.status];
    if (!allowed || !allowed.includes(data.status)) {
      throw new Error(`不允许从 ${ticket.status} 变更为 ${data.status}`);
    }

    ticket.status = data.status as ETicketStatus;
    if (data.status === 'used') ticket.usedAt = new Date();
    return this.repo.save(ticket);
  }
}
