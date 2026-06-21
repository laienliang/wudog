import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { ApiOperation, ApiBody, ApiTags, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@midwayjs/swagger';
import { SensitiveWordService } from '../service/sensitive-word.service';

/**
 * 敏感词控制器
 * 处理敏感词相关的 API 请求，包括敏感词的增删改查及批量导入操作
 */
@ApiTags('SensitiveWord')
@ApiBearerAuth()
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
  @ApiOperation({ summary: '获取敏感词列表（分页）' })
  @ApiQuery({ name: 'page', description: '页码', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', description: '每页数量', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          list: [
            { id: 1, word: '赌博', level: 1, category: '违法', status: 1, created_at: '2024-01-15 10:30:00', updated_at: '2024-01-15 10:30:00' },
            { id: 2, word: '色情', level: 1, category: '违法', status: 1, created_at: '2024-01-15 10:30:00', updated_at: '2024-01-15 10:30:00' },
          ],
          total: 50,
          page: 1,
          pageSize: 20,
        },
      },
    },
  })
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
  @ApiOperation({ summary: '获取敏感词详情' })
  @ApiParam({ name: 'id', description: '敏感词ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: { id: 1, word: '赌博', level: 1, category: '违法', status: 1, created_at: '2024-01-15 10:30:00', updated_at: '2024-01-15 10:30:00' },
      },
    },
  })
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
  @ApiOperation({ summary: '创建敏感词' })
  @ApiBody({
    schema: {
      properties: {
        word: { type: 'string', description: '敏感词', example: '赌博' },
        level: { type: 'number', description: '敏感等级 1-高危 2-中危 3-低危', example: 1 },
        category: { type: 'string', description: '分类', example: '违法' },
        status: { type: 'number', description: '状态 1启用 0禁用', example: 1 },
      },
      example: {
        word: '赌博',
        level: 1,
        category: '违法',
        status: 1,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '创建成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: { id: 1, word: '赌博', level: 1, category: '违法', status: 1, created_at: '2024-01-15 10:30:00', updated_at: '2024-01-15 10:30:00' },
      },
    },
  })
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
  @ApiOperation({ summary: '更新敏感词' })
  @ApiParam({ name: 'id', description: '敏感词ID', example: 1 })
  @ApiBody({
    schema: {
      properties: {
        word: { type: 'string', description: '敏感词', example: '赌博' },
        level: { type: 'number', description: '敏感等级 1-高危 2-中危 3-低危', example: 1 },
        category: { type: 'string', description: '分类', example: '违法' },
        status: { type: 'number', description: '状态 1启用 0禁用', example: 1 },
      },
      example: {
        word: '赌博',
        level: 1,
        category: '违法',
        status: 1,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: { id: 1, word: '赌博', level: 1, category: '违法', status: 1, created_at: '2024-01-15 10:30:00', updated_at: '2024-01-16 14:20:00' },
      },
    },
  })
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
  @ApiOperation({ summary: '删除敏感词' })
  @ApiParam({ name: 'id', description: '敏感词ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '删除成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: null,
      },
    },
  })
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
  @ApiOperation({ summary: '批量导入敏感词' })
  @ApiBody({
    schema: {
      properties: {
        words: { type: 'array', items: { type: 'string' }, description: '敏感词数组', example: ['赌博', '色情', '暴力'] },
      },
      example: {
        words: ['赌博', '色情', '暴力'],
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '导入成功',
    schema: {
      example: {
        code: 200,
        message: '批量导入成功',
        data: { imported: 3, skipped: 0 },
      },
    },
  })
  async batchImport(@Body() body: { words: string[] }) {
    const result = await this.sensitiveWordService.batchImport(body.words);
    return { code: 200, message: '批量导入成功', data: result };
  }
}
