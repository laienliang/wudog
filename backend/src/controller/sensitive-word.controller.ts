import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { SensitiveWordService } from '../service/sensitive-word.service';

/**
 * 敏感词控制器
 * 处理敏感词相关的 API 请求，包括敏感词的增删改查及批量导入操作
 */
@Controller('/api/sensitive-words')
export class SensitiveWordController {
  @Inject()
  sensitiveWordService: SensitiveWordService;

  /**
   * 获取敏感词列表（分页）
   * GET /api/sensitive-words/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @returns 分页敏感词列表
   */
  @Get('/list')
  async list(@Query('page') page = 1, @Query('pageSize') pageSize = 20) {
    const result = await this.sensitiveWordService.findAll(Number(page), Number(pageSize));
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取敏感词详情
   * GET /api/sensitive-words/detail/:id
   * @param id - 敏感词 ID
   * @returns 敏感词详细信息
   */
  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    const item = await this.sensitiveWordService.findById(Number(id));
    if (!item) return { code: 404, message: '敏感词不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 创建敏感词
   * POST /api/sensitive-words/create
   * @param body - 敏感词信息
   * @returns 创建后的敏感词信息
   */
  @Post('/create')
  async create(@Body() body: any) {
    const item = await this.sensitiveWordService.create(body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 更新敏感词信息
   * PUT /api/sensitive-words/update/:id
   * @param id - 敏感词 ID
   * @param body - 更新的敏感词信息
   * @returns 更新后的敏感词信息
   */
  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    delete body.id;
    const item = await this.sensitiveWordService.update(Number(id), body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 删除敏感词
   * DELETE /api/sensitive-words/delete/:id
   * @param id - 敏感词 ID
   * @returns 操作结果
   */
  @Del('/delete/:id')
  async remove(@Param('id') id: number) {
    await this.sensitiveWordService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }

  /**
   * 批量导入敏感词
   * POST /api/sensitive-words/batch-import
   * @param body - 包含 words（敏感词字符串数组）
   * @returns 批量导入结果
   */
  @Post('/batch-import')
  async batchImport(@Body() body: { words: string[] }) {
    const result = await this.sensitiveWordService.batchImport(body.words);
    return { code: 200, message: '批量导入成功', data: result };
  }
}
