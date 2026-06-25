import { Repository } from "typeorm";
import { TicketType } from "../entities";

export class TicketTypeService {
  constructor(private repo: Repository<TicketType>) {}

  // ==================== 公开接口 ====================

  async getByScenicId(scenicId: number) {
    return this.repo.find({
      where: { scenicId, status: 1, deletedAt: null },
      order: { id: "ASC" },
    });
  }

  async getById(id: number) {
    return this.repo.findOne({
      where: { id, deletedAt: null },
      relations: { scenic: true },
    });
  }

  // ==================== 管理员接口 ====================

  async getAll() {
    return this.repo.find({
      where: { deletedAt: null },
      relations: { scenic: true },
      order: { id: "DESC" },
    });
  }

  async create(data: Partial<TicketType>) {
    const entity = this.repo.create({
      price: data.price ?? 0,
      sellPrice: data.sellPrice ?? 0,
      ...data,
    });
    entity.dailyStock = entity.dailyStock ?? {};
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<TicketType>) {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async softDelete(id: number) {
    await this.repo.softDelete(id);
  }

  /**
   * 按日期批量设置库存覆盖值
   * @param id 票种 ID
   * @param stocks [{ date: '2026-07-01', stock: 100 }, ...]
   */
  async setDailyStocks(id: number, stocks: { date: string; stock: number }[]) {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) throw new Error("票种不存在");
    if (!entity.dailyStock) entity.dailyStock = {};
    for (const item of stocks) {
      if (item.stock <= 0) {
        delete entity.dailyStock[item.date];
      } else {
        entity.dailyStock[item.date] = item.stock;
      }
    }
    return this.repo.save(entity);
  }
}
