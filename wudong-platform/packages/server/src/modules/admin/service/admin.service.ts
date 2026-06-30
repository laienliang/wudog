import { Provide, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { BusinessError } from '../../../common/filter/unauthorized.filter';
import { Admin } from '../entity/admin.entity';
import { Role } from '../entity/role.entity';
import { Merchant } from '../entity/merchant.entity';
import { MerchantApplication } from '../entity/merchant-application.entity';
import { Banner } from '../entity/banner.entity';
import { Announcement } from '../entity/announcement.entity';
import { Recommendation } from '../entity/recommendation.entity';
import { SystemMessage } from '../entity/system-message.entity';
import { FinanceRecord } from '../entity/finance-record.entity';
import { SystemConfig } from '../entity/system-config.entity';
import { OperationLog } from '../entity/operation-log.entity';
import { SensitiveWord } from '../entity/sensitive-word.entity';
import { ActivityBanner } from '../entity/activity-banner.entity';
import { MessageTemplate } from '../entity/message-template.entity';

@Provide()
export class AdminService {
  @InjectEntityModel(Admin)
  adminModel: Repository<Admin>;

  @InjectEntityModel(Role)
  roleModel: Repository<Role>;

  @InjectEntityModel(Merchant)
  merchantModel: Repository<Merchant>;

  @InjectEntityModel(MerchantApplication)
  merchantAppModel: Repository<MerchantApplication>;

  @InjectEntityModel(Banner)
  bannerModel: Repository<Banner>;

  @InjectEntityModel(Announcement)
  announcementModel: Repository<Announcement>;

  @InjectEntityModel(Recommendation)
  recommendationModel: Repository<Recommendation>;

  @InjectEntityModel(SystemMessage)
  messageModel: Repository<SystemMessage>;

  @InjectEntityModel(FinanceRecord)
  financeModel: Repository<FinanceRecord>;

  @InjectEntityModel(SystemConfig)
  configModel: Repository<SystemConfig>;

  @InjectEntityModel(OperationLog)
  logModel: Repository<OperationLog>;

  @InjectEntityModel(SensitiveWord)
  sensitiveWordModel: Repository<SensitiveWord>;

  @InjectEntityModel(ActivityBanner)
  activityBannerModel: Repository<ActivityBanner>;

  @InjectEntityModel(MessageTemplate)
  messageTemplateModel: Repository<MessageTemplate>;

  @Inject()
  ctx: Context;

  private async log(action: string, target: string, targetId?: number, detail?: string) {
    try {
      const adminId = this.ctx?.user?.adminId || 1;
      await this.logModel.save({ adminId, action, target, targetId, detail, ip: this.ctx?.ip || '' });
    } catch (_) { /* 日志记录失败不影响主操作 */ }
  }

  // ===== 用户管理（游客） =====

  async listUsers(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    // 显示所有用户（含软删除的），用 deleted_at 是否存在判断状态
    let sql =
      'SELECT id, nickname, phone, avatar, created_at AS createdAt, IF(deleted_at IS NULL, 1, 0) AS status FROM wd_user';
    const params: any[] = [];
    if (keyword) {
      sql += ' WHERE (nickname LIKE ? OR phone LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(pageSize), (page - 1) * Number(pageSize));
    const list = await this.adminModel.query(sql, params);
    const countResult = await this.adminModel.query(
      'SELECT COUNT(*) AS total FROM wd_user',
      [],
    );
    const total = Number(countResult[0]?.total || 0);
    return {
      list,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        total,
        totalPages: Math.ceil(total / Number(pageSize)),
      },
    };
  }

  async toggleUserStatus(id: number, status: number) {
    if (status === 0) {
      await this.adminModel.query('UPDATE wd_user SET deleted_at = NOW() WHERE id = ?', [id]);
    } else {
      await this.adminModel.query('UPDATE wd_user SET deleted_at = NULL WHERE id = ?', [id]);
    }
    await this.log('toggleUserStatus', 'user', id, status === 0 ? '封禁用户' : '解封用户');
    return { success: true };
  }

  async getUserDetail(id: number) {
    const users = await this.adminModel.query(
      'SELECT id, nickname, phone, avatar, created_at AS createdAt, IF(deleted_at IS NULL, 1, 0) AS status FROM wd_user WHERE id = ?',
      [id],
    );
    if (!users.length) throw new Error('用户不存在');
    return users[0];
  }

  async updateUser(id: number, data: any) {
    const fields: string[] = [];
    const params: any[] = [];
    if (data.nickname !== undefined) { fields.push('nickname = ?'); params.push(data.nickname); }
    if (data.phone !== undefined) { fields.push('phone = ?'); params.push(data.phone); }
    if (data.avatar !== undefined) { fields.push('avatar = ?'); params.push(data.avatar); }
    if (fields.length === 0) throw new Error('没有需要更新的字段');
    params.push(id);
    await this.adminModel.query(`UPDATE wd_user SET ${fields.join(', ')} WHERE id = ?`, params);
    return { success: true };
  }

  // ===== 商家管理 =====

  async listMerchants(query: any) {
    const { page = 1, pageSize = 10, status, module } = query;
    const qb = this.merchantModel
      .createQueryBuilder('m')
      .where('m.deletedAt IS NULL')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('m.createdAt', 'DESC');
    if (status !== undefined) qb.andWhere('m.status = :st', { st: Number(status) });
    if (module) qb.andWhere('m.module = :mod', { mod: module });
    const [list, total] = await qb.getManyAndCount();
    const enriched = await Promise.all(
      list.map(async (m: any) => {
        const user = await this.adminModel.query(
          'SELECT nickname, phone FROM wd_user WHERE id = ?',
          [m.userId],
        );
        // 从对应业务表获取封面图
        let coverImage = '';
        if (m.module === 'food') {
          const r = await this.adminModel.query(
            'SELECT cover_image AS img FROM wd_food_restaurant WHERE name = ? AND deleted_at IS NULL LIMIT 1', [m.shopName]);
          coverImage = r[0]?.img || '';
        } else if (m.module === 'accommodation') {
          const r = await this.adminModel.query(
            'SELECT cover_image AS img FROM wd_accommodation_homestay WHERE name = ? AND deleted_at IS NULL LIMIT 1', [m.shopName]);
          coverImage = r[0]?.img || '';
        }
        return {
          ...m, coverImage,
          userName: user[0]?.nickname || '-',
          userPhone: user[0]?.phone || '-',
        };
      }),
    );
    return {
      list: enriched,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        total,
        totalPages: Math.ceil(total / Number(pageSize)),
      },
    };
  }

  // ===== 角色权限 =====

  async listRoles() {
    return this.roleModel.find({ where: { deletedAt: undefined } });
  }

  async createRole(data: any) {
    const result = await this.roleModel.save(data);
    await this.log('createRole', 'role', result.id, `创建角色: ${data.name || ''}`);
    return result;
  }

  async updateRole(id: number, data: any) {
    await this.roleModel.update(id, data);
    await this.log('updateRole', 'role', id, '更新角色');
    return this.roleModel.findOne({ where: { id, deletedAt: undefined } });
  }

  async deleteRole(id: number) {
    await this.roleModel.softDelete(id);
    await this.log('deleteRole', 'role', id, '删除角色');
  }

  async forceLogoutMerchant(id: number) {
    await this.merchantModel.update(id, { status: 0 } as any);
    await this.log('forceLogout', 'merchant', id, '强制商家下线');
    return { success: true };
  }

  async updateMerchantStatus(id: number, status: number) {
    if (![0, 1, 2, 3].includes(status)) throw new Error('无效的状态值');
    await this.merchantModel.update(id, { status } as any);
    const labels = ['待审核', '已通过', '已驳回', '已封禁'];
    await this.log('updateMerchantStatus', 'merchant', id, `状态→${labels[status] || status}`);
    return { success: true };
  }

  // ===== 入驻审核 =====

  async listApplications(query: any) {
    const { page = 1, pageSize = 10, status } = query;
    const qb = this.merchantAppModel
      .createQueryBuilder('a')
      .where('a.deletedAt IS NULL')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('a.createdAt', 'DESC');
    if (status !== undefined) qb.andWhere('a.status = :st', { st: Number(status) });
    const [list, total] = await qb.getManyAndCount();
    const enriched = await Promise.all(
      list.map(async (a: any) => {
        const user = await this.adminModel.query(
          'SELECT nickname, phone FROM wd_user WHERE id = ?',
          [a.userId],
        );
        return {
          ...a,
          userName: user[0]?.nickname || '-',
          userPhone: user[0]?.phone || '-',
        };
      }),
    );
    return {
      list: enriched,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        total,
        totalPages: Math.ceil(total / Number(pageSize)),
      },
    };
  }

  async reviewApplication(
    id: number,
    reviewerId: number,
    status: number,
    rejectReason?: string,
  ) {
    const app = await this.merchantAppModel.findOne({ where: { id, deletedAt: undefined } });
    if (!app) throw new Error('申请不存在');

    await this.merchantAppModel.update(id, {
      status,
      reviewerId,
      rejectReason: rejectReason || null,
      reviewedAt: new Date(),
    } as any);

    if (status === 1) {
      // 通过 — 创建商家账号
      const existing = await this.merchantModel.findOne({
        where: { userId: app.userId, module: app.module, deletedAt: undefined },
      });
      if (!existing) {
        await this.merchantModel.save({
          userId: app.userId,
          user_id: app.userId,
          shopName: app.shopName,
          module: app.module,
          contactPerson: app.contactPerson,
          contactPhone: app.contactPhone,
          shopType: 1,
          status: 1,
          approvedAt: new Date(),
        } as any);
      }
    }
    const labels = ['待审核', '已通过', '已驳回', '已封禁'];
    await this.log('reviewApplication', 'merchant_application', id, `审核入驻申请: ${labels[status] || status}${rejectReason ? ' 原因:' + rejectReason : ''}`);
    return { success: true };
  }

  async submitApplication(userId: number, data: any) {
    const app = await this.merchantAppModel.save({
      userId,
      shopName: data.shopName,
      module: data.module,
      contactPerson: data.contactPerson || '',
      contactPhone: data.contactPhone || '',
      status: 0,
    });
    await this.log('submitApplication', 'merchant_application', app.id, '提交入驻申请');
    return { success: true, message: '申请已提交，等待审核' };
  }

  // ===== 数据看板 =====

  async getDashboard() {
    const today = new Date().toISOString().slice(0, 10);

    // ===== 平台总览 =====
    const allOrdersCount = await this.adminModel.query(
      `SELECT COUNT(*) AS total FROM wd_order WHERE deleted_at IS NULL`,
    );
    const orderStats = await this.adminModel.query(
      `SELECT COUNT(*) AS cnt, COALESCE(SUM(pay_amount),0) AS gmv FROM wd_order WHERE deleted_at IS NULL AND status IN ('paid','confirmed','completed')`,
    );
    const todayOrders = await this.adminModel.query(
      `SELECT COUNT(*) AS total FROM wd_order WHERE deleted_at IS NULL AND DATE(created_at) = ?`, [today],
    );
    const dau = await this.adminModel.query(
      `SELECT
        SUM(IF(DATE(last_login_at)=?,1,0)) AS today,
        SUM(IF(last_login_at>=DATE_SUB(CURDATE(),INTERVAL 7 DAY),1,0)) AS week,
        SUM(IF(last_login_at>=DATE_SUB(CURDATE(),INTERVAL 30 DAY),1,0)) AS month
       FROM wd_user WHERE deleted_at IS NULL`, [today],
    );
    const newUsers = await this.adminModel.query(
      `SELECT COUNT(*) AS total FROM wd_user WHERE deleted_at IS NULL AND DATE(created_at)=?`, [today],
    );
    const totalUsers = await this.adminModel.query(
      `SELECT COUNT(*) AS total FROM wd_user WHERE deleted_at IS NULL`,
    );

    // ===== 订单数据 =====
    const moduleOrders = await this.adminModel.query(
      `SELECT order_type AS module, COUNT(*) AS count FROM wd_order WHERE deleted_at IS NULL GROUP BY order_type`,
    );
    const moduleGMV = await this.adminModel.query(
      `SELECT order_type AS module, COALESCE(SUM(pay_amount),0) AS gmv FROM wd_order WHERE deleted_at IS NULL AND status IN ('paid','confirmed','completed') GROUP BY order_type`,
    );
    const conversionRes = await this.adminModel.query(
      `SELECT
        COUNT(*) AS total,
        SUM(IF(status NOT IN ('pending_pay','cancelled'),1,0)) AS paid
       FROM wd_order WHERE deleted_at IS NULL`,
    );

    // ===== 用户数据 =====
    const userGrowth = await this.adminModel.query(
      `SELECT DATE(created_at) AS day, COUNT(*) AS count FROM wd_user WHERE deleted_at IS NULL AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) GROUP BY DATE(created_at) ORDER BY day ASC`,
    );
    // 用户分层：按消费总金额
    const userSeg = await this.adminModel.query(
      `SELECT
        CASE
          WHEN total_spend >= 1000 THEN '高消费'
          WHEN total_spend >= 300 THEN '中消费'
          WHEN total_spend > 0 THEN '低消费'
          ELSE '未消费'
        END AS level,
        COUNT(*) AS count FROM (
          SELECT u.id, COALESCE(SUM(o.pay_amount),0) AS total_spend
          FROM wd_user u LEFT JOIN wd_order o ON u.id=o.user_id AND o.deleted_at IS NULL AND o.status IN ('paid','confirmed','completed')
          WHERE u.deleted_at IS NULL GROUP BY u.id
        ) AS spend GROUP BY level`,
    );

    // ===== 内容数据 =====
    const travelogueCount = await this.adminModel.query(
      `SELECT COUNT(*) AS total FROM wd_community_travelogue WHERE deleted_at IS NULL`,
    );
    const totalLikes = await this.adminModel.query(
      `SELECT COUNT(*) AS total FROM wd_community_like`,
    );
    const hotTopics = await this.adminModel.query(
      `SELECT t.name, COUNT(tr.id) AS count
       FROM wd_community_topic t LEFT JOIN wd_community_travelogue tr ON tr.topic_id=t.id AND tr.deleted_at IS NULL
       WHERE t.deleted_at IS NULL GROUP BY t.id ORDER BY count DESC LIMIT 5`,
    );

    // ===== 商家数据 =====
    // 统计所有有数据的业务主体（餐厅+民宿+商品+景区），活跃商家算审核通过的
    const totalMerchants = await this.adminModel.query(
      `SELECT COUNT(*) AS total FROM (
        SELECT name, 'restaurant' FROM wd_food_restaurant WHERE deleted_at IS NULL
        UNION
        SELECT name, 'homestay' FROM wd_accommodation_homestay WHERE deleted_at IS NULL
        UNION
        SELECT name, 'product' FROM wd_clothing_product WHERE deleted_at IS NULL
        UNION
        SELECT name, 'scenic' FROM wd_travel_scenic_spot WHERE deleted_at IS NULL
      ) AS biz`,
    );
    const activeMerchants = await this.merchantModel.count({ where: { status: 1, deletedAt: undefined } });
    const topMerchants = await this.adminModel.query(
      `SELECT m.shopName AS name, COUNT(o.id) AS orderCount, COALESCE(SUM(o.pay_amount),0) AS gmv
       FROM wd_admin_merchant m LEFT JOIN wd_order o ON o.merchant_id=m.id AND o.deleted_at IS NULL AND o.status IN ('paid','confirmed','completed')
       WHERE m.deleted_at IS NULL GROUP BY m.id ORDER BY gmv DESC LIMIT 5`,
    );

    // ===== 财务数据（按模块抽佣比例计算） =====
    const financeStats = await this.adminModel.query(
      `SELECT
        COALESCE(SUM(pay_amount),0) AS totalRevenue,
        COALESCE(SUM(
          CASE
            WHEN order_type = 'clothing' THEN pay_amount * 0.05
            WHEN order_type IN ('food_meal','food_product') THEN pay_amount * 0.10
            WHEN order_type = 'accommodation' THEN pay_amount * 0.10
            WHEN order_type = 'travel' THEN pay_amount * 0.10
            ELSE pay_amount * 0.05
          END
        ),0) AS platformIncome
       FROM wd_order WHERE deleted_at IS NULL AND status IN ('paid','confirmed','completed')`,
    );
    const pendingSettlement = await this.adminModel.query(
      `SELECT COALESCE(SUM(pay_amount),0) AS total FROM wd_order WHERE deleted_at IS NULL AND status IN ('paid','confirmed')`,
    );

    // ===== 近7天订单趋势 + 最近订单 =====
    const dailyOrders = await this.adminModel.query(
      `SELECT DATE(created_at) AS day, COUNT(*) AS count FROM wd_order WHERE deleted_at IS NULL AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) GROUP BY DATE(created_at) ORDER BY day ASC`,
    );
    const recentOrders = await this.adminModel.query(
      `SELECT o.id, o.order_no AS orderNo, o.total_amount AS amount, o.status, o.created_at AS createdAt, u.nickname AS userName, o.order_type AS module
       FROM wd_order o LEFT JOIN wd_user u ON o.user_id = u.id
       WHERE o.deleted_at IS NULL ORDER BY o.created_at DESC LIMIT 10`,
    );

    const conv = conversionRes[0] || { total: 0, paid: 0 };

    // ===== 涨跌幅计算（今日 vs 昨日） =====
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const chGMV = await this.adminModel.query(
      `SELECT
        COALESCE(SUM(CASE WHEN DATE(created_at)=? THEN pay_amount ELSE 0 END),0) AS today,
        COALESCE(SUM(CASE WHEN DATE(created_at)=? THEN pay_amount ELSE 0 END),0) AS yesterday
       FROM wd_order WHERE deleted_at IS NULL AND status IN ('paid','confirmed','completed')`,
      [todayStr, yesterdayStr],
    );
    const chOrders = await this.adminModel.query(
      `SELECT
        COUNT(CASE WHEN DATE(created_at)=? THEN 1 END) AS today,
        COUNT(CASE WHEN DATE(created_at)=? THEN 1 END) AS yesterday
       FROM wd_order WHERE deleted_at IS NULL`,
      [todayStr, yesterdayStr],
    );
    const chUsers = await this.adminModel.query(
      `SELECT
        COUNT(CASE WHEN DATE(created_at)=? THEN 1 END) AS today,
        COUNT(CASE WHEN DATE(created_at)=? THEN 1 END) AS yesterday
       FROM wd_user WHERE deleted_at IS NULL`,
      [todayStr, yesterdayStr],
    );
    const calcCh = (t: number, y: number) => y > 0 ? Number(((t - y) / y * 100).toFixed(1)) : 0;

    return {
      // 涨跌幅
      chGMV: calcCh(Number(chGMV[0]?.today || 0), Number(chGMV[0]?.yesterday || 0)),
      chOrders: calcCh(Number(chOrders[0]?.today || 0), Number(chOrders[0]?.yesterday || 0)),
      chNewUsers: calcCh(Number(chUsers[0]?.today || 0), Number(chUsers[0]?.yesterday || 0)),
      // 平台总览
      todayDAU: Number(dau[0]?.today || 0),
      weekDAU: Number(dau[0]?.week || 0),
      monthDAU: Number(dau[0]?.month || 0),
      newUsers: Number(newUsers[0]?.total || 0),
      totalOrders: Number(allOrdersCount[0]?.total || 0),
      paidOrders: Number(orderStats[0]?.cnt || 0),
      totalGMV: Number(orderStats[0]?.gmv || 0),
      totalUsers: Number(totalUsers[0]?.total || 0),
      // 订单数据
      moduleOrders: moduleOrders.map((r: any) => ({ module: r.module, count: Number(r.count) })),
      moduleGMV: moduleGMV.map((r: any) => ({ module: r.module, gmv: Number(r.gmv) })),
      conversionRate: conv.total > 0 ? Number(((conv.paid / conv.total) * 100).toFixed(1)) : 0,
      // 用户数据
      userGrowth: userGrowth.map((r: any) => ({ day: r.day, count: Number(r.count) })),
      userSegmentation: userSeg.map((r: any) => ({ level: r.level, count: Number(r.count) })),
      // 内容数据
      totalTravelogues: Number(travelogueCount[0]?.total || 0),
      totalLikes: Number(totalLikes[0]?.total || 0),
      hotTopics: hotTopics.map((r: any) => ({ name: r.name, count: Number(r.count) })),
      // 商家数据
      totalMerchants: Number(totalMerchants[0]?.total || 0),
      activeMerchants,
      topMerchants: topMerchants.map((r: any) => ({
        name: r.name,
        orderCount: Number(r.orderCount),
        gmv: Number(r.gmv),
      })),
      // 财务数据
      totalRevenue: Number(financeStats[0]?.totalRevenue || 0),
      platformIncome: Number(financeStats[0]?.platformIncome || 0),
      pendingSettlement: Number(pendingSettlement[0]?.total || 0),
      // 订单趋势 + 最近订单
      dailyOrders: dailyOrders.map((r: any) => ({ day: r.day, count: Number(r.count) })),
      recentOrders: recentOrders.map((r: any) => ({
        orderNo: r.orderNo,
        userName: r.userName || '匿名',
        amount: Number(r.amount),
        status: r.status,
        createdAt: r.createdAt,
        module: r.module,
      })),
    };
  }

  // ===== 轮播图 CRUD =====

  async listBanners() {
    return this.bannerModel.find({
      where: { deletedAt: undefined },
      order: { sortOrder: 'ASC' } as any,
    });
  }

  async createBanner(data: any) {
    const result = await this.bannerModel.save(data);
    await this.log('createBanner', 'banner', result.id, '创建轮播图');
    return result;
  }

  async updateBanner(id: number, data: any) {
    await this.bannerModel.update(id, data);
    await this.log('updateBanner', 'banner', id, '更新轮播图');
    return this.bannerModel.findOne({ where: { id } });
  }

  async deleteBanner(id: number) {
    await this.bannerModel.softDelete(id);
    await this.log('deleteBanner', 'banner', id, '删除轮播图');
  }

  // ===== 公告 CRUD =====

  async listAnnouncements(q: any) {
    const { page = 1, pageSize = 10 } = q;
    const [list, total] = await this.announcementModel.findAndCount({
      where: { deletedAt: undefined },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      list,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        total,
        totalPages: Math.ceil(total / Number(pageSize)),
      },
    };
  }

  async createAnnouncement(data: any) {
    const result = await this.announcementModel.save(data);
    await this.log('createAnnouncement', 'announcement', result.id, '创建公告');
    return result;
  }

  async updateAnnouncement(id: number, data: any) {
    await this.announcementModel.update(id, data);
    await this.log('updateAnnouncement', 'announcement', id, '更新公告');
    return this.announcementModel.findOne({ where: { id } });
  }

  async deleteAnnouncement(id: number) {
    await this.announcementModel.softDelete(id);
    await this.log('deleteAnnouncement', 'announcement', id, '删除公告');
  }

  // ===== 推荐位 CRUD =====

  async listRecommendations() {
    return this.recommendationModel.find({
      where: { deletedAt: undefined },
      order: { sortOrder: 'ASC' } as any,
    });
  }

  async getFeaturedRecommendations() {
    const recs = await this.recommendationModel.find({
      where: { deletedAt: undefined, status: 1 },
      order: { sortOrder: 'ASC' } as any,
    });
    const enriched = await Promise.all(recs.map(async (r: any) => {
      try {
        let content = null;
        switch (r.contentType) {
          case 'product':
            content = await this.adminModel.query('SELECT id, name, main_image AS mainImage, price, sales, rating FROM wd_clothing_product WHERE id = ? AND deleted_at IS NULL', [r.contentId]);
            break;
          case 'restaurant':
            content = await this.adminModel.query('SELECT id, name, cover_image AS coverImage, rating, address FROM wd_food_restaurant WHERE id = ? AND deleted_at IS NULL', [r.contentId]);
            break;
          case 'homestay':
            content = await this.adminModel.query('SELECT id, name, cover_image AS coverImage, rating, min_price AS minPrice FROM wd_accommodation_homestay WHERE id = ? AND deleted_at IS NULL', [r.contentId]);
            break;
          case 'route':
            content = await this.adminModel.query('SELECT id, name, cover_image AS coverImage, price, duration FROM wd_travel_route WHERE id = ? AND deleted_at IS NULL', [r.contentId]);
            break;
          case 'travelogue':
            content = await this.adminModel.query('SELECT id, title AS name, cover_image AS coverImage, view_count AS viewCount FROM wd_community_travelogue WHERE id = ? AND deleted_at IS NULL', [r.contentId]);
            break;
        }
        return { ...r, content: content?.[0] || null };
      } catch { return { ...r, content: null }; }
    }));
    return enriched;
  }

  async createRecommendation(data: any) {
    const result = await this.recommendationModel.save(data);
    await this.log('createRecommendation', 'recommendation', result.id, '创建推荐位');
    return result;
  }

  async updateRecommendation(id: number, data: any) {
    await this.recommendationModel.update(id, data);
    await this.log('updateRecommendation', 'recommendation', id, '更新推荐位');
    return this.recommendationModel.findOne({ where: { id } });
  }

  async deleteRecommendation(id: number) {
    await this.recommendationModel.softDelete(id);
    await this.log('deleteRecommendation', 'recommendation', id, '删除推荐位');
  }

  // ===== 系统消息 =====

  async listMessages(query: any) {
    const { page = 1, pageSize = 10, userId } = query;
    const qb = this.messageModel
      .createQueryBuilder('m')
      .where('m.deletedAt IS NULL')
      .orderBy('m.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);
    if (userId) {
      qb.andWhere('(m.userId = :userId OR m.userId IS NULL)', { userId: Number(userId) });
    }
    const [list, total] = await qb.getManyAndCount();
    return {
      list,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        total,
        totalPages: Math.ceil(total / Number(pageSize)),
      },
    };
  }

  async sendMessage(data: any) {
    let result;
    if (data.userId) {
      result = await this.messageModel.save(data);
    } else {
      result = await this.messageModel.save({ ...data, userId: null });
    }
    await this.log('sendMessage', 'message', result.id, '发送系统消息');
    return result;
  }

  // ===== 财务 =====

  async listFinance(query: any) {
    const { page = 1, pageSize = 10, status, orderNo, shopName, amount, platformFee, merchantIncome } = query;
    const qb = this.financeModel
      .createQueryBuilder('f')
      .where('f.deletedAt IS NULL')
      .orderBy('f.createdAt', 'DESC');
    if (status !== undefined && status !== '' && status !== null) {
      qb.andWhere('f.status = :st', { st: Number(status) });
    }
    if (amount !== undefined && amount !== '') {
      qb.andWhere('f.amount LIKE :amount LIKE', { amount: `%${amount}%` });
    }
    if (platformFee !== undefined && platformFee !== '') {
      qb.andWhere('f.platformFee LIKE :platformFee', { platformFee: `%${platformFee}%` });
    }
    if (merchantIncome !== undefined && merchantIncome !== '') {
      qb.andWhere('f.merchantIncome LIKE :merchantIncome', { merchantIncome: `%${merchantIncome}%` });
    }
    const total = await qb.getCount();
    qb.skip((page - 1) * pageSize).take(pageSize);
    let list = await qb.getMany();
    let enriched = await Promise.all(
      list.map(async (f: any) => {
        const order = await this.adminModel.query(
          'SELECT order_no AS orderNo FROM wd_order WHERE id = ?',
          [f.orderId],
        );
        const merchant = await this.merchantModel.findOne({
          where: { id: f.merchantId },
        });
        return {
          ...f,
          orderNo: order[0]?.orderNo || '-',
          shopName: merchant?.shopName || '-',
        };
      }),
    );
    if (orderNo) {
      enriched = enriched.filter((f: any) => f.orderNo.includes(orderNo));
    }
    if (shopName) {
      enriched = enriched.filter((f: any) => f.shopName.includes(shopName));
    }
    return {
      list: enriched,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        total: enriched.length,
        totalPages: Math.ceil(enriched.length / Number(pageSize)),
      },
    };
  }

  // ===== 系统配置 =====

  async getConfig(key?: string) {
    if (key) return this.configModel.findOne({ where: { key } });
    return this.configModel.find({ where: { deletedAt: undefined } });
  }

  async setConfig(key: string, value: string) {
    const existing = await this.configModel.findOne({ where: { key } });
    if (existing) {
      await this.configModel.update(existing.id, { value } as any);
      await this.log('setConfig', 'config', existing.id, `设置配置: ${key}=${value}`);
      return existing;
    }
    const result = await this.configModel.save({ key, value } as any);
    await this.log('setConfig', 'config', result.id, `创建配置: ${key}=${value}`);
    return result;
  }

  // ===== 敏感词 =====

  async listSensitiveWords() {
    return this.sensitiveWordModel.find({
      where: { deletedAt: undefined },
      order: { createdAt: 'DESC' },
    });
  }

  async createSensitiveWord(data: any) {
    const existing = await this.sensitiveWordModel.findOne({ where: { word: data.word } });
    if (existing) {
      return { success: false, message: '该敏感词已存在' };
    }
    const result = await this.sensitiveWordModel.save(data);
    await this.log('createSensitiveWord', 'sensitive_word', result.id, `添加敏感词: ${data.word}`);
    return result;
  }

  async deleteSensitiveWord(id: number) {
    await this.sensitiveWordModel.softDelete(id);
    await this.log('deleteSensitiveWord', 'sensitive_word', id, '删除敏感词');
  }

  // ===== 操作日志 =====

  async listOperationLogs(query: any) {
    const { page = 1, pageSize = 10 } = query;
    const qb = this.logModel
      .createQueryBuilder('l')
      .where('l.deletedAt IS NULL')
      .orderBy('l.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    const enriched = await Promise.all(
      list.map(async (l: any) => {
        const admin = await this.adminModel.findOne({
          where: { id: l.adminId },
        });
        return { ...l, adminName: admin?.username || '-' };
      }),
    );
    return {
      list: enriched,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        total,
        totalPages: Math.ceil(total / Number(pageSize)),
      },
    };
  }

  async logOperation(
    adminId: number,
    action: string,
    target: string,
    targetId?: number,
    detail?: string,
    ip?: string,
  ) {
    return this.logModel.save({
      adminId,
      action,
      target,
      targetId,
      detail,
      ip,
    } as any);
  }

  // ===== 活动横幅 CRUD =====

  async listActivityBanners() {
    return this.activityBannerModel.find({
      where: { deletedAt: undefined },
      order: { sortOrder: 'ASC' } as any,
    });
  }

  async createActivityBanner(data: any) {
    const result = await this.activityBannerModel.save(data);
    await this.log('createActivityBanner', 'activity_banner', result.id, '创建活动横幅');
    return result;
  }

  async updateActivityBanner(id: number, data: any) {
    await this.activityBannerModel.update(id, data);
    await this.log('updateActivityBanner', 'activity_banner', id, '更新活动横幅');
    return this.activityBannerModel.findOne({ where: { id } });
  }

  async deleteActivityBanner(id: number) {
    await this.activityBannerModel.softDelete(id);
    await this.log('deleteActivityBanner', 'activity_banner', id, '删除活动横幅');
  }

  // ===== 消息模板 CRUD =====

  async listMessageTemplates(q: any) {
    const { page = 1, pageSize = 10, type } = q;
    const qb = this.messageTemplateModel
      .createQueryBuilder('t')
      .where('t.deletedAt IS NULL')
      .orderBy('t.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);
    if (type) qb.andWhere('t.type = :tp', { tp: type });
    const [list, total] = await qb.getManyAndCount();
    return {
      list,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        total,
        totalPages: Math.ceil(total / Number(pageSize)),
      },
    };
  }

  async createMessageTemplate(data: any) {
    const result = await this.messageTemplateModel.save(data);
    await this.log('createMessageTemplate', 'message_template', result.id, '创建消息模板');
    return result;
  }

  async updateMessageTemplate(id: number, data: any) {
    await this.messageTemplateModel.update(id, data);
    await this.log('updateMessageTemplate', 'message_template', id, '更新消息模板');
    return this.messageTemplateModel.findOne({ where: { id } });
  }

  async deleteMessageTemplate(id: number) {
    await this.messageTemplateModel.softDelete(id);
    await this.log('deleteMessageTemplate', 'message_template', id, '删除消息模板');
  }
}
