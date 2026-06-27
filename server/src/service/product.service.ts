import { Repository, Like as LikeOp } from 'typeorm';
import { Product } from '../entity/product.entity';
import { ProductSku } from '../entity/product-sku.entity';
import { ProductImage } from '../entity/product-image.entity';

export class ProductService {
  constructor(
    private repo: Repository<Product>,
    private skuRepo: Repository<ProductSku>,
    private imageRepo: Repository<ProductImage>,
  ) {}

  async list(query: { page?: number; pageSize?: number; category_id?: number; keyword?: string; sort?: string; status?: string }) {
    const { page = 1, pageSize = 20, category_id, keyword, sort, status = 'published' } = query;
    const where: any = { isDeleted: 0, status };
    if (category_id) where.categoryId = Number(category_id);
    if (keyword) where.title = LikeOp(`%${keyword}%`);

    let order: any = { createdAt: 'DESC' };
    if (sort === 'price-asc') order = { price: 'ASC' };
    else if (sort === 'price-desc') order = { price: 'DESC' };
    else if (sort === 'sales') order = { sales: 'DESC' };

    const [list, total] = await this.repo.findAndCount({
      where,
      order,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async detail(id: number) {
    const product = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!product) throw new Error('商品不存在');
    const [skus, images] = await Promise.all([
      this.skuRepo.find({ where: { productId: id, isDeleted: 0 } }),
      this.imageRepo.find({ where: { productId: id }, order: { sortOrder: 'ASC' } }),
    ]);
    return { ...product, skus, images };
  }

  async create(userId: number, data: {
    title: string; subtitle?: string; category_id: number; main_image?: string;
    price: number; market_price?: number; stock?: number; detail?: string;
    craft_intro?: string; inheritor_name?: string;
    skus?: { spec_name: string; price?: number; stock?: number; image?: string }[];
    images?: { url: string; sort_order?: number }[];
  }) {
    const product = this.repo.create({
      title: data.title,
      subtitle: data.subtitle || undefined,
      categoryId: data.category_id,
      merchantId: userId,
      mainImage: data.main_image || undefined,
      price: data.price,
      marketPrice: data.market_price || undefined,
      stock: data.stock || 0,
      detail: data.detail || '',
      craftIntro: data.craft_intro || undefined,
      inheritorName: data.inheritor_name || undefined,
      status: 'draft',
    });
    const saved = await this.repo.save(product);

    if (data.skus?.length) {
      const skuEntities = data.skus.map(s => this.skuRepo.create({
        productId: saved.id,
        specName: s.spec_name,
        price: s.price ?? null,
        stock: s.stock || 0,
        image: s.image || null,
      }));
      await this.skuRepo.save(skuEntities);
    }
    if (data.images?.length) {
      const imgEntities = data.images.map((img, i) => this.imageRepo.create({
        productId: saved.id,
        url: img.url,
        sortOrder: img.sort_order ?? i,
      }));
      await this.imageRepo.save(imgEntities);
    }

    return saved;
  }

  async update(userId: number, id: number, data: {
    title?: string; subtitle?: string; category_id?: number; main_image?: string;
    price?: number; market_price?: number; stock?: number; detail?: string;
    craft_intro?: string; inheritor_name?: string;
    skus?: { spec_name: string; price?: number; stock?: number; image?: string }[];
    images?: { url: string; sort_order?: number }[];
  }) {
    const product = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!product) throw new Error('商品不存在');
    if (product.merchantId !== userId) throw new Error('无权编辑他人的商品');
    if (!['draft', 'rejected'].includes(product.status)) throw new Error('只能编辑草稿或已驳回的商品');

    if (data.title !== undefined) product.title = data.title;
    if (data.subtitle !== undefined) product.subtitle = data.subtitle;
    if (data.category_id !== undefined) product.categoryId = data.category_id;
    if (data.main_image !== undefined) product.mainImage = data.main_image;
    if (data.price !== undefined) product.price = data.price;
    if (data.market_price !== undefined) product.marketPrice = data.market_price;
    if (data.stock !== undefined) product.stock = data.stock;
    if (data.detail !== undefined) product.detail = data.detail;
    if (data.craft_intro !== undefined) product.craftIntro = data.craft_intro;
    if (data.inheritor_name !== undefined) product.inheritorName = data.inheritor_name;
    product.status = 'draft';
    const saved = await this.repo.save(product);

    if (data.skus !== undefined) {
      await this.skuRepo.update({ productId: id }, { isDeleted: 1 });
      if (data.skus.length) {
        const skuEntities = data.skus.map(s => this.skuRepo.create({
          productId: id,
          specName: s.spec_name,
          price: s.price ?? null,
          stock: s.stock || 0,
          image: s.image || null,
        }));
        await this.skuRepo.save(skuEntities);
      }
    }
    if (data.images !== undefined) {
      await this.imageRepo.delete({ productId: id });
      if (data.images.length) {
        const imgEntities = data.images.map((img, i) => this.imageRepo.create({
          productId: id,
          url: img.url,
          sortOrder: img.sort_order ?? i,
        }));
        await this.imageRepo.save(imgEntities);
      }
    }

    return saved;
  }

  async delete(userId: number, id: number, isAdmin = false) {
    const product = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!product) throw new Error('商品不存在');
    if (!isAdmin && product.merchantId !== userId) throw new Error('无权删除他人的商品');
    product.isDeleted = 1;
    return this.repo.save(product);
  }

  async remove(id: number) {
    const product = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!product) throw new Error('商品不存在');
    product.status = 'removed';
    return this.repo.save(product);
  }

  async submitReview(userId: number, id: number) {
    const product = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!product) throw new Error('商品不存在');
    if (product.merchantId !== userId) throw new Error('无权操作');
    if (!['draft', 'rejected'].includes(product.status)) throw new Error('当前状态不可提交审核');
    if (!product.title || !product.mainImage) throw new Error('标题和主图不能为空');
    product.status = 'reviewing';
    return this.repo.save(product);
  }

  async review(id: number, data: { action: string; reject_reason?: string }) {
    const product = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!product) throw new Error('商品不存在');
    if (product.status !== 'reviewing') throw new Error('只有待审核的商品才能审核');
    if (data.action === 'approve') {
      product.status = 'published';
    } else if (data.action === 'reject') {
      if (!data.reject_reason) throw new Error('驳回必须填写原因');
      product.status = 'rejected';
    } else {
      throw new Error('无效的操作');
    }
    return this.repo.save(product);
  }
}
