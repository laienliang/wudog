import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { Restaurant } from '../entity/restaurant.entity';
import { MealSlot } from '../entity/meal-slot.entity';
import { FoodProduct } from '../entity/food-product.entity';
import { Order } from '../../../common/entity/order.entity';
import { OrderItem } from '../../../common/entity/order-item.entity';
import { SnowflakeService } from '../../order/service/snowflake.service';
import { Dish } from '../entity/dish.entity';

@Provide()
export class FoodService {
  @InjectEntityModel(Restaurant)
  restaurantModel: Repository<Restaurant>;

  @InjectEntityModel(MealSlot)
  mealSlotModel: Repository<MealSlot>;

  @InjectEntityModel(FoodProduct)
  foodProductModel: Repository<FoodProduct>;

  @InjectEntityModel(Dish)
  dishModel: Repository<Dish>;

  @InjectEntityModel(Order)
  orderModel: Repository<Order>;

  @InjectEntityModel(OrderItem)
  orderItemModel: Repository<OrderItem>;

  @Inject()
  snowflakeService: SnowflakeService;

  // ===== 餐厅 =====
  async listRestaurants(query: any) {
    const { page = 1, pageSize = 10 } = query;
    const qb = this.restaurantModel.createQueryBuilder('r')
      .where('r.deletedAt IS NULL')
      .orderBy('r.rating', 'DESC')
      .skip((page - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return {
      list, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getRestaurant(id: number) {
    const r = await this.restaurantModel.findOne({ where: { id } });
    if (!r) throw new Error('餐厅不存在');
    return r;
  }

  async createRestaurant(data: any) { return this.restaurantModel.save(data); }
  async updateRestaurant(id: number, data: any) { await this.restaurantModel.update(id, data); return this.getRestaurant(id); }
  async deleteRestaurant(id: number) { return this.restaurantModel.softDelete(id); }

  // ===== 餐位时段 =====
  async getMealSlots(restaurantId: number) {
    return this.mealSlotModel.find({ where: { restaurantId, deletedAt: undefined } });
  }

  // ===== 农产品 =====
  async listCategories() {
    return this.foodProductModel.query("SELECT * FROM wd_food_category ORDER BY sort_order ASC");
  }

  async listFoodProducts(query: any) {
    const { page = 1, pageSize = 10 } = query;
    const qb = this.foodProductModel.createQueryBuilder('p')
      .where('p.deletedAt IS NULL')
      .orderBy('p.createdAt', 'DESC')
      .skip((page - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return {
      list, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async createFoodProduct(data: any) { return this.foodProductModel.save(data); }
  async updateFoodProduct(id: number, data: any) { await this.foodProductModel.update(id, data); return this.foodProductModel.findOne({ where: { id } }); }
  async deleteFoodProduct(id: number) { return this.foodProductModel.softDelete(id); }

  async getDishes(restaurantId: number) {
    return this.dishModel.find({ where: { restaurantId, status: 1 } });
  }

  // ===== 菜品 CRUD =====
  async listDishes(query: any) {
    const { page = 1, pageSize = 10, restaurantId } = query;
    let sql = `SELECT d.*, r.name AS restaurant_name FROM wd_food_dish d LEFT JOIN wd_food_restaurant r ON d.restaurant_id = r.id WHERE d.deleted_at IS NULL`;
    const params: any[] = [];
    if (restaurantId) { sql += ' AND d.restaurant_id = ?'; params.push(Number(restaurantId)); }
    sql += ' ORDER BY d.is_signature DESC, d.created_at DESC';

    const countResult = await this.dishModel.query(`SELECT COUNT(*) AS total FROM wd_food_dish WHERE deleted_at IS NULL`, params);
    const total = Number(countResult[0]?.total || 0);

    const offset = (page - 1) * pageSize;
    sql += ` LIMIT ${Number(pageSize)} OFFSET ${Number(offset)}`;
    const list = await this.dishModel.query(sql, params);
    return { list, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async createDish(data: any) {
    return this.dishModel.save(data);
  }

  async updateDish(id: number, data: any) {
    await this.dishModel.update(id, data);
    return this.dishModel.findOne({ where: { id } });
  }

  async deleteDish(id: number) {
    return this.dishModel.softDelete(id);
  }

  async getFoodProduct(id: number) {
    const p = await this.foodProductModel.findOne({ where: { id } });
    if (!p) throw new Error('商品不存在');
    return p;
  }

  // ===== 餐位预订 =====
  async createBooking(userId: number, data: any) {
    const slot = await this.mealSlotModel.findOne({ where: { id: data.slotId } });
    if (!slot) throw new Error('餐位时段不存在');
    const orderNo = this.snowflakeService.nextId();
    const totalAmount = slot.price * data.guests;

    // 查找餐厅信息
    const restaurant = await this.restaurantModel.findOne({ where: { id: slot.restaurantId } });

    // 创建订单
    const order = this.orderModel.create({
      orderNo, userId, merchantId: data.merchantId || 1,
      orderType: 'food_meal', totalAmount, payAmount: totalAmount,
      status: 'pending_pay', remark: `餐位预订: ${data.date} ${slot.name} ${data.guests}位 联系人:${data.contactName||''} 电话:${data.contactPhone||''}`,
    });
    const savedOrder = await this.orderModel.save(order);

    // 创建订单明细
    const item = this.orderItemModel.create({
      order: savedOrder,
      productType: 'meal_slot',
      productId: data.slotId,
      productName: `${restaurant?.name || '餐厅'} - ${slot.name}（餐位预订）`,
      productImage: restaurant?.coverImage || '',
      unitPrice: slot.price,
      quantity: data.guests,
      subtotal: totalAmount,
    });
    await this.orderItemModel.save(item);

    return { orderNo, totalAmount, message: '预订成功，请支付' };
  }
}
