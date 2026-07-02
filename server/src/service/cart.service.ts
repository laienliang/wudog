import { Repository, In } from 'typeorm';
import { ShoppingCart } from '../entity/shopping-cart.entity';
import { Product } from '../entity/product.entity';
import { ProductSku } from '../entity/product-sku.entity';
import { FarmProduct } from '../entity/farm-product.entity';

interface CartItemInfo {
  name: string;
  image: string;
  price: number;
  spec?: string;
}

export class CartService {
  constructor(
    private cartRepo: Repository<ShoppingCart>,
    private productRepo: Repository<Product>,
    private skuRepo: Repository<ProductSku>,
    private farmProductRepo: Repository<FarmProduct>,
  ) {}

  async getCart(userId: number) {
    const items = await this.cartRepo.find({ where: { user_id: userId }, order: { created_at: "DESC" } });
    if (items.length === 0) return [];

    // 按 source_module 分组 product_id
    const module1Ids = [...new Set(items.filter(i => i.source_module === 'module1').map(i => i.product_id))];
    const module2Ids = [...new Set(items.filter(i => i.source_module !== 'module1').map(i => i.product_id))];
    const skuIds = [...new Set(items.filter(i => i.sku_id).map(i => i.sku_id))];

    const [products, farmProducts, skus] = await Promise.all([
      module1Ids.length ? this.productRepo.find({ where: { id: In(module1Ids), isDeleted: 0 } }) : [],
      module2Ids.length ? this.farmProductRepo.find({ where: { id: In(module2Ids), isDeleted: 0 } }) : [],
      skuIds.length ? this.skuRepo.find({ where: { id: In(skuIds) } }) : [],
    ]);

    const infoMap: Record<string, CartItemInfo> = {};
    products.forEach(p => {
      infoMap[`module1_${p.id}`] = { name: p.title, image: p.mainImage || '', price: Number(p.price) || 0 };
    });
    farmProducts.forEach(p => {
      infoMap[`module2_${p.id}`] = { name: p.name, image: p.mainImage || '', price: Number(p.price) || 0 };
    });

    const skuMap: Record<number, ProductSku> = {};
    skus.forEach(s => { skuMap[s.id] = s; });

    return items.map(item => {
      const key = `${item.source_module || 'module1'}_${item.product_id}`;
      const info = infoMap[key] || { name: '', image: '', price: 0 };
      const sku = item.sku_id ? skuMap[item.sku_id] : null;
      return {
        id: item.id,
        product_id: item.product_id,
        sku_id: item.sku_id,
        quantity: item.quantity,
        source_module: item.source_module,
        product_name: info.name,
        product_image: info.image,
        price: sku?.price ?? info.price ?? 0,
        sku_spec: sku?.specName || '',
      };
    });
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
