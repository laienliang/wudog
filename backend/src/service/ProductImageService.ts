import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from '../entity/ProductImage';

@Provide()
export class ProductImageService {
  @InjectEntityModel(ProductImage)
  imageRepo: Repository<ProductImage>;

  async list(productId: number) {
    return await this.imageRepo.find({
      where: { product_id: productId, is_deleted: 0 },
      order: { sort_order: 'ASC' },
    });
  }

  async create(data: Partial<ProductImage>) {
    const image = this.imageRepo.create(data);
    return await this.imageRepo.save(image);
  }

  async delete(id: number) {
    await this.imageRepo.update(id, { is_deleted: 1 });
    return { success: true };
  }
}
