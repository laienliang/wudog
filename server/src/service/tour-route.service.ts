import { Repository, Like as LikeOp } from 'typeorm';
import { TourRoute } from '../entity/tour-route.entity';
import { TourItinerary } from '../entity/tour-itinerary.entity';
import { TransportGuide } from '../entity/transport-guide.entity';

export class TourRouteService {
  constructor(
    private repo: Repository<TourRoute>,
    private itineraryRepo: Repository<TourItinerary>,
    private guideRepo: Repository<TransportGuide>,
  ) {}

  // --- Route CRUD ---
  async list(query: { page?: number; pageSize?: number; keyword?: string; theme?: string; status?: string }) {
    const { page = 1, pageSize = 20, keyword, theme, status = '1' } = query;
    const where: any = { isDeleted: 0, status: Number(status) };
    if (keyword) where.title = LikeOp(`%${keyword}%`);
    if (theme) where.theme = theme;

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
    const route = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!route) throw new Error('路线不存在');
    const itineraries = await this.itineraryRepo.find({ where: { routeId: id }, order: { dayNumber: 'ASC', sortOrder: 'ASC' } });
    return { ...route, itineraries };
  }

  async create(userId: number, data: {
    title: string; days?: number; theme?: string; price: number;
    main_image?: string; intro?: string; includes?: string; excludes?: string; notes?: string;
  }) {
    const route = this.repo.create({
      title: data.title, merchantId: userId,
      days: data.days ?? 1, theme: data.theme || undefined, price: data.price,
      mainImage: data.main_image || undefined, intro: data.intro || undefined,
      includes: data.includes || undefined, excludes: data.excludes || undefined,
      notes: data.notes || undefined, status: 1,
    });
    return this.repo.save(route);
  }

  async update(id: number, data: {
    title?: string; days?: number; theme?: string; price?: number;
    main_image?: string; intro?: string; includes?: string; excludes?: string; notes?: string; status?: number;
  }) {
    const route = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!route) throw new Error('路线不存在');
    if (data.title !== undefined) route.title = data.title;
    if (data.days !== undefined) route.days = data.days;
    if (data.theme !== undefined) route.theme = data.theme;
    if (data.price !== undefined) route.price = data.price;
    if (data.main_image !== undefined) route.mainImage = data.main_image;
    if (data.intro !== undefined) route.intro = data.intro;
    if (data.includes !== undefined) route.includes = data.includes;
    if (data.excludes !== undefined) route.excludes = data.excludes;
    if (data.notes !== undefined) route.notes = data.notes;
    if (data.status !== undefined) route.status = data.status;
    return this.repo.save(route);
  }

  async delete(id: number) {
    const route = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!route) throw new Error('路线不存在');
    route.isDeleted = 1;
    return this.repo.save(route);
  }

  // --- Itinerary CRUD ---
  async createItinerary(data: {
    route_id: number; day_number: number; description?: string;
    spots?: string; meals?: string; accommodation?: string; transport?: string; sort_order?: number;
  }) {
    const it = this.itineraryRepo.create({
      routeId: data.route_id, dayNumber: data.day_number,
      description: data.description || undefined,
      spots: data.spots || undefined, meals: data.meals || undefined,
      accommodation: data.accommodation || undefined, transport: data.transport || undefined,
      sortOrder: data.sort_order ?? 0,
    });
    return this.itineraryRepo.save(it);
  }

  async updateItinerary(id: number, data: {
    day_number?: number; description?: string; spots?: string;
    meals?: string; accommodation?: string; transport?: string; sort_order?: number;
  }) {
    const it = await this.itineraryRepo.findOne({ where: { id } });
    if (!it) throw new Error('行程不存在');
    if (data.day_number !== undefined) it.dayNumber = data.day_number;
    if (data.description !== undefined) it.description = data.description;
    if (data.spots !== undefined) it.spots = data.spots;
    if (data.meals !== undefined) it.meals = data.meals;
    if (data.accommodation !== undefined) it.accommodation = data.accommodation;
    if (data.transport !== undefined) it.transport = data.transport;
    if (data.sort_order !== undefined) it.sortOrder = data.sort_order;
    return this.itineraryRepo.save(it);
  }

  async deleteItinerary(id: number) {
    const it = await this.itineraryRepo.findOne({ where: { id } });
    if (!it) throw new Error('行程不存在');
    return this.itineraryRepo.remove(it);
  }

  async listItineraries(routeId: number) {
    return this.itineraryRepo.find({ where: { routeId }, order: { dayNumber: 'ASC', sortOrder: 'ASC' } });
  }

  // --- Transport Guide CRUD ---
  async listGuides(query: { page?: number; pageSize?: number; keyword?: string; destination?: string }) {
    const { page = 1, pageSize = 20, keyword, destination } = query;
    const where: any = { isDeleted: 0, status: 1 };
    if (keyword) where.title = LikeOp(`%${keyword}%`);
    if (destination) where.destination = destination;

    const [list, total] = await this.guideRepo.findAndCount({
      where, order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize, take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async listAllGuides() {
    return this.guideRepo.find({ where: { isDeleted: 0 }, order: { createdAt: 'DESC' } });
  }

  async createGuide(data: {
    title: string; departure?: string; destination: string; transport_type?: string;
    duration?: string; cost?: string; description?: string; image?: string;
  }) {
    const guide = this.guideRepo.create({
      title: data.title, departure: data.departure || undefined,
      destination: data.destination, transportType: data.transport_type || undefined,
      duration: data.duration || undefined, cost: data.cost || undefined,
      description: data.description || undefined, image: data.image || undefined, status: 1,
    });
    return this.guideRepo.save(guide);
  }

  async updateGuide(id: number, data: {
    title?: string; departure?: string; destination?: string; transport_type?: string;
    duration?: string; cost?: string; description?: string; image?: string; status?: number;
  }) {
    const guide = await this.guideRepo.findOne({ where: { id, isDeleted: 0 } });
    if (!guide) throw new Error('攻略不存在');
    if (data.title !== undefined) guide.title = data.title;
    if (data.departure !== undefined) guide.departure = data.departure;
    if (data.destination !== undefined) guide.destination = data.destination;
    if (data.transport_type !== undefined) guide.transportType = data.transport_type;
    if (data.duration !== undefined) guide.duration = data.duration;
    if (data.cost !== undefined) guide.cost = data.cost;
    if (data.description !== undefined) guide.description = data.description;
    if (data.image !== undefined) guide.image = data.image;
    if (data.status !== undefined) guide.status = data.status;
    return this.guideRepo.save(guide);
  }

  async deleteGuide(id: number) {
    const guide = await this.guideRepo.findOne({ where: { id, isDeleted: 0 } });
    if (!guide) throw new Error('攻略不存在');
    guide.isDeleted = 1;
    return this.guideRepo.save(guide);
  }
}
