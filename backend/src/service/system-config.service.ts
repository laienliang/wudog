import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig } from '../entity/system-config.entity';

/**
 * 系统配置服务
 * 处理系统配置项的查询、创建、更新和删除操作
 */
@Provide()
export class SystemConfigService {
  @InjectEntityModel(SystemConfig)
  configRepo: Repository<SystemConfig>;

  /**
   * 查询所有系统配置项
   * @returns 配置项列表，按 ID 升序排列
   */
  async findAll() {
    return await this.configRepo.find({ where: { is_deleted: 0 }, order: { id: 'ASC' } });
  }

  /**
   * 根据配置键查找配置项
   * @param configKey 配置键名
   * @returns 配置项实体或 null
   */
  async findByKey(configKey: string) {
    return await this.configRepo.findOne({ where: { config_key: configKey, is_deleted: 0 } });
  }

  /**
   * 创建或更新配置项（存在则更新，不存在则创建）
   * @param data 配置项数据（部分字段）
   * @returns 创建或更新后的配置项实体
   */
  async createOrUpdate(data: Partial<SystemConfig>) {
    const existing = await this.findByKey(data.config_key);
    if (existing) {
      await this.configRepo.update(existing.id, data);
      return await this.findByKey(data.config_key);
    }
    const entity = this.configRepo.create(data);
    return await this.configRepo.save(entity);
  }

  /**
   * 根据配置键更新配置值
   * @param key 配置键名
   * @param value 新的配置值
   * @returns 更新后的配置项实体，若不存在则返回 null
   */
  async updateByKey(key: string, value: string) {
    const existing = await this.findByKey(key);
    if (!existing) return null;
    await this.configRepo.update(existing.id, { config_value: value });
    return await this.findByKey(key);
  }

  /**
   * 创建配置项
   * @param data 配置项数据（部分字段）
   * @returns 创建成功的配置项实体
   */
  async create(data: Partial<SystemConfig>) {
    const entity = this.configRepo.create(data);
    return await this.configRepo.save(entity);
  }

  /**
   * 软删除配置项
   * @param id 配置项 ID
   * @returns 更新结果
   */
  async delete(id: number) {
    return await this.configRepo.update(id, { is_deleted: 1 });
  }
}
