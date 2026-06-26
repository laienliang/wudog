import { Provide } from '@midwayjs/core';
import { Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { PlatformBannerEntity } from '../entity/banner';
import { OrderBaseEntity } from '../../order/entity/base';
import { OrderService } from '../../order/service/base';
import { ClothingGoodsEntity } from '../../clothing/entity/goods';
import { ClothingCategoryEntity } from '../../clothing/entity/category';
import { ClothingReviewEntity } from '../../clothing/entity/review';
import { ClothingCollectEntity } from '../../clothing/entity/collect';
import { FoodRestaurantEntity } from '../../food/entity/restaurant';
import { FoodDishEntity } from '../../food/entity/dish';
import { FoodAgricultureGoodsEntity } from '../../food/entity/agricultureGoods';
import { FoodReviewEntity } from '../../food/entity/review';
import { LodgingHostelEntity } from '../../lodging/entity/hostel';
import { LodgingRoomTypeEntity } from '../../lodging/entity/roomType';
import { LodgingReviewEntity } from '../../lodging/entity/review';
import { TravelScenicEntity } from '../../travel/entity/scenic';
import { TravelRouteEntity } from '../../travel/entity/route';
import { TravelRouteDayEntity } from '../../travel/entity/routeDay';
import { TravelGuideEntity } from '../../travel/entity/guide';
import { TravelTicketTypeEntity } from '../../travel/entity/ticketType';
import { TravelReviewEntity } from '../../travel/entity/review';
import { CommunityArticleEntity } from '../../community/entity/article';
import { CommunityTopicEntity } from '../../community/entity/topic';
import { CommunityCommentEntity } from '../../community/entity/comment';
import { CartItemEntity } from '../../cart/entity/item';

type ClientType =
  | 'clothing'
  | 'restaurant'
  | 'agriculture'
  | 'lodging'
  | 'scenic'
  | 'route'
  | 'guide'
  | 'article';

type PageQuery = {
  page?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: number;
  status?: number;
};

type AddCartInput = {
  userId?: number;
  goodsId?: number;
  moduleType?: number;
  skuId?: number;
  skuName?: string;
  quantity?: number;
};

@Provide()
export class PlatformClientService {
  @InjectEntityModel(PlatformBannerEntity)
  bannerRepo: Repository<PlatformBannerEntity>;

  @InjectEntityModel(ClothingGoodsEntity)
  clothingRepo: Repository<ClothingGoodsEntity>;

  @InjectEntityModel(ClothingCategoryEntity)
  clothingCategoryRepo: Repository<ClothingCategoryEntity>;

  @InjectEntityModel(ClothingReviewEntity)
  clothingReviewRepo: Repository<ClothingReviewEntity>;

  @InjectEntityModel(ClothingCollectEntity)
  clothingCollectRepo: Repository<ClothingCollectEntity>;

  @InjectEntityModel(FoodRestaurantEntity)
  restaurantRepo: Repository<FoodRestaurantEntity>;

  @InjectEntityModel(FoodDishEntity)
  dishRepo: Repository<FoodDishEntity>;

  @InjectEntityModel(FoodAgricultureGoodsEntity)
  agricultureRepo: Repository<FoodAgricultureGoodsEntity>;

  @InjectEntityModel(FoodReviewEntity)
  foodReviewRepo: Repository<FoodReviewEntity>;

  @InjectEntityModel(LodgingHostelEntity)
  hostelRepo: Repository<LodgingHostelEntity>;

  @InjectEntityModel(LodgingRoomTypeEntity)
  roomTypeRepo: Repository<LodgingRoomTypeEntity>;

  @InjectEntityModel(LodgingReviewEntity)
  lodgingReviewRepo: Repository<LodgingReviewEntity>;

  @InjectEntityModel(TravelScenicEntity)
  scenicRepo: Repository<TravelScenicEntity>;

  @InjectEntityModel(TravelRouteEntity)
  routeRepo: Repository<TravelRouteEntity>;

  @InjectEntityModel(TravelRouteDayEntity)
  routeDayRepo: Repository<TravelRouteDayEntity>;

  @InjectEntityModel(TravelGuideEntity)
  guideRepo: Repository<TravelGuideEntity>;

  @InjectEntityModel(TravelTicketTypeEntity)
  ticketTypeRepo: Repository<TravelTicketTypeEntity>;

  @InjectEntityModel(TravelReviewEntity)
  travelReviewRepo: Repository<TravelReviewEntity>;

  @InjectEntityModel(CommunityArticleEntity)
  articleRepo: Repository<CommunityArticleEntity>;

  @InjectEntityModel(CommunityTopicEntity)
  topicRepo: Repository<CommunityTopicEntity>;

  @InjectEntityModel(CommunityCommentEntity)
  commentRepo: Repository<CommunityCommentEntity>;

  @InjectEntityModel(CartItemEntity)
  cartRepo: Repository<CartItemEntity>;

  @InjectEntityModel(OrderBaseEntity)
  orderRepo: Repository<OrderBaseEntity>;

  @Inject()
  orderService: OrderService;

  async home() {
    const [banners, clothing, restaurants, lodging, routes, articles] =
      await Promise.all([
        this.bannerRepo.find({
          where: { status: 1 },
          order: { sort: 'ASC', id: 'DESC' },
          take: 5,
        }),
        this.clothingRepo.find({
          where: { status: 1 },
          order: { sales: 'DESC', id: 'DESC' },
          take: 8,
        }),
        this.restaurantRepo.find({
          where: { status: 1 },
          order: { rating: 'DESC', id: 'DESC' },
          take: 8,
        }),
        this.hostelRepo.find({
          where: { status: 1 },
          order: { rating: 'DESC', id: 'DESC' },
          take: 8,
        }),
        this.routeRepo.find({
          where: { status: 1 },
          order: { id: 'DESC' },
          take: 8,
        }),
        this.articleRepo.find({
          where: { status: 1 },
          order: { likes: 'DESC', id: 'DESC' },
          take: 6,
        }),
      ]);

    return {
      banners: banners.map(item => ({
        id: item.id,
        title: item.title,
        image: item.imageUrl,
        link: item.linkUrl,
      })),
      hot: {
        clothing: clothing.map(item => this.toCard('clothing', item)),
        food: restaurants.map(item => this.toCard('restaurant', item)),
        lodging: lodging.map(item => this.toCard('lodging', item)),
        travel: routes.map(item => this.toCard('route', item)),
      },
      articles: articles.map(item => this.toCard('article', item)),
    };
  }

  async search(keyword = '', limit = 8) {
    const word = `%${keyword.trim()}%`;
    if (!keyword.trim()) {
      return { list: [] };
    }

    const [goods, restaurants, agriculture, hostels, scenics, routes, articles] =
      await Promise.all([
        this.clothingRepo.find({
          where: [
            { status: 1, title: Like(word) },
            { status: 1, subtitle: Like(word) },
          ],
          take: limit,
        }),
        this.restaurantRepo.find({
          where: [
            { status: 1, name: Like(word) },
            { status: 1, address: Like(word) },
          ],
          take: limit,
        }),
        this.agricultureRepo.find({
          where: { status: 1, name: Like(word) },
          take: limit,
        }),
        this.hostelRepo.find({
          where: [
            { status: 1, name: Like(word) },
            { status: 1, address: Like(word) },
          ],
          take: limit,
        }),
        this.scenicRepo.find({
          where: [
            { status: 1, name: Like(word) },
            { status: 1, address: Like(word) },
          ],
          take: limit,
        }),
        this.routeRepo.find({
          where: { status: 1, title: Like(word) },
          take: limit,
        }),
        this.articleRepo.find({
          where: [
            { status: 1, title: Like(word) },
            { status: 1, content: Like(word) },
          ],
          take: limit,
        }),
      ]);

    const list = [
      ...goods.map(item => this.toCard('clothing', item)),
      ...restaurants.map(item => this.toCard('restaurant', item)),
      ...agriculture.map(item => this.toCard('agriculture', item)),
      ...hostels.map(item => this.toCard('lodging', item)),
      ...scenics.map(item => this.toCard('scenic', item)),
      ...routes.map(item => this.toCard('route', item)),
      ...articles.map(item => this.toCard('article', item)),
    ];

    return { list: list.slice(0, limit * 3) };
  }

  async page(type: ClientType, query: PageQuery) {
    const page = Math.max(Number(query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(query.pageSize) || 12, 1), 50);
    const [list, total] = await this.repo(type).findAndCount({
      where: this.buildWhere(type, query),
      order: { id: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      list: list.map(item => this.toCard(type, item)),
      pagination: {
        page,
        pageSize,
        total,
        totalPage: Math.ceil(total / pageSize),
      },
    };
  }

  async detail(type: ClientType, id: number) {
    const data = await this.repo(type).findOne({ where: { id } as any });
    if (!data) {
      return null;
    }

    const card = this.toCard(type, data);
    const extra: Record<string, unknown> = {};

    if (type === 'clothing') {
      extra.reviews = await this.clothingReviewRepo.find({
        where: { goodsId: id },
        order: { id: 'DESC' },
        take: 10,
      });
    }
    if (type === 'restaurant') {
      extra.dishes = await this.dishRepo.find({
        where: { restaurantId: id },
        order: { sort: 'ASC', id: 'DESC' },
      });
      extra.reviews = await this.foodReviewRepo.find({
        where: { restaurantId: id },
        order: { id: 'DESC' },
        take: 10,
      });
    }
    if (type === 'lodging') {
      extra.rooms = await this.roomTypeRepo.find({
        where: { hostelId: id },
        order: { price: 'ASC' },
      });
      extra.reviews = await this.lodgingReviewRepo.find({
        where: { hostelId: id },
        order: { id: 'DESC' },
        take: 10,
      });
    }
    if (type === 'scenic') {
      extra.tickets = await this.ticketTypeRepo.find({
        where: { scenicId: id },
        order: { price: 'ASC' },
      });
      extra.reviews = await this.travelReviewRepo.find({
        where: { targetId: id },
        order: { id: 'DESC' },
        take: 10,
      });
    }
    if (type === 'route') {
      extra.days = await this.routeDayRepo.find({
        where: { routeId: id },
        order: { day: 'ASC' },
      });
      extra.reviews = await this.travelReviewRepo.find({
        where: { targetId: id },
        order: { id: 'DESC' },
        take: 10,
      });
    }
    if (type === 'article') {
      extra.comments = await this.commentRepo.find({
        where: { articleId: id, parentId: 0 },
        order: { id: 'DESC' },
        take: 20,
      });
    }

    return { ...card, raw: data, ...extra };
  }

  async categories() {
    const [clothing, topics] = await Promise.all([
      this.clothingCategoryRepo.find({
        where: { status: 1 },
        order: { sort: 'ASC', id: 'ASC' },
      }),
      this.topicRepo.find({
        order: { isRecommended: 'DESC', id: 'DESC' },
        take: 20,
      }),
    ]);

    return { clothing, topics };
  }

  async cart(userId = 0) {
    if (!userId) {
      return { list: [] };
    }
    const list = await this.cartRepo.find({
      where: { userId },
      order: { id: 'DESC' },
    });
    return { list };
  }

  async addCart(input: AddCartInput) {
    const userId = Number(input.userId || 0);
    const goodsId = Number(input.goodsId || 0);
    const moduleType = Number(input.moduleType || 1);
    const quantity = Math.max(1, Number(input.quantity || 1));
    const skuId = input.skuId ? Number(input.skuId) : null;
    const skuName = input.skuName || null;

    if (!userId || !goodsId) {
      return { success: false, message: '缺少用户或商品信息' };
    }

    const repo = moduleType === 2 ? this.agricultureRepo : this.clothingRepo;
    const goods = await repo.findOne({ where: { id: goodsId, status: 1 } as any });
    if (!goods) {
      return { success: false, message: '商品不存在或已下架' };
    }
    const goodsData = goods as any;

    const existed = await this.cartRepo.findOne({
      where: { userId, goodsId, moduleType, skuId } as any,
    });

    if (existed) {
      existed.quantity = Number(existed.quantity || 0) + quantity;
      existed.checked = 1;
      return { success: true, item: await this.cartRepo.save(existed) };
    }

    const item = this.cartRepo.create({
      userId,
      goodsId,
      goodsTitle: goodsData.title || goodsData.name,
      mainImage: goodsData.mainImage || '',
      skuId,
      skuName: skuName || goodsData.specification || '默认规格',
      price: Number(goodsData.price || 0),
      quantity,
      checked: 1,
      moduleType,
    });

    return { success: true, item: await this.cartRepo.save(item) };
  }

  async collectStatus(userId = 0, goodsId = 0) {
    if (!userId || !goodsId) {
      return { collected: false };
    }

    const item = await this.clothingCollectRepo.findOne({
      where: { userId, goodsId },
    });

    return { collected: !!item };
  }

  async toggleCollect(userId = 0, goodsId = 0) {
    if (!userId || !goodsId) {
      return { success: false, message: '缺少用户或商品信息' };
    }

    const goods = await this.clothingRepo.findOne({
      where: { id: goodsId, status: 1 } as any,
    });
    if (!goods) {
      return { success: false, message: '商品不存在或已下架' };
    }

    const existed = await this.clothingCollectRepo.findOne({
      where: { userId, goodsId },
    });

    if (existed) {
      await this.clothingCollectRepo.delete(existed.id);
      return { success: true, collected: false };
    }

    await this.clothingCollectRepo.save(
      this.clothingCollectRepo.create({
        userId,
        goodsId,
      })
    );

    return { success: true, collected: true };
  }

  async createOrder(input: {
    userId?: number;
    moduleType?: number;
    title?: string;
    totalAmount?: number;
    payAmount?: number;
    remark?: string;
    items?: unknown[];
    contactName?: string;
    contactPhone?: string;
    address?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    status?: number;
  }) {
    const userId = Number(input.userId || 0);
    const moduleType = Number(input.moduleType || 1);
    const totalAmount = Number(input.totalAmount || input.payAmount || 0);
    const payAmount = Number(input.payAmount || totalAmount || 0);

    if (!userId || !moduleType) {
      return { success: false, message: '缺少用户或订单模块信息' };
    }

    const orderNo = await this.orderService.generateOrderNo();
    const order = this.orderRepo.create({
      orderNo,
      userId,
      moduleType,
      totalAmount,
      payAmount,
      discountAmount: Number(input.totalAmount || 0) > 0 ? Number(input.totalAmount || 0) - payAmount : 0,
      status: Number(input.status ?? 0),
      remark: input.remark || '',
      items: Array.isArray(input.items) ? input.items : [],
    });

    const saved = await this.orderRepo.save(order);
    return {
      success: true,
      order: {
        ...saved,
        title: input.title || `订单 ${orderNo}`,
        contactName: input.contactName || '',
        contactPhone: input.contactPhone || '',
        address: input.address || '',
        appointmentDate: input.appointmentDate || '',
        appointmentTime: input.appointmentTime || '',
      },
    };
  }

  async orderPage(userId = 0, status?: number | string, page = 1, pageSize = 20) {
    const query = this.orderRepo
      .createQueryBuilder('order')
      .where(userId ? 'order.userId = :userId' : '1=1', { userId })
      .orderBy('order.id', 'DESC')
      .skip((Math.max(Number(page) || 1, 1) - 1) * Math.min(Math.max(Number(pageSize) || 20, 1), 50))
      .take(Math.min(Math.max(Number(pageSize) || 20, 1), 50));

    if (status !== undefined && status !== null && status !== '') {
      query.andWhere('order.status = :status', { status: Number(status) });
    }

    const [list, total] = await query.getManyAndCount();
    return {
      list,
      pagination: {
        total,
        page: Math.max(Number(page) || 1, 1),
        pageSize: Math.min(Math.max(Number(pageSize) || 20, 1), 50),
        totalPage: Math.ceil(total / Math.min(Math.max(Number(pageSize) || 20, 1), 50)),
      },
    };
  }

  async orderDetail(id: number, userId = 0) {
    const order = await this.orderRepo.findOne({ where: { id } as any });
    if (!order) {
      return null;
    }
    if (userId && Number(order.userId) !== Number(userId)) {
      return null;
    }
    return order;
  }

  async updateOrderStatus(id: number, status: number) {
    const order = await this.orderRepo.findOne({ where: { id } as any });
    if (!order) {
      return { success: false, message: '订单不存在' };
    }
    order.status = Number(status);
    const now = new Date();
    if (order.status === 1) {
      order.payTime = now;
    }
    if (order.status === 4) {
      order.finishTime = now;
    }
    if (order.status === 5) {
      order.cancelTime = now;
    }
    return { success: true, order: await this.orderRepo.save(order) };
  }

  private repo(type: ClientType): Repository<any> {
    const repos = {
      clothing: this.clothingRepo,
      restaurant: this.restaurantRepo,
      agriculture: this.agricultureRepo,
      lodging: this.hostelRepo,
      scenic: this.scenicRepo,
      route: this.routeRepo,
      guide: this.guideRepo,
      article: this.articleRepo,
    };
    return repos[type];
  }

  private buildWhere(type: ClientType, query: PageQuery) {
    const status = query.status === undefined ? 1 : Number(query.status);
    const keyword = query.keyword?.trim();
    const base: FindOptionsWhere<any> = {};

    if (!['guide'].includes(type)) {
      base.status = status;
    }
    if (query.categoryId && ['clothing', 'agriculture'].includes(type)) {
      base.categoryId = Number(query.categoryId);
    }
    if (!keyword) {
      return base;
    }

    const word = Like(`%${keyword}%`);
    const fields = {
      clothing: ['title', 'subtitle'],
      restaurant: ['name', 'address'],
      agriculture: ['name', 'origin'],
      lodging: ['name', 'address'],
      scenic: ['name', 'address'],
      route: ['title'],
      guide: ['title', 'departure'],
      article: ['title', 'content'],
    }[type];

    return fields.map(field => ({ ...base, [field]: word }));
  }

  private toCard(type: ClientType, item: any) {
    const configs = {
      clothing: {
        typeName: '非遗商品',
        detailPath: id => `/clothing/detail/${id}`,
        miniPath: id => `/pages_clothing/detail?id=${id}`,
        title: 'title',
        desc: 'subtitle',
      },
      restaurant: {
        typeName: '美食餐厅',
        detailPath: id => `/food/restaurant/${id}`,
        miniPath: id => `/pages_food/restaurant/detail?id=${id}`,
        title: 'name',
        desc: 'description',
      },
      agriculture: {
        typeName: '农特好物',
        detailPath: id => `/food/agriculture/${id}`,
        miniPath: id => `/pages_food/agriculture/detail?id=${id}`,
        title: 'name',
        desc: 'origin',
      },
      lodging: {
        typeName: '特色民宿',
        detailPath: id => `/lodging/detail/${id}`,
        miniPath: id => `/pages_lodging/detail?id=${id}`,
        title: 'name',
        desc: 'description',
      },
      scenic: {
        typeName: '景区景点',
        detailPath: id => `/travel/scenic/${id}`,
        miniPath: id => `/pages_travel/scenic/detail?id=${id}`,
        title: 'name',
        desc: 'description',
      },
      route: {
        typeName: '旅游线路',
        detailPath: id => `/travel/route/${id}`,
        miniPath: id => `/pages_travel/route/detail?id=${id}`,
        title: 'title',
        desc: 'detailContent',
      },
      guide: {
        typeName: '出行攻略',
        detailPath: id => `/travel/guide/${id}`,
        miniPath: id => `/pages_travel/route/list?id=${id}`,
        title: 'title',
        desc: 'content',
      },
      article: {
        typeName: '社区游记',
        detailPath: id => `/community/article/${id}`,
        miniPath: id => `/pages_community/article/detail?id=${id}`,
        title: 'title',
        desc: 'content',
      },
    }[type];

    const image = item.mainImage || item.imageUrl || item.images?.[0] || '';
    const description = String(item[configs.desc] || '').replace(/<[^>]+>/g, '');

    return {
      id: item.id,
      type,
      typeName: configs.typeName,
      title: item[configs.title],
      subtitle: item.subtitle || description.slice(0, 36),
      description: description.slice(0, 120),
      image,
      images: item.images || (image ? [image] : []),
      price: item.price ? Number(item.price) : undefined,
      rating: item.rating ? Number(item.rating) : undefined,
      sales: item.sales || 0,
      likes: item.likes || 0,
      comments: item.comments || 0,
      address: item.address,
      meta: this.meta(type, item),
      path: configs.detailPath(item.id),
      miniPath: configs.miniPath(item.id),
      createTime: item.createTime,
    };
  }

  private meta(type: ClientType, item: any) {
    if (type === 'clothing') return `已售 ${item.sales || 0}`;
    if (type === 'restaurant') return item.address || item.businessHours || '苗寨特色餐厅';
    if (type === 'lodging') return item.address || item.styleTags || '苗寨特色民宿';
    if (type === 'scenic') return item.openHours || item.address || '开放景区';
    if (type === 'route') return `${item.days || 1} 天行程`;
    if (type === 'guide') return `${item.departure || '乌东'}出发 · ${item.duration || ''}`;
    if (type === 'article') return `${item.likes || 0} 赞 · ${item.comments || 0} 评`;
    return item.origin || item.specification || '';
  }
}
