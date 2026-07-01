import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entity/Cart';

@Provide()
export class CartService {
  @InjectEntityModel(Cart)
  cartRepo: Repository<Cart>;

  async list(userId: number) {
    const items = await this.cartRepo.find({
      where: { user_id: userId, is_deleted: 0 },
      relations: ['product', 'product.images', 'sku'],
      order: { created_at: 'DESC' },
    });
    return items.map(item => {
      if (item.product?.images) {
        item.product.images = item.product.images.filter(img => img.is_deleted === 0);
      }
      return item;
    });
  }

  async add(userId: number, productId: number, skuId: number | null, quantity = 1) {
    const where: any = { user_id: userId, product_id: productId, is_deleted: 0 };
    if (skuId) {
      where.sku_id = skuId;
    } else {
      where.sku_id = null;
    }
    const existing = await this.cartRepo.findOne({ where });

    if (existing) {
      existing.quantity += quantity;
      await this.cartRepo.save(existing);
      return existing;
    }

    const item = this.cartRepo.create({
      user_id: userId,
      product_id: productId,
      sku_id: skuId,
      quantity,
    });
    return await this.cartRepo.save(item);
  }

  async updateQuantity(cartId: number, userId: number, quantity: number) {
    const item = await this.cartRepo.findOne({
      where: { id: cartId, user_id: userId, is_deleted: 0 },
    });
    if (!item) return null;
    item.quantity = quantity;
    return await this.cartRepo.save(item);
  }

  async delete(cartId: number, userId: number) {
    const item = await this.cartRepo.findOne({
      where: { id: cartId, user_id: userId, is_deleted: 0 },
    });
    if (!item) return false;
    item.is_deleted = 1;
    await this.cartRepo.save(item);
    return true;
  }
}
