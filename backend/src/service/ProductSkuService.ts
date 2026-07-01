import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSku } from '../entity/ProductSku';

@Provide()
export class ProductSkuService {
  @InjectEntityModel(ProductSku)
  skuRepo: Repository<ProductSku>;

  async list(productId: number) {
    return await this.skuRepo.find({
      where: { product_id: productId, is_deleted: 0 },
      order: { id: 'ASC' },
    });
  }

  async detail(id: number) {
    return await this.skuRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  async create(data: Partial<ProductSku>) {
    const sku = this.skuRepo.create(data);
    return await this.skuRepo.save(sku);
  }

  async update(id: number, data: Partial<ProductSku>) {
    await this.skuRepo.update(id, data);
    return await this.detail(id);
  }

  async delete(id: number) {
    await this.skuRepo.update(id, { is_deleted: 1 });
    return { success: true };
  }
}
