import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ProductFavorite } from '../entity/ProductFavorite';

@Provide()
export class ProductFavoriteService {
  @InjectEntityModel(ProductFavorite)
  favoriteRepo: Repository<ProductFavorite>;

  async list(userId: number) {
    const favorites = await this.favoriteRepo.find({
      where: { user_id: userId, is_deleted: 0 },
      relations: ['product', 'product.images', 'product.category', 'product.skus'],
      order: { created_at: 'DESC' },
    });
    return favorites.map(fav => {
      const product = fav.product as any;
      if (product?.images) {
        product.images = product.images.filter(img => img.is_deleted === 0);
      }
      product.sold_out = product.stock <= 0;
      product.min_price = product.price;
      return fav;
    });
  }

  async toggle(productId: number, userId: number) {
    const existing = await this.favoriteRepo.findOne({
      where: { product_id: productId, user_id: userId },
    });

    if (existing) {
      if (existing.is_deleted === 0) {
        await this.favoriteRepo.update(existing.id, { is_deleted: 1 });
        return { favorited: false };
      } else {
        await this.favoriteRepo.update(existing.id, { is_deleted: 0 });
        return { favorited: true };
      }
    }

    const favorite = this.favoriteRepo.create({ product_id: productId, user_id: userId });
    await this.favoriteRepo.save(favorite);
    return { favorited: true };
  }
}
