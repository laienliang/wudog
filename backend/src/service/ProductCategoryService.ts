import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '../entity/ProductCategory';

@Provide()
export class ProductCategoryService {
  @InjectEntityModel(ProductCategory)
  categoryRepo: Repository<ProductCategory>;

  async list() {
    return await this.categoryRepo.find({
      where: { is_deleted: 0 },
      order: { sort_order: 'ASC' },
    });
  }

  async detail(id: number) {
    return await this.categoryRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  async create(data: Partial<ProductCategory>) {
    const category = this.categoryRepo.create(data);
    return await this.categoryRepo.save(category);
  }

  async update(id: number, data: Partial<ProductCategory>) {
    await this.categoryRepo.update(id, data);
    return await this.detail(id);
  }

  async delete(id: number) {
    await this.categoryRepo.update(id, { is_deleted: 1 });
    return { success: true };
  }
}
