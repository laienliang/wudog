import { Repository } from 'typeorm';
import { ProductCategory } from '../entity/product-category.entity';

export class ProductCategoryService {
  constructor(private repo: Repository<ProductCategory>) {}

  async list(includeDisabled = false) {
    const where: any = { isDeleted: 0 };
    if (!includeDisabled) where.status = 1;
    return this.repo.find({ where, order: { sortOrder: 'ASC', id: 'ASC' } });
  }

  async detail(id: number) {
    return this.repo.findOne({ where: { id, isDeleted: 0 } });
  }

  async create(data: { name: string; icon?: string; parent_id?: number; sort_order?: number }) {
    const cat = this.repo.create({
      name: data.name,
      icon: data.icon || null,
      parentId: data.parent_id || null,
      sortOrder: data.sort_order || 0,
    });
    return this.repo.save(cat);
  }

  async update(id: number, data: { name?: string; icon?: string; parent_id?: number; sort_order?: number; status?: number }) {
    const cat = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!cat) throw new Error('分类不存在');
    if (data.name !== undefined) cat.name = data.name;
    if (data.icon !== undefined) cat.icon = data.icon;
    if (data.parent_id !== undefined) cat.parentId = data.parent_id;
    if (data.sort_order !== undefined) cat.sortOrder = data.sort_order;
    if (data.status !== undefined) cat.status = data.status;
    return this.repo.save(cat);
  }

  async delete(id: number) {
    const cat = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!cat) throw new Error('分类不存在');
    cat.isDeleted = 1;
    return this.repo.save(cat);
  }
}
