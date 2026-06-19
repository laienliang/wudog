import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { SensitiveWord } from '../entity/sensitive-word.entity';

/**
 * 敏感词服务
 * 处理敏感词的增删改查及批量导入操作
 */
@Provide()
export class SensitiveWordService {
  @InjectEntityModel(SensitiveWord)
  wordRepo: Repository<SensitiveWord>;

  /**
   * 分页查询敏感词列表
   * @param page 页码，默认第 1 页
   * @param pageSize 每页条数，默认 20
   * @param keyword 搜索关键词（匹配敏感词内容）
   * @returns 包含列表、总数、页码和每页条数的分页结果
   */
  async findAll(page = 1, pageSize = 20, keyword?: string) {
    const qb = this.wordRepo.createQueryBuilder('word')
      .where('word.is_deleted = 0');
    if (keyword) {
      qb.andWhere('word.word LIKE :kw', { kw: `%${keyword}%` });
    }
    const [list, total] = await qb
      .orderBy('word.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 根据 ID 查找敏感词
   * @param id 敏感词 ID
   * @returns 敏感词实体或 null
   */
  async findById(id: number) {
    return await this.wordRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  /**
   * 创建敏感词
   * @param data 敏感词数据（部分字段）
   * @returns 创建成功的敏感词实体
   */
  async create(data: Partial<SensitiveWord>) {
    const entity = this.wordRepo.create(data);
    return await this.wordRepo.save(entity);
  }

  /**
   * 更新敏感词信息
   * @param id 敏感词 ID
   * @param data 需要更新的字段
   * @returns 更新后的敏感词实体
   */
  async update(id: number, data: Partial<SensitiveWord>) {
    await this.wordRepo.update(id, data);
    return await this.findById(id);
  }

  /**
   * 软删除敏感词
   * @param id 敏感词 ID
   * @returns 更新结果
   */
  async delete(id: number) {
    return await this.wordRepo.update(id, { is_deleted: 1 });
  }

  /**
   * 批量创建敏感词
   * @param words 敏感词数据数组
   * @returns 创建成功的敏感词实体数组
   */
  async batchCreate(words: Partial<SensitiveWord>[]) {
    const entities = this.wordRepo.create(words);
    return await this.wordRepo.save(entities);
  }

  /**
   * 批量导入敏感词（纯文本字符串数组）
   * @param words 敏感词字符串数组
   * @returns 创建成功的敏感词实体数组
   */
  async batchImport(words: string[]) {
    const data = words.map(w => ({ word: w }));
    return this.batchCreate(data);
  }
}
