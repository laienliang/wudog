import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { MessageTemplateService } from '../service/message-template.service';

/**
 * 消息模板控制器
 * 处理消息模板相关的 API 请求，包括消息模板的增删改查操作
 */
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
  async remove(@Param('id') id: number) {
    await this.messageTemplateService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }
}
