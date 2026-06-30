import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Product } from '../entity/product.entity';
import { Category } from '../entity/category.entity';
import { Sku } from '../entity/sku.entity';
import { Review } from '../entity/review.entity';
import { CreateProductDTO } from '../dto/create-product.dto';
import { UpdateProductDTO } from '../dto/update-product.dto';
import { CreateCategoryDTO } from '../dto/create-category.dto';
import { UpdateCategoryDTO } from '../dto/update-category.dto';
import { ProductQueryDTO } from '../dto/product-query.dto';

@Provide()
export class ProductService {
  @InjectEntityModel(Product)
  productModel: Repository<Product>;

  @InjectEntityModel(Category)
  categoryModel: Repository<Category>;

  @InjectEntityModel(Sku)
  skuModel: Repository<Sku>;

  @InjectEntityModel(Review)
  reviewModel: Repository<Review>;

  async paginate(query: ProductQueryDTO) {
    const { page = 1, pageSize = 10, categoryId, keyword, sortField, sortOrder, minPrice, maxPrice, minRating } = query;
    const qb = this.productModel.createQueryBuilder('p');

    if (categoryId) qb.andWhere('p.categoryId = :categoryId', { categoryId });
    if (keyword) qb.andWhere('p.name LIKE :keyword', { keyword: `%${keyword}%` });
    if (minPrice) qb.andWhere('p.price >= :minPrice', { minPrice: Number(minPrice) });
    if (maxPrice) qb.andWhere('p.price <= :maxPrice', { maxPrice: Number(maxPrice) });
    if (minRating) qb.andWhere('p.rating >= :minRating', { minRating: Number(minRating) });

    qb.andWhere('p.status = 1');
    qb.andWhere('p.deletedAt IS NULL');

    const sort = sortField || 'createdAt';
    const order = (sortOrder as 'ASC' | 'DESC') || 'DESC';
    qb.addOrderBy(`p.${sort}`, order);

    const [list, total] = await qb.skip((page - 1) * pageSize).take(pageSize).getManyAndCount();
    return { list, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async getById(id: number) {
    return this.productModel.findOne({ where: { id } });
  }

  async create(dto: CreateProductDTO) {
    const product = this.productModel.create({
      ...dto as any,
      merchantId: 0,
    });
    return this.productModel.save(product);
  }

  async update(id: number, dto: UpdateProductDTO) {
    await this.productModel.update(id, dto as any);
    return this.getById(id);
  }

  async softDelete(id: number) {
    return this.productModel.softDelete(id);
  }

  async getCategories() { return this.categoryModel.find({ order: { sortOrder: 'ASC' } }); }

  async createCategory(dto: CreateCategoryDTO) {
    const cat = this.categoryModel.create(dto as any);
    return this.categoryModel.save(cat);
  }

  async updateCategory(id: number, dto: UpdateCategoryDTO) {
    await this.categoryModel.update(id, dto as any);
    return this.categoryModel.findOne({ where: { id } });
  }

  async deleteCategory(id: number) {
    // 检查是否有商品关联此分类
    const count = await this.productModel.count({ where: { categoryId: id } });
    if (count > 0) throw new Error(`该分类下有 ${count} 个商品，无法删除`);
    return this.categoryModel.softDelete(id);
  }

  async getSkus(productId: number) { return this.skuModel.find({ where: { productId } }); }
  async getReviews(productId: number) { return this.reviewModel.find({ where: { productId }, order: { createdAt: 'DESC' } }); }
}
