import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { UserService } from '../service/user.service';

/**
 * 用户控制器
 * 处理用户相关的 API 请求，包括用户的增删改查及封禁/解封操作
 */
@Controller('/api/users')
export class UserController {
  @Inject()
  userService: UserService;

  /**
   * 获取用户列表（分页）
   * GET /api/users/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @param keyword - 搜索关键词（可选）
   * @param status - 用户状态筛选（可选）
   * @returns 分页用户列表
   */
  @Get('/list')
  async list(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('keyword') keyword?: string,
    @Query('status') status?: number
  ) {
    const result = await this.userService.findAll(Number(page), Number(pageSize), keyword, status);
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取用户详情
   * GET /api/users/detail/:id
   * @param id - 用户 ID
   * @returns 用户详细信息
   */
  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    const item = await this.userService.findById(Number(id));
    if (!item) return { code: 404, message: '用户不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 创建用户
   * POST /api/users/create
   * @param body - 用户信息（包含 password 字段会自动加密为 password_hash）
   * @returns 创建后的用户信息
   */
  @Post('/create')
  async create(@Body() body: any) {
    const bcrypt = require('bcryptjs');
    if (body.password) {
      body.password_hash = bcrypt.hashSync(body.password, 12);
      delete body.password;
    }
    const item = await this.userService.create(body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 更新用户信息
   * PUT /api/users/update/:id
   * @param id - 用户 ID
   * @param body - 更新的用户信息（包含 password 字段会自动加密为 password_hash）
   * @returns 更新后的用户信息
   */
  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    const bcrypt = require('bcryptjs');
    if (body.password) {
      body.password_hash = bcrypt.hashSync(body.password, 12);
      delete body.password;
    }
    delete body.id;
    const item = await this.userService.update(Number(id), body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 删除用户
   * DELETE /api/users/delete/:id
   * @param id - 用户 ID
   * @returns 操作结果
   */
  @Del('/delete/:id')
  async remove(@Param('id') id: number) {
    await this.userService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }

  /**
   * 封禁用户
   * POST /api/users/ban/:id
   * @param id - 用户 ID
   * @returns 操作结果
   */
  @Post('/ban/:id')
  async ban(@Param('id') id: number) {
    const item = await this.userService.update(Number(id), { status: 0 });
    if (!item) return { code: 404, message: '用户不存在', data: null };
    return { code: 200, message: '封禁成功', data: item };
  }

  /**
   * 解封用户
   * POST /api/users/unban/:id
   * @param id - 用户 ID
   * @returns 操作结果
   */
  @Post('/unban/:id')
  async unban(@Param('id') id: number) {
    const item = await this.userService.update(Number(id), { status: 1 });
    if (!item) return { code: 404, message: '用户不存在', data: null };
    return { code: 200, message: '解封成功', data: item };
  }
}
