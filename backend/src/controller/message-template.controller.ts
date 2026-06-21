import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { ApiOperation, ApiBody, ApiQuery, ApiParam, ApiTags, ApiResponse, ApiBearerAuth } from '@midwayjs/swagger';
import { MessageTemplateService } from '../service/message-template.service';

/**
 * 消息模板控制器
 * 处理消息模板相关的 API 请求，包括消息模板的增删改查操作
 */
@ApiTags('MessageTemplate')
@ApiBearerAuth()
@Controller('/api/message-templates')
export class MessageTemplateController {
  @Inject()
  messageTemplateService: MessageTemplateService;

  /**
   * 获取消息模板列表（分页）
   * GET /api/message-templates/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @returns 分页消息模板列表
   */
  @Get('/list')
  @ApiOperation({ summary: '获取消息模板列表（分页）' })
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
            { id: 1, name: '订单创建通知', type: 'order', title: '您的订单已创建', content: '尊敬的用户，您的订单{{orderNo}}已成功创建，请及时支付。', status: 1, created_at: '2025-01-15 10:30:00' },
            { id: 2, name: '退款成功通知', type: 'refund', title: '退款已到账', content: '尊敬的用户，您的订单{{orderNo}}退款{{amount}}元已到账，请注意查收。', status: 1, created_at: '2025-01-15 11:00:00' },
          ],
          total: 12,
          page: 1,
          pageSize: 20,
        },
      },
    },
  })
  async list(@Query('page') page = 1, @Query('pageSize') pageSize = 20) {
    const result = await this.messageTemplateService.findAll(Number(page), Number(pageSize));
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取消息模板详情
   * GET /api/message-templates/detail/:id
   * @param id - 模板 ID
   * @returns 消息模板详细信息
   */
  @Get('/detail/:id')
  @ApiOperation({ summary: '获取消息模板详情' })
  @ApiParam({ name: 'id', description: '模板ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: { id: 1, name: '订单创建通知', type: 'order', title: '您的订单已创建', content: '尊敬的用户，您的订单{{orderNo}}已成功创建，请及时支付。', status: 1, created_at: '2025-01-15 10:30:00', updated_at: '2025-01-15 10:30:00' },
      },
    },
  })
  async detail(@Param('id') id: number) {
    const item = await this.messageTemplateService.findById(Number(id));
    if (!item) return { code: 404, message: '模板不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 创建消息模板
   * POST /api/message-templates/create
   * @param body - 消息模板信息
   * @returns 创建后的消息模板信息
   */
  @Post('/create')
  @ApiOperation({ summary: '创建消息模板' })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', description: '模板名称', example: '订单创建通知' },
        type: { type: 'string', description: '模板类型 order/refund/system/activity', example: 'order' },
        title: { type: 'string', description: '消息标题', example: '您的订单已创建' },
        content: { type: 'string', description: '消息内容，支持{{变量}}占位符', example: '尊敬的用户，您的订单{{orderNo}}已成功创建，请及时支付。' },
        status: { type: 'number', description: '状态 1启用 0禁用', example: 1 },
      },
      example: {
        name: '订单创建通知',
        type: 'order',
        title: '您的订单已创建',
        content: '尊敬的用户，您的订单{{orderNo}}已成功创建，请及时支付。',
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
        data: { id: 3, name: '订单创建通知', type: 'order', title: '您的订单已创建', content: '尊敬的用户，您的订单{{orderNo}}已成功创建，请及时支付。', status: 1, created_at: '2025-06-21 14:00:00' },
      },
    },
  })
  async create(@Body() body: any) {
    const item = await this.messageTemplateService.create(body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 更新消息模板信息
   * PUT /api/message-templates/update/:id
   * @param id - 模板 ID
   * @param body - 更新的消息模板信息
   * @returns 更新后的消息模板信息
   */
  @Put('/update/:id')
  @ApiOperation({ summary: '更新消息模板' })
  @ApiParam({ name: 'id', description: '模板ID', example: 1 })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', description: '模板名称', example: '订单创建通知' },
        type: { type: 'string', description: '模板类型 order/refund/system/activity', example: 'order' },
        title: { type: 'string', description: '消息标题', example: '您的订单已创建' },
        content: { type: 'string', description: '消息内容，支持{{变量}}占位符', example: '尊敬的用户，您的订单{{orderNo}}已成功创建，请及时完成支付。' },
        status: { type: 'number', description: '状态 1启用 0禁用', example: 1 },
      },
      example: {
        name: '订单创建通知',
        type: 'order',
        title: '您的订单已创建',
        content: '尊敬的用户，您的订单{{orderNo}}已成功创建，请及时完成支付。',
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
        data: { id: 1, name: '订单创建通知', type: 'order', title: '您的订单已创建', content: '尊敬的用户，您的订单{{orderNo}}已成功创建，请及时完成支付。', status: 1, updated_at: '2025-06-21 14:30:00' },
      },
    },
  })
  async update(@Param('id') id: number, @Body() body: any) {
    delete body.id;
    const item = await this.messageTemplateService.update(Number(id), body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 删除消息模板
   * DELETE /api/message-templates/delete/:id
   * @param id - 模板 ID
   * @returns 操作结果
   */
  @Del('/delete/:id')
  @ApiOperation({ summary: '删除消息模板' })
  @ApiParam({ name: 'id', description: '模板ID', example: 1 })
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
    await this.messageTemplateService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }
}
