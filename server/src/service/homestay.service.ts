import { Repository, Like as LikeOp } from 'typeorm';
import { Homestay } from '../entity/homestay.entity';
import { RoomType } from '../entity/room-type.entity';
import { RoomCalendar, CalendarStatus } from '../entity/room-calendar.entity';

export class HomestayService {
  constructor(
    private repo: Repository<Homestay>,
    private roomTypeRepo: Repository<RoomType>,
    private calendarRepo: Repository<RoomCalendar>,
  ) {}

  async list(query: { page?: number; pageSize?: number; keyword?: string; style_tag?: string; status?: string }) {
    const { page = 1, pageSize = 20, keyword, style_tag, status = '1' } = query;
    const where: any = { isDeleted: 0, status: Number(status) };
    if (keyword) where.name = LikeOp(`%${keyword}%`);
    if (style_tag) where.styleTags = LikeOp(`%${style_tag}%`);

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
    const homestay = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!homestay) throw new Error('民宿不存在');
    const roomTypes = await this.roomTypeRepo.find({ where: { homestayId: id, isDeleted: 0 }, order: { createdAt: 'ASC' } });
    return { ...homestay, roomTypes };
  }

  async create(userId: number, data: {
    name: string; address?: string; latitude?: number; longitude?: number;
    style_tags?: string; facility_tags?: string; main_image?: string; intro?: string;
  }) {
    const homestay = this.repo.create({
      name: data.name,
      merchantId: userId,
      address: data.address || undefined,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
      styleTags: data.style_tags || undefined,
      facilityTags: data.facility_tags || undefined,
      mainImage: data.main_image || undefined,
      intro: data.intro || undefined,
      status: 1,
    });
    return this.repo.save(homestay);
  }

  async update(id: number, data: {
    name?: string; address?: string; latitude?: number; longitude?: number;
    style_tags?: string; facility_tags?: string; main_image?: string; intro?: string; status?: number;
  }) {
    const homestay = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!homestay) throw new Error('民宿不存在');
    if (data.name !== undefined) homestay.name = data.name;
    if (data.address !== undefined) homestay.address = data.address;
    if (data.latitude !== undefined) homestay.latitude = data.latitude;
    if (data.longitude !== undefined) homestay.longitude = data.longitude;
    if (data.style_tags !== undefined) homestay.styleTags = data.style_tags;
    if (data.facility_tags !== undefined) homestay.facilityTags = data.facility_tags;
    if (data.main_image !== undefined) homestay.mainImage = data.main_image;
    if (data.intro !== undefined) homestay.intro = data.intro;
    if (data.status !== undefined) homestay.status = data.status;
    return this.repo.save(homestay);
  }

  async delete(id: number) {
    const homestay = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!homestay) throw new Error('民宿不存在');
    homestay.isDeleted = 1;
    return this.repo.save(homestay);
  }

  // --- Room Type CRUD ---
  async createRoomType(data: {
    homestay_id: number; name: string; bed_type?: string; area?: number;
    capacity?: number; facilities?: string; base_price: number; total_rooms?: number; main_image?: string;
  }) {
    const roomType = this.roomTypeRepo.create({
      homestayId: data.homestay_id, name: data.name,
      bedType: data.bed_type || undefined,
      area: data.area || undefined,
      capacity: data.capacity ?? 2,
      facilities: data.facilities || undefined,
      basePrice: data.base_price,
      totalRooms: data.total_rooms ?? 1,
      mainImage: data.main_image || undefined,
    });
    return this.roomTypeRepo.save(roomType);
  }

  async updateRoomType(id: number, data: {
    name?: string; bed_type?: string; area?: number; capacity?: number;
    facilities?: string; base_price?: number; total_rooms?: number; main_image?: string; status?: number;
  }) {
    const rt = await this.roomTypeRepo.findOne({ where: { id, isDeleted: 0 } });
    if (!rt) throw new Error('房型不存在');
    if (data.name !== undefined) rt.name = data.name;
    if (data.bed_type !== undefined) rt.bedType = data.bed_type;
    if (data.area !== undefined) rt.area = data.area;
    if (data.capacity !== undefined) rt.capacity = data.capacity;
    if (data.facilities !== undefined) rt.facilities = data.facilities;
    if (data.base_price !== undefined) rt.basePrice = data.base_price;
    if (data.total_rooms !== undefined) rt.totalRooms = data.total_rooms;
    if (data.main_image !== undefined) rt.mainImage = data.main_image;
    if (data.status !== undefined) rt.status = data.status;
    return this.roomTypeRepo.save(rt);
  }

  async deleteRoomType(id: number) {
    const rt = await this.roomTypeRepo.findOne({ where: { id, isDeleted: 0 } });
    if (!rt) throw new Error('房型不存在');
    rt.isDeleted = 1;
    return this.roomTypeRepo.save(rt);
  }

  async listAllRoomTypes(homestayId?: number) {
    const where: any = { isDeleted: 0 };
    if (homestayId) where.homestayId = homestayId;
    return this.roomTypeRepo.find({ where, order: { homestayId: 'ASC', createdAt: 'ASC' } });
  }

  // --- Calendar ---
  async getCalendar(roomTypeId: number, startDate: string, endDate: string) {
    return this.calendarRepo.find({
      where: { roomTypeId },
      order: { date: 'ASC' },
    }).then(rows => rows.filter(r => r.date >= startDate && r.date <= endDate));
  }

  async batchUpdateCalendar(roomTypeId: number, entries: { date: string; available_rooms?: number; price?: number; status?: string }[]) {
    for (const entry of entries) {
      let row = await this.calendarRepo.findOne({ where: { roomTypeId, date: entry.date } });
      if (!row) {
        row = this.calendarRepo.create({ roomTypeId, date: entry.date, availableRooms: 0 });
      }
      if (entry.available_rooms !== undefined) row.availableRooms = entry.available_rooms;
      if (entry.price !== undefined) row.price = entry.price;
      if (entry.status !== undefined) row.status = entry.status as CalendarStatus;
      await this.calendarRepo.save(row);
    }
    return { success: true };
  }
}
