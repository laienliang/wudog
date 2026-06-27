import { Repository } from 'typeorm';
import { HomestayBooking, BookingStatus } from '../entity/homestay-booking.entity';

export class HomestayBookingService {
  private validTransitions: Record<string, string[]> = {
    pending: ['paid', 'confirmed', 'cancelled'],
    paid: ['confirmed', 'cancelled', 'refunding'],
    confirmed: ['completed', 'cancelled', 'refunding'],
    cancelled: [],
    completed: [],
    refunding: ['refunded'],
    refunded: [],
  };

  constructor(
    private repo: Repository<HomestayBooking>,
  ) {}

  async list(userId: number) {
    const bookings = await this.repo.find({
      where: { userId, isDeleted: 0 },
      order: { createdAt: 'DESC' },
    });
    return bookings;
  }

  async listAll(query: { status?: string; homestay_id?: number; page?: number; pageSize?: number }) {
    const { status, homestay_id, page = 1, pageSize = 50 } = query;
    const where: any = { isDeleted: 0 };
    if (status) where.status = status;
    if (homestay_id) where.homestayId = Number(homestay_id);

    const [list, total] = await this.repo.findAndCount({
      where, order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize, take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async create(userId: number, data: {
    homestay_id: number; room_type_id: number;
    check_in_date: string; check_out_date: string; nights: number;
    room_count?: number; guest_name: string; guest_phone: string;
    total_amount: number;
  }) {
    const booking = this.repo.create({
      userId,
      homestayId: data.homestay_id,
      roomTypeId: data.room_type_id,
      checkInDate: data.check_in_date,
      checkOutDate: data.check_out_date,
      nights: data.nights,
      roomCount: data.room_count ?? 1,
      guestName: data.guest_name,
      guestPhone: data.guest_phone,
      totalAmount: data.total_amount,
      status: BookingStatus.PENDING,
    });
    return this.repo.save(booking);
  }

  async updateStatus(id: number, data: { status: string; merchant_remark?: string }) {
    const booking = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!booking) throw new Error('预订不存在');

    const allowed = this.validTransitions[booking.status];
    if (!allowed || !allowed.includes(data.status)) {
      throw new Error(`不允许从 ${booking.status} 变更为 ${data.status}`);
    }

    booking.status = data.status as BookingStatus;
    return this.repo.save(booking);
  }

  async cancel(userId: number, id: number) {
    const booking = await this.repo.findOne({ where: { id, userId, isDeleted: 0 } });
    if (!booking) throw new Error('预订不存在');
    if (!['pending', 'paid', 'confirmed'].includes(booking.status)) {
      throw new Error('当前状态不可取消');
    }
    booking.status = BookingStatus.CANCELLED;
    return this.repo.save(booking);
  }
}
