import { Repository, Like as LikeOp } from 'typeorm';
import { FarmProduct, FarmProductStatus } from '../entity/farm-product.entity';
import { FarmProductCategory } from '../entity/farm-product-category.entity';

export class FarmProductService {
  constructor(
    private repo: Repository<FarmProduct>,
    private categoryRepo: Repository<FarmProductCategory>,
  ) {}

  async list(query: { page?: number; pageSize?: number; category_id?: number; keyword?: string; sort?: string; status?: string }) {
    const { page = 1, pageSize = 20, category_id, keyword, sort, status = 'published' } = query;
    const where: any = { isDeleted: 0, status };
    if (category_id) where.categoryId = Number(category_id);
    if (keyword) where.name = LikeOp(`%${keyword}%`);

    let order: any = { createdAt: 'DESC' };
    if (sort === 'price-asc') order = { price: 'ASC' };
    else if (sort === 'price-desc') order = { price: 'DESC' };
    else if (sort === 'sales') order = { sales: 'DESC' };

    const [list, total] = await this.repo.findAndCount({
      where, order, skip: (page - 1) * pageSize, take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async listAll(query: { page?: number; pageSize?: number; category_id?: number; keyword?: string; status?: string }) {
    const { page = 1, pageSize = 20, category_id, keyword, status } = query;
    const where: any = { isDeleted: 0 };
    if (category_id) where.categoryId = Number(category_id);
    if (keyword) where.name = LikeOp(`%${keyword}%`);
    if (status) where.status = status;

    const [list, total] = await this.repo.findAndCount({
      where, order: { createdAt: 'DESC' }, skip: (page - 1) * pageSize, take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async detail(id: number) {
    const product = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!product) throw new Error('农产品不存在');
    return product;
  }

  async create(userId: number, data: {
    name: string; category_id: number; price: number;
    main_image?: string; detail?: string; stock?: number;
    origin?: string; shelf_life?: string; storage_method?: string; spec?: string;
  }) {
    const product = this.repo.create({
      name: data.name,
      categoryId: data.category_id,
      merchantId: userId,
      price: data.price,
      mainImage: data.main_image || undefined,
      detail: data.detail || '',
      stock: data.stock || 0,
      origin: data.origin || undefined,
      shelfLife: data.shelf_life || undefined,
      storageMethod: data.storage_method || undefined,
      spec: data.spec || undefined,
      status: FarmProductStatus.DRAFT,
    });
    return this.repo.save(product);
  }

  async update(userId: number, id: number, data: {
    name?: string; category_id?: number; price?: number;
    main_image?: string; detail?: string; stock?: number;
    origin?: string; shelf_life?: string; storage_method?: string; spec?: string;
  }) {
    const product = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!product) throw new Error('农产品不存在');
    if (product.merchantId !== userId) throw new Error('无权编辑他人的商品');
    if (![FarmProductStatus.DRAFT, FarmProductStatus.REMOVED].includes(product.status)) throw new Error('只能编辑草稿或已下架的商品');

    if (data.name !== undefined) product.name = data.name;
    if (data.category_id !== undefined) product.categoryId = data.category_id;
    if (data.price !== undefined) product.price = data.price;
    if (data.main_image !== undefined) product.mainImage = data.main_image;
    if (data.detail !== undefined) product.detail = data.detail;
    if (data.stock !== undefined) product.stock = data.stock;
    if (data.origin !== undefined) product.origin = data.origin;
    if (data.shelf_life !== undefined) product.shelfLife = data.shelf_life;
    if (data.storage_method !== undefined) product.storageMethod = data.storage_method;
    if (data.spec !== undefined) product.spec = data.spec;
    product.status = FarmProductStatus.DRAFT;
    return this.repo.save(product);
  }

  async delete(id: number) {
    const product = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!product) throw new Error('农产品不存在');
    product.isDeleted = 1;
    return this.repo.save(product);
  }

  // --- Category CRUD ---
  async listCategories(includeDisabled = false) {
    const where: any = { isDeleted: 0 };
    if (!includeDisabled) where.status = 1;
    return this.categoryRepo.find({ where, order: { sortOrder: 'ASC' } });
  }

  async createCategory(data: { name: string; icon?: string; sort_order?: number }) {
    const category = this.categoryRepo.create({
      name: data.name, icon: data.icon || undefined, sortOrder: data.sort_order || 0,
    });
    return this.categoryRepo.save(category);
  }

  async updateCategory(id: number, data: { name?: string; icon?: string; sort_order?: number; status?: number }) {
    const category = await this.categoryRepo.findOne({ where: { id, isDeleted: 0 } });
    if (!category) throw new Error('分类不存在');
    if (data.name !== undefined) category.name = data.name;
    if (data.icon !== undefined) category.icon = data.icon;
    if (data.sort_order !== undefined) category.sortOrder = data.sort_order;
    if (data.status !== undefined) category.status = data.status;
    return this.categoryRepo.save(category);
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id, isDeleted: 0 } });
    if (!category) throw new Error('分类不存在');
    category.isDeleted = 1;
    return this.categoryRepo.save(category);
  }
}
