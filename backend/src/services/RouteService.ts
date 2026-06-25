import { Repository } from "typeorm";
import { RoutePackage, RouteItinerary } from "../entities";

export class RouteService {
  constructor(
    private routeRepo: Repository<RoutePackage>,
    private itineraryRepo: Repository<RouteItinerary>,
  ) {}

  // ==================== 公开接口 ====================

  async getAll(page: number, pageSize: number) {
    const [list, total] = await this.routeRepo.findAndCount({
      where: { deletedAt: null },
      order: { sort: "ASC", id: "DESC" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async getById(id: number) {
    return this.routeRepo.findOne({
      where: { id, deletedAt: null },
      relations: { itineraries: true, scenic: true },
      order: { itineraries: { dayOrder: "ASC" } },
    });
  }

  // ==================== 管理员接口 ====================

  async adminGetAll() {
    return this.routeRepo.find({
      where: { deletedAt: null },
      relations: { scenic: true },
      order: { id: "DESC" },
    });
  }

  async adminCreate(data: Partial<RoutePackage>) {
    const entity = this.routeRepo.create({
      coverImage: data.coverImage || '/placeholder-route.jpg',
      ...data,
    })
    entity.dailyStock = entity.dailyStock ?? {}
    return this.routeRepo.save(entity)
  }

  async adminUpdate(id: number, data: Partial<RoutePackage>) {
    await this.routeRepo.update(id, data);
    return this.getById(id);
  }

  async adminSoftDelete(id: number) {
    await this.routeRepo.softDelete(id);
  }

  async adminToggleStatus(id: number) {
    const entity = await this.routeRepo.findOneBy({ id });
    if (!entity) throw new Error("路线不存在");
    entity.status = entity.status === 1 ? 0 : 1;
    return this.routeRepo.save(entity);
  }

  async setDailyStocks(id: number, stocks: { date: string; stock: number }[]) {
    const entity = await this.routeRepo.findOneBy({ id });
    if (!entity) throw new Error("路线不存在");
    if (!entity.dailyStock) entity.dailyStock = {};
    for (const item of stocks) {
      if (item.stock <= 0) {
        delete entity.dailyStock[item.date];
      } else {
        entity.dailyStock[item.date] = item.stock;
      }
    }
    return this.routeRepo.save(entity);
  }

  // ---- 行程 CRUD ----

  async addItinerary(routeId: number, data: Partial<RouteItinerary>) {
    const entity = this.itineraryRepo.create({ ...data, routeId });
    return this.itineraryRepo.save(entity);
  }

  async updateItinerary(routeId: number, itId: number, data: Partial<RouteItinerary>) {
    await this.itineraryRepo.update({ id: itId, routeId }, data);
    return this.itineraryRepo.findOneBy({ id: itId });
  }

  async deleteItinerary(routeId: number, itId: number) {
    await this.itineraryRepo.softDelete({ id: itId, routeId });
  }
}
