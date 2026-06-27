import { Repository } from 'typeorm';
import { RestaurantBooking, BookingStatus } from '../entity/restaurant-booking.entity';
import { MealTimeSlot } from '../entity/meal-time-slot.entity';
import { Restaurant } from '../entity/restaurant.entity';

export class RestaurantBookingService {
  constructor(
    private repo: Repository<RestaurantBooking>,
    private slotRepo: Repository<MealTimeSlot>,
    private restaurantRepo: Repository<Restaurant>,
  ) {}

  async list(userId: number, query?: { status?: string; page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 20, status } = query || {};
    const where: any = { userId, isDeleted: 0 };
    if (status) where.status = status;

    const [list, total] = await this.repo.findAndCount({
      where, order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize, take: pageSize,
    });

    const enriched = await Promise.all(list.map(async (b) => {
      const restaurant = await this.restaurantRepo.findOne({ where: { id: b.restaurantId } });
      const slot = await this.slotRepo.findOne({ where: { id: b.slotId } });
      return { ...b, restaurantName: restaurant?.name || '', slotName: slot?.slotName || '' };
    }));

    return { list: enriched, total, page, pageSize };
  }

  async listAll(query: { restaurant_id?: number; status?: string; date?: string; page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 20, restaurant_id, status, date } = query;
    const where: any = { isDeleted: 0 };
    if (restaurant_id) where.restaurantId = Number(restaurant_id);
    if (status) where.status = status;
    if (date) where.bookingDate = date;

    const [list, total] = await this.repo.findAndCount({
      where, order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize, take: pageSize,
    });

    const enriched = await Promise.all(list.map(async (b) => {
      const restaurant = await this.restaurantRepo.findOne({ where: { id: b.restaurantId } });
      const slot = await this.slotRepo.findOne({ where: { id: b.slotId } });
      return { ...b, restaurantName: restaurant?.name || '', slotName: slot?.slotName || '' };
    }));

    return { list: enriched, total, page, pageSize };
  }

  async create(userId: number, data: {
    restaurant_id: number; booking_date: string; slot_id: number;
    guest_count: number; contact_name: string; contact_phone: string; remark?: string;
  }) {
    const restaurant = await this.restaurantRepo.findOne({ where: { id: data.restaurant_id, isDeleted: 0 } });
    if (!restaurant) throw new Error('餐厅不存在');

    const slot = await this.slotRepo.findOne({ where: { id: data.slot_id, isDeleted: 0 } });
    if (!slot) throw new Error('时段不存在');

    const booking = this.repo.create({
      restaurantId: data.restaurant_id,
      userId,
      bookingDate: data.booking_date,
      slotId: data.slot_id,
      guestCount: data.guest_count,
      contactName: data.contact_name,
      contactPhone: data.contact_phone,
      remark: data.remark || undefined,
      status: BookingStatus.PENDING,
    });
    return this.repo.save(booking);
  }

  async updateStatus(id: number, data: { status: string; merchant_remark?: string }) {
    const booking = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!booking) throw new Error('预订不存在');

    const validTransitions: Record<string, string[]> = {
      [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.REJECTED, BookingStatus.CANCELLED],
      [BookingStatus.CONFIRMED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
    };

    if (!validTransitions[booking.status]?.includes(data.status)) {
      throw new Error('状态变更不允许');
    }

    booking.status = data.status as BookingStatus;
    if (data.merchant_remark !== undefined) booking.merchantRemark = data.merchant_remark;
    return this.repo.save(booking);
  }

  async cancel(userId: number, id: number) {
    const booking = await this.repo.findOne({ where: { id, userId, isDeleted: 0 } });
    if (!booking) throw new Error('预订不存在');
    if (![BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(booking.status)) {
      throw new Error('当前状态不可取消');
    }
    booking.status = BookingStatus.CANCELLED;
    return this.repo.save(booking);
  }
}
