import { Repository, Like as LikeOp } from 'typeorm';
import { ScenicSpot } from '../entity/scenic-spot.entity';
import { TicketType } from '../entity/ticket-type.entity';

export class ScenicSpotService {
  constructor(
    private repo: Repository<ScenicSpot>,
    private ticketTypeRepo: Repository<TicketType>,
  ) {}

  async list(query: { page?: number; pageSize?: number; keyword?: string; status?: string }) {
    const { page = 1, pageSize = 20, keyword, status = '1' } = query;
    const where: any = { isDeleted: 0, status: Number(status) };
    if (keyword) where.name = LikeOp(`%${keyword}%`);

    const [list, total] = await this.repo.findAndCount({
      where, order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize, take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async listAll() {
    return this.repo.find({ where: { isDeleted: 0 }, order: { createdAt: 'DESC' } });
  }

  async detail(id: number) {
    const spot = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!spot) throw new Error('景区不存在');
    const ticketTypes = await this.ticketTypeRepo.find({ where: { spotId: id, isDeleted: 0 }, order: { createdAt: 'ASC' } });
    return { ...spot, ticketTypes };
  }

  async create(data: {
    name: string; address?: string; latitude?: number; longitude?: number;
    open_time?: string; intro?: string; main_image?: string;
  }) {
    const spot = this.repo.create({
      name: data.name, address: data.address || undefined,
      latitude: data.latitude ?? undefined, longitude: data.longitude ?? undefined,
      openTime: data.open_time || undefined, intro: data.intro || undefined,
      mainImage: data.main_image || undefined, status: 1,
    });
    return this.repo.save(spot);
  }

  async update(id: number, data: {
    name?: string; address?: string; latitude?: number; longitude?: number;
    open_time?: string; intro?: string; main_image?: string; status?: number;
  }) {
    const spot = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!spot) throw new Error('景区不存在');
    if (data.name !== undefined) spot.name = data.name;
    if (data.address !== undefined) spot.address = data.address;
    if (data.latitude !== undefined) spot.latitude = data.latitude;
    if (data.longitude !== undefined) spot.longitude = data.longitude;
    if (data.open_time !== undefined) spot.openTime = data.open_time;
    if (data.intro !== undefined) spot.intro = data.intro;
    if (data.main_image !== undefined) spot.mainImage = data.main_image;
    if (data.status !== undefined) spot.status = data.status;
    return this.repo.save(spot);
  }

  async delete(id: number) {
    const spot = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!spot) throw new Error('景区不存在');
    spot.isDeleted = 1;
    return this.repo.save(spot);
  }

  // --- Ticket Type CRUD ---
  async createTicketType(data: {
    spot_id: number; name: string; price: number; stock?: number;
    valid_days?: number; description?: string;
  }) {
    const ticket = this.ticketTypeRepo.create({
      spotId: data.spot_id, name: data.name, price: data.price,
      stock: data.stock ?? -1, validDays: data.valid_days ?? 1,
      description: data.description || undefined,
    });
    return this.ticketTypeRepo.save(ticket);
  }

  async updateTicketType(id: number, data: {
    name?: string; price?: number; stock?: number; valid_days?: number; description?: string; status?: number;
  }) {
    const ticket = await this.ticketTypeRepo.findOne({ where: { id, isDeleted: 0 } });
    if (!ticket) throw new Error('票种不存在');
    if (data.name !== undefined) ticket.name = data.name;
    if (data.price !== undefined) ticket.price = data.price;
    if (data.stock !== undefined) ticket.stock = data.stock;
    if (data.valid_days !== undefined) ticket.validDays = data.valid_days;
    if (data.description !== undefined) ticket.description = data.description;
    if (data.status !== undefined) ticket.status = data.status;
    return this.ticketTypeRepo.save(ticket);
  }

  async deleteTicketType(id: number) {
    const ticket = await this.ticketTypeRepo.findOne({ where: { id, isDeleted: 0 } });
    if (!ticket) throw new Error('票种不存在');
    ticket.isDeleted = 1;
    return this.ticketTypeRepo.save(ticket);
  }

  async listAllTicketTypes(spotId?: number) {
    const where: any = { isDeleted: 0 };
    if (spotId) where.spotId = spotId;
    return this.ticketTypeRepo.find({ where, order: { spotId: 'ASC', createdAt: 'ASC' } });
  }
}
