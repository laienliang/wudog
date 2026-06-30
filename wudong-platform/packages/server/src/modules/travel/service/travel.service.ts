import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { ScenicSpot } from '../entity/scenic-spot.entity';
import { TicketType } from '../entity/ticket-type.entity';
import { Route } from '../entity/route.entity';
import { ETicket } from '../entity/e-ticket.entity';

@Provide()
export class TravelService {
  @InjectEntityModel(ScenicSpot)
  scenicModel: Repository<ScenicSpot>;

  @InjectEntityModel(TicketType)
  ticketTypeModel: Repository<TicketType>;

  @InjectEntityModel(Route)
  routeModel: Repository<Route>;

  @InjectEntityModel(ETicket)
  eTicketModel: Repository<ETicket>;

  // ===== 景区 =====
  async listScenicSpots(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const qb = this.scenicModel.createQueryBuilder('s')
      .where('s.deletedAt IS NULL')
      .orderBy('s.createdAt', 'DESC')
      .skip((page - 1) * pageSize).take(pageSize);
    if (keyword) qb.andWhere('s.name LIKE :kw', { kw: `%${keyword}%` });
    const [list, total] = await qb.getManyAndCount();
    return { list, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async getAllScenicSpots() {
    return this.scenicModel.find({ where: { deletedAt: undefined }, order: { createdAt: 'DESC' } });
  }

  async getScenicSpot(id: number) {
    const s = await this.scenicModel.findOne({ where: { id } });
    if (!s) throw new Error('景区不存在');
    const tickets = await this.ticketTypeModel.find({ where: { scenicId: id, deletedAt: undefined } });
    return { ...s, ticketTypes: tickets };
  }

  async createScenicSpot(data: any) { return this.scenicModel.save(data); }
  async updateScenicSpot(id: number, data: any) { await this.scenicModel.update(id, data); return this.scenicModel.findOne({ where: { id } }); }
  async deleteScenicSpot(id: number) { return this.scenicModel.softDelete(id); }

  // ===== 票种 =====
  async listTicketTypes(scenicId?: number) {
    const where: any = { deletedAt: undefined };
    if (scenicId) where.scenicId = scenicId;
    return this.ticketTypeModel.find({ where, order: { createdAt: 'DESC' } });
  }

  async createTicketType(data: any) { return this.ticketTypeModel.save(data); }
  async updateTicketType(id: number, data: any) { await this.ticketTypeModel.update(id, data); return this.ticketTypeModel.findOne({ where: { id } }); }
  async deleteTicketType(id: number) { return this.ticketTypeModel.softDelete(id); }

  // ===== 路线套餐 =====
  async listRoutes(query: any) {
    const { page = 1, pageSize = 10 } = query;
    const qb = this.routeModel.createQueryBuilder('r')
      .where('r.deletedAt IS NULL')
      .orderBy('r.createdAt', 'DESC')
      .skip((page - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async getRoute(id: number) {
    const r = await this.routeModel.findOne({ where: { id } });
    if (!r) throw new Error('路线不存在');
    return r;
  }

  async createRoute(data: any) { return this.routeModel.save(data); }
  async updateRoute(id: number, data: any) { await this.routeModel.update(id, data); return this.routeModel.findOne({ where: { id } }); }
  async deleteRoute(id: number) { return this.routeModel.softDelete(id); }

  // ===== 电子票 =====
  async listETickets(query: any) {
    const { page = 1, pageSize = 10, status } = query;
    const qb = this.eTicketModel.createQueryBuilder('e')
      .where('e.deletedAt IS NULL')
      .orderBy('e.createdAt', 'DESC')
      .skip((page - 1) * pageSize).take(pageSize);
    if (status !== undefined) qb.andWhere('e.status = :st', { st: Number(status) });
    const [list, total] = await qb.getManyAndCount();
    // Attach order info
    const enriched = await Promise.all(list.map(async (e: any) => {
      const order = await this.scenicModel.query('SELECT order_no AS orderNo, total_amount AS totalAmount FROM wd_order WHERE id = ?', [e.orderId]);
      return { ...e, orderNo: order[0]?.orderNo || '-', totalAmount: order[0]?.totalAmount || 0 };
    }));
    return { list: enriched, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async verifyETicket(ticketCode: string) {
    const ticket = await this.eTicketModel.findOne({ where: { ticketCode } });
    if (!ticket) throw new Error('电子票不存在');
    if (ticket.status !== 0) throw new Error('电子票已使用或已过期');
    ticket.status = 1;
    ticket.usedAt = new Date();
    return this.eTicketModel.save(ticket);
  }
}
