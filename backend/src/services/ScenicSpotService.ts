import { Repository } from "typeorm";
import { ScenicSpot } from "../entities";

export class ScenicSpotService {
  constructor(private repo: Repository<ScenicSpot>) {}

  // ==================== 公开接口 ====================

  async getAll(page: number, pageSize: number) {
    const [list, total] = await this.repo.findAndCount({
      where: { deletedAt: null },
      order: { sort: "ASC", id: "DESC" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async getById(id: number) {
    return this.repo.findOne({
      where: { id, deletedAt: null },
      relations: { ticketTypes: true },
    });
  }

  // ==================== 管理员接口 ====================

  async create(data: Partial<ScenicSpot>) {
    const entity = this.repo.create({
      name: data.name || '未命名景区',
      coverImage: data.coverImage || '/placeholder.jpg',
      address: data.address || '',
      ...data,
    });
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<ScenicSpot>) {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async softDelete(id: number) {
    await this.repo.softDelete(id);
  }

  // Issue #19: 过滤已软删除的记录
  async toggleStatus(id: number) {
    const spot = await this.repo.findOne({ where: { id, deletedAt: null } });
    if (!spot) throw new Error("景区不存在");
    spot.status = spot.status === 1 ? 0 : 1;
    return this.repo.save(spot);
  }
}
