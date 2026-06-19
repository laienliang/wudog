import { Controller, Post, Get, Put, Inject, Body, Param } from '@midwayjs/decorator';
import { SystemConfigService } from '../service/system-config.service';

/**
 * 系统配置控制器
 * 处理系统配置相关的 API 请求，包括配置的查询、创建和更新
 */
@Controller('/api/system-configs')
export class SystemConfigController {
  @Inject()
  systemConfigService: SystemConfigService;

  /**
   * 获取所有系统配置列表
   * GET /api/system-configs/list
   * @returns 全部系统配置列表
   */
  @Get('/list')
  async list() {
    const result = await this.systemConfigService.findAll();
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 根据 key 获取配置详情
   * GET /api/system-configs/detail/:key
   * @param key - 配置键名
   * @returns 配置详细信息
   */
  @Get('/detail/:key')
  async detail(@Param('key') key: string) {
    const item = await this.systemConfigService.findByKey(key);
    if (!item) return { code: 404, message: '配置不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 根据 key 更新配置值
   * PUT /api/system-configs/update/:key
   * @param key - 配置键名
   * @param body - 包含 value（配置值）
   * @returns 更新后的配置信息
   */
  @Put('/update/:key')
  async update(@Param('key') key: string, @Body() body: { value: string }) {
    const item = await this.systemConfigService.updateByKey(key, body.value);
    if (!item) return { code: 404, message: '配置不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 创建系统配置
   * POST /api/system-configs/create
   * @param body - 配置信息
   * @returns 创建后的配置信息
   */
  @Post('/create')
  async create(@Body() body: any) {
    const item = await this.systemConfigService.create(body);
    return { code: 200, message: 'success', data: item };
  }
}
