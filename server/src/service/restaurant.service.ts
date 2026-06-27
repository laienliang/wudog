import { Repository, Like as LikeOp } from 'typeorm';
import { Restaurant } from '../entity/restaurant.entity';
import { RestaurantDish } from '../entity/restaurant-dish.entity';
import { MealTimeSlot } from '../entity/meal-time-slot.entity';

export class RestaurantService {
  constructor(
    private repo: Repository<Restaurant>,
    private dishRepo: Repository<RestaurantDish>,
    private slotRepo: Repository<MealTimeSlot>,
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
    const restaurant = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!restaurant) throw new Error('餐厅不存在');
    const [dishes, slots] = await Promise.all([
      this.dishRepo.find({ where: { restaurantId: id, isDeleted: 0 }, order: { sortOrder: 'ASC' } }),
      this.slotRepo.find({ where: { restaurantId: id, isDeleted: 0, status: 1 } }),
    ]);
    return { ...restaurant, dishes, slots };
  }

  async create(userId: number, data: {
    name: string; address?: string; latitude?: number; longitude?: number;
    business_hours?: string; capacity?: number; intro?: string; main_image?: string;
  }) {
    const restaurant = this.repo.create({
      name: data.name,
      merchantId: userId,
      address: data.address || undefined,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
      businessHours: data.business_hours || undefined,
      capacity: data.capacity || 0,
      intro: data.intro || undefined,
      mainImage: data.main_image || undefined,
      status: 1,
    });
    return this.repo.save(restaurant);
  }

  async update(id: number, data: {
    name?: string; address?: string; latitude?: number; longitude?: number;
    business_hours?: string; capacity?: number; intro?: string; main_image?: string; status?: number;
  }) {
    const restaurant = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!restaurant) throw new Error('餐厅不存在');
    if (data.name !== undefined) restaurant.name = data.name;
    if (data.address !== undefined) restaurant.address = data.address;
    if (data.latitude !== undefined) restaurant.latitude = data.latitude;
    if (data.longitude !== undefined) restaurant.longitude = data.longitude;
    if (data.business_hours !== undefined) restaurant.businessHours = data.business_hours;
    if (data.capacity !== undefined) restaurant.capacity = data.capacity;
    if (data.intro !== undefined) restaurant.intro = data.intro;
    if (data.main_image !== undefined) restaurant.mainImage = data.main_image;
    if (data.status !== undefined) restaurant.status = data.status;
    return this.repo.save(restaurant);
  }

  async delete(id: number) {
    const restaurant = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!restaurant) throw new Error('餐厅不存在');
    restaurant.isDeleted = 1;
    return this.repo.save(restaurant);
  }

  async listAllDishes(restaurantId?: number) {
    const where: any = { isDeleted: 0 };
    if (restaurantId) where.restaurantId = restaurantId;
    return this.dishRepo.find({ where, order: { restaurantId: 'ASC', sortOrder: 'ASC' } });
  }

  // --- Dish CRUD ---
  async createDish(data: {
    restaurant_id: number; name: string; price: number; image?: string;
    intro?: string; is_signature?: number; sort_order?: number;
  }) {
    const dish = this.dishRepo.create({
      restaurantId: data.restaurant_id, name: data.name, price: data.price,
      image: data.image || undefined, intro: data.intro || undefined,
      isSignature: data.is_signature || 0, sortOrder: data.sort_order || 0,
    });
    return this.dishRepo.save(dish);
  }

  async updateDish(id: number, data: {
    name?: string; price?: number; image?: string; intro?: string;
    is_signature?: number; sort_order?: number; status?: number;
  }) {
    const dish = await this.dishRepo.findOne({ where: { id, isDeleted: 0 } });
    if (!dish) throw new Error('菜品不存在');
    if (data.name !== undefined) dish.name = data.name;
    if (data.price !== undefined) dish.price = data.price;
    if (data.image !== undefined) dish.image = data.image;
    if (data.intro !== undefined) dish.intro = data.intro;
    if (data.is_signature !== undefined) dish.isSignature = data.is_signature;
    if (data.sort_order !== undefined) dish.sortOrder = data.sort_order;
    if (data.status !== undefined) dish.status = data.status;
    return this.dishRepo.save(dish);
  }

  async deleteDish(id: number) {
    const dish = await this.dishRepo.findOne({ where: { id, isDeleted: 0 } });
    if (!dish) throw new Error('菜品不存在');
    dish.isDeleted = 1;
    return this.dishRepo.save(dish);
  }

  // --- Slot CRUD ---
  async createSlot(data: { restaurant_id: number; slot_name: string; max_bookings?: number }) {
    const slot = this.slotRepo.create({
      restaurantId: data.restaurant_id, slotName: data.slot_name,
      maxBookings: data.max_bookings || 20,
    });
    return this.slotRepo.save(slot);
  }

  async updateSlot(id: number, data: { slot_name?: string; max_bookings?: number; status?: number }) {
    const slot = await this.slotRepo.findOne({ where: { id, isDeleted: 0 } });
    if (!slot) throw new Error('时段不存在');
    if (data.slot_name !== undefined) slot.slotName = data.slot_name;
    if (data.max_bookings !== undefined) slot.maxBookings = data.max_bookings;
    if (data.status !== undefined) slot.status = data.status;
    return this.slotRepo.save(slot);
  }

  async deleteSlot(id: number) {
    const slot = await this.slotRepo.findOne({ where: { id, isDeleted: 0 } });
    if (!slot) throw new Error('时段不存在');
    slot.isDeleted = 1;
    return this.slotRepo.save(slot);
  }
}
