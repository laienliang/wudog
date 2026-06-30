import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Between } from 'typeorm';
import { Homestay } from '../entity/homestay.entity';
import { RoomType } from '../entity/room-type.entity';
import { Calendar } from '../entity/calendar.entity';

@Provide()
export class AccommodationService {
  @InjectEntityModel(Homestay)
  homestayModel: Repository<Homestay>;

  @InjectEntityModel(RoomType)
  roomTypeModel: Repository<RoomType>;

  @InjectEntityModel(Calendar)
  calendarModel: Repository<Calendar>;

  // ===== 民宿 =====
  async listHomestays(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const sql = `SELECT
      h.id, h.name, h.cover_image AS coverImage, h.phone, h.address, h.description,
      h.facilities, h.rating, h.status, h.created_at AS createdAt,
      (SELECT MIN(price) FROM wd_accommodation_room_type rt WHERE rt.homestay_id = h.id AND rt.deleted_at IS NULL) AS min_price
      FROM wd_accommodation_homestay h WHERE h.deleted_at IS NULL
      ${keyword ? 'AND h.name LIKE ?' : ''}
      ORDER BY h.created_at DESC
      LIMIT ? OFFSET ?`;
    const params: any[] = [];
    if (keyword) params.push(`%${keyword}%`);
    params.push(Number(pageSize), (page - 1) * pageSize);
    let list = await this.homestayModel.query(sql, params);
    // 安全解析 facilities：支持数组、JSON字符串、null
    const parseFacilities = (val: any): string[] => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') try { return JSON.parse(val); } catch { return []; }
      return [];
    };
    list = list.map((r: any) => ({
      ...r,
      facilities: parseFacilities(r.facilities),
    }));

    const countResult = await this.homestayModel.query(
      `SELECT COUNT(*) AS total FROM wd_accommodation_homestay WHERE deleted_at IS NULL`, []);
    const total = Number(countResult[0]?.total || 0);
    return { list, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async getAllHomestays() {
    return this.homestayModel.find({ where: { deletedAt: undefined }, order: { rating: 'DESC' } });
  }

  async getHomestay(id: number) {
    const h = await this.homestayModel.findOne({ where: { id } });
    if (!h) throw new Error('民宿不存在');
    const roomTypes = await this.roomTypeModel.find({ where: { homestayId: id, deletedAt: undefined } });
    return { ...h, roomTypes };
  }

  async createHomestay(data: any) { return this.homestayModel.save(data); }

  async updateHomestay(id: number, data: any) {
    await this.homestayModel.update(id, data);
    return this.homestayModel.findOne({ where: { id } });
  }

  async deleteHomestay(id: number) { return this.homestayModel.softDelete(id); }

  // ===== 房型 =====
  async listRoomTypes(homestayId?: number) {
    const where: any = { deletedAt: undefined };
    if (homestayId) where.homestayId = homestayId;
    return this.roomTypeModel.find({ where, order: { createdAt: 'DESC' } });
  }

  async createRoomType(data: any) { return this.roomTypeModel.save(data); }

  async updateRoomType(id: number, data: any) {
    await this.roomTypeModel.update(id, data);
    return this.roomTypeModel.findOne({ where: { id } });
  }

  async deleteRoomType(id: number) { return this.roomTypeModel.softDelete(id); }

  // ===== 房态日历 =====
  async getCalendar(roomTypeId: number, month: string) {
    const start = `${month}-01`;
    const year = parseInt(month.slice(0, 4));
    const mon = parseInt(month.slice(5, 7));
    const lastDay = new Date(year, mon, 0).getDate();
    const end = `${month}-${String(lastDay).padStart(2, '0')}`;

    return this.calendarModel.find({
      where: { roomTypeId, date: Between(start, end) },
      order: { date: 'ASC' },
    });
  }

  async batchSetCalendar(data: { roomTypeId: number; startDate: string; endDate: string; price?: number; stock?: number; status?: number }) {
    const { roomTypeId, startDate, endDate, price, stock, status } = data;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const results = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);
      const existing = await this.calendarModel.findOne({ where: { roomTypeId, date: dateStr } });
      if (existing) {
        if (price !== undefined) existing.price = price;
        if (stock !== undefined) existing.stock = stock;
        if (status !== undefined) existing.status = status;
        results.push(await this.calendarModel.save(existing));
      } else {
        const entry = this.calendarModel.create({
          roomTypeId, date: dateStr,
          price: price || 0, stock: stock || 0,
          status: status !== undefined ? status : null,
        } as any);
        results.push(await this.calendarModel.save(entry));
      }
    }
    return { count: results.length };
  }

  // ===== 住宿评价 =====
  async listAccommodationReviews(query: any) {
    const { page = 1, pageSize = 10 } = query;
    const sql = `SELECT r.id, r.product_id, r.rating, r.content, r.created_at AS createdAt, r.status,
      u.nickname AS user_name
      FROM wd_clothing_review r
      LEFT JOIN wd_user u ON r.user_id = u.id
      WHERE r.deleted_at IS NULL AND r.product_id >= 100
      ORDER BY r.id DESC
      LIMIT ? OFFSET ?`;
    const params: any[] = [Number(pageSize), (page - 1) * pageSize];
    const list = await this.homestayModel.query(sql, params);
    const enriched = list.map((r: any) => ({ ...r, homestay_name: '民宿' }));

    const countResult = await this.homestayModel.query(
      `SELECT COUNT(*) AS total FROM wd_clothing_review WHERE deleted_at IS NULL AND product_id >= 100`, []);
    const total = Number(countResult[0]?.total || 0);
    return { list: enriched, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  // ===== 住宿订单 =====
  async listAccommodationOrders(query: any) {
    const { page = 1, pageSize = 10, status } = query;
    let sql = `SELECT o.id, o.order_no AS orderNo, o.user_id AS userId, o.merchant_id AS merchantId,
      o.order_type AS orderType, o.total_amount AS totalAmount, o.pay_amount AS payAmount,
      o.status, o.pay_type AS payType, o.pay_time AS payTime, o.remark, o.created_at AS createdAt,
      oi.product_name AS room_name, r.homestay_id,
      h.name AS homestay_name
      FROM wd_order o
      LEFT JOIN wd_order_item oi ON o.id = oi.order_id
      LEFT JOIN wd_accommodation_room_type r ON oi.product_id = r.id
      LEFT JOIN wd_accommodation_homestay h ON r.homestay_id = h.id
      WHERE o.order_type = 'accommodation' AND o.deleted_at IS NULL`;
    const params: any[] = [];
    if (status) { sql += ' AND o.status = ?'; params.push(status); }
    sql += ' ORDER BY o.created_at DESC';

    let countSql = "SELECT COUNT(*) AS total FROM wd_order WHERE order_type = 'accommodation' AND deleted_at IS NULL";
    if (status) countSql += " AND status = ?";
    const countResult = await this.homestayModel.query(countSql, params);
    const total = Number(countResult[0]?.total || 0);
    const offset = (page - 1) * pageSize;
    sql += ` LIMIT ${Number(pageSize)} OFFSET ${Number(offset)}`;
    const list = await this.homestayModel.query(sql, params);
    return { list, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }
}
