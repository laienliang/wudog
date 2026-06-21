import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { ApiOperation, ApiBody, ApiQuery, ApiParam, ApiTags, ApiResponse, ApiBearerAuth } from '@midwayjs/swagger';
import { MerchantService } from '../service/merchant.service';
import { RedisService } from '../service/redis.service';

/**
 * 商家控制器
 * 处理商家相关的 API 请求，包括商家的增删改查操作
 */
@ApiTags('Merchant')
@ApiBearerAuth()
@Controller('/api/merchants')
export class MerchantController {
  @Inject()
  merchantService: MerchantService;

  @Inject()
  redisService: RedisService;

  /**
   * 获取商家列表（分页）
   * GET /api/merchants/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @param keyword - 搜索关键词（可选）
   * @returns 分页商家列表
   */
  @Get('/list')
  @ApiOperation({ summary: '获取商家列表（分页）' })
  @ApiQuery({ name: 'page', description: '页码', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', description: '每页数量', required: false, example: 20 })
  @ApiQuery({ name: 'keyword', description: '搜索关键词（商家名称/联系人）', required: false, example: '乌东' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          list: [
            {
              id: 1,
              shop_name: '乌东苗寨农家乐',
              contact_name: '李明',
              phone: '13800138001',
              address: '贵州省黔东南州乌东苗寨',
              status: 1,
              last_login_at: '2026-06-20T10:30:00.000Z',
              created_at: '2026-01-15T08:00:00.000Z',
            },
          ],
          total: 1,
        },
      },
    },
  })
  async list(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('keyword') keyword?: string) {
    const result = await this.merchantService.findAll(Number(page), Number(pageSize), keyword);
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取商家详情
   * GET /api/merchants/detail/:id
   * @param id - 商家 ID
   * @returns 商家详细信息
   */
  @Get('/detail/:id')
  @ApiOperation({ summary: '获取商家详情' })
  @ApiParam({ name: 'id', description: '商家ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          shop_name: '乌东苗寨农家乐',
          contact_name: '李明',
          phone: '13800138001',
          address: '贵州省黔东南州乌东苗寨',
          description: '提供正宗苗家菜和住宿服务',
          status: 1,
          last_login_at: '2026-06-20T10:30:00.000Z',
          created_at: '2026-01-15T08:00:00.000Z',
        },
      },
    },
  })
  async detail(@Param('id') id: number) {
    const item = await this.merchantService.findById(Number(id));
    if (!item) return { code: 404, message: '不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 强制商家下线
   * POST /api/merchants/force-offline/:id
   * 将当前时间戳写入 Redis，使该时间点之前签发的所有 token 失效
   * @param id - 商家 ID
   */
  @Post('/force-offline/:id')
  @ApiOperation({ summary: '强制商家下线' })
  @ApiParam({ name: 'id', description: '商家ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '操作成功',
    schema: {
      example: {
        code: 200,
        message: '已将「乌东苗寨农家乐」强制下线',
        data: null,
      },
    },
  })
  async forceOffline(@Param('id') id: number) {
    const item = await this.merchantService.findById(Number(id));
    if (!item) return { code: 404, message: '商家不存在', data: null };
    // 记录强制下线时间戳，token 签发时间早于此时间的请求将被拒绝
    const offlineTime = Date.now();
    await this.redisService.set(`merchant:offline:${id}`, String(offlineTime), 86400 * 7);
    await this.merchantService.update(Number(id), { last_login_at: null } as any);
    console.log(`[强制下线] 商家 ID: ${id}, 店铺: ${item.shop_name}, 时间戳: ${offlineTime}`);
    return { code: 200, message: `已将「${item.shop_name}」强制下线`, data: null };
  }

  /**
   * 创建商家
   * POST /api/merchants/create
   * @param body - 商家信息（包含 password 字段会自动加密为 password_hash）
   * @returns 创建后的商家信息
   */
  @Post('/create')
  @ApiOperation({ summary: '创建商家' })
  @ApiBody({
    schema: {
      properties: {
        shop_name: { type: 'string', description: '店铺名称', example: '乌东苗寨农家乐' },
        contact_name: { type: 'string', description: '联系人姓名', example: '李明' },
        phone: { type: 'string', description: '联系电话', example: '13800138001' },
        password: { type: 'string', description: '登录密码', example: 'merchant123' },
        address: { type: 'string', description: '店铺地址', example: '贵州省黔东南州乌东苗寨' },
        description: { type: 'string', description: '店铺简介', example: '提供正宗苗家菜和住宿服务' },
        status: { type: 'number', description: '状态 1启用 0禁用', example: 1 },
      },
      example: {
        shop_name: '乌东苗寨农家乐',
        contact_name: '李明',
        phone: '13800138001',
        password: 'merchant123',
        address: '贵州省黔东南州乌东苗寨',
        description: '提供正宗苗家菜和住宿服务',
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
        data: {
          id: 2,
          shop_name: '乌东苗寨农家乐',
          contact_name: '李明',
          phone: '13800138001',
          address: '贵州省黔东南州乌东苗寨',
          description: '提供正宗苗家菜和住宿服务',
          status: 1,
          created_at: '2026-06-21T08:00:00.000Z',
        },
      },
    },
  })
  async create(@Body() body: any) {
    const bcrypt = require('bcryptjs');
    if (body.password) {
      body.password_hash = bcrypt.hashSync(body.password, 12);
      delete body.password;
    }
    const item = await this.merchantService.create(body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 更新商家信息
   * PUT /api/merchants/update/:id
   * @param id - 商家 ID
   * @param body - 更新的商家信息（包含 password 字段会自动加密为 password_hash）
   * @returns 更新后的商家信息
   */
  @Put('/update/:id')
  @ApiOperation({ summary: '更新商家信息' })
  @ApiParam({ name: 'id', description: '商家ID', example: 1 })
  @ApiBody({
    schema: {
      properties: {
        shop_name: { type: 'string', description: '店铺名称', example: '乌东苗寨农家乐（新店）' },
        contact_name: { type: 'string', description: '联系人姓名', example: '李明' },
        phone: { type: 'string', description: '联系电话', example: '13800138001' },
        password: { type: 'string', description: '登录密码（不修改可不传）', example: 'newpassword123' },
        address: { type: 'string', description: '店铺地址', example: '贵州省黔东南州乌东苗寨主街' },
        description: { type: 'string', description: '店铺简介', example: '提供正宗苗家菜和住宿服务' },
        status: { type: 'number', description: '状态 1启用 0禁用', example: 1 },
      },
      example: {
        shop_name: '乌东苗寨农家乐（新店）',
        address: '贵州省黔东南州乌东苗寨主街',
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
        data: {
          id: 1,
          shop_name: '乌东苗寨农家乐（新店）',
          contact_name: '李明',
          phone: '13800138001',
          address: '贵州省黔东南州乌东苗寨主街',
          description: '提供正宗苗家菜和住宿服务',
          status: 1,
          updated_at: '2026-06-21T09:00:00.000Z',
        },
      },
    },
  })
  async update(@Param('id') id: number, @Body() body: any) {
    const bcrypt = require('bcryptjs');
    if (body.password) {
      body.password_hash = bcrypt.hashSync(body.password, 12);
      delete body.password;
    }
    delete body.id;
    const item = await this.merchantService.update(Number(id), body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 删除商家
   * DELETE /api/merchants/delete/:id
   * @param id - 商家 ID
   * @returns 操作结果
   */
  @Del('/delete/:id')
  @ApiOperation({ summary: '删除商家' })
  @ApiParam({ name: 'id', description: '商家ID', example: 1 })
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
    await this.merchantService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }
}
