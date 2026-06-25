import { Repository } from 'typeorm';
import { ShoppingCart } from '../entity/shopping-cart.entity';

export class CartService {
  constructor(private cartRepo: Repository<ShoppingCart>) {}

  async getCart(userId: number) {
    return this.cartRepo.find({ where: { user_id: userId }, order: { created_at: "DESC" } });
  }

  async addItem(userId: number, data: { product_id: number; sku_id?: number; quantity: number; source_module: string }) {
    const exist = await this.cartRepo.findOne({
      where: { user_id: userId, product_id: data.product_id, sku_id: data.sku_id || null },
    });
    if (exist) {
      exist.quantity += data.quantity;
      return this.cartRepo.save(exist);
    }
    const item = this.cartRepo.create({
      user_id: userId,
      product_id: data.product_id,
      sku_id: data.sku_id || null,
      quantity: data.quantity,
      source_module: data.source_module,
    });
    return this.cartRepo.save(item);
  }

  async updateItem(userId: number, itemId: number, quantity: number) {
    const item = await this.cartRepo.findOne({ where: { id: itemId, user_id: userId } });
    if (!item) throw new Error("购物车项不存在");
    if (quantity <= 0) {
      await this.cartRepo.remove(item);
      return null;
    }
    item.quantity = quantity;
    return this.cartRepo.save(item);
  }

  async deleteItem(userId: number, itemId: number) {
    const item = await this.cartRepo.findOne({ where: { id: itemId, user_id: userId } });
    if (!item) throw new Error("购物车项不存在");
    await this.cartRepo.remove(item);
  }

  async clearCart(userId: number) {
    await this.cartRepo.delete({ user_id: userId });
  }
}
