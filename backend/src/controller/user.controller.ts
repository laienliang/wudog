import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { ApiOperation, ApiBody, ApiQuery, ApiParam, ApiTags, ApiResponse, ApiBearerAuth } from '@midwayjs/swagger';
import { UserService } from '../service/user.service';

/**
 * 用户控制器
 * 处理用户相关的 API 请求，包括用户的增删改查及封禁/解封操作
 */
@ApiTags('User')
@ApiBearerAuth()
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
  @ApiOperation({ summary: '获取用户列表（分页）' })
  @ApiQuery({ name: 'page', description: '页码', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', description: '每页数量', required: false, example: 20 })
  @ApiQuery({ name: 'keyword', description: '搜索关键词', required: false, example: '张三' })
  @ApiQuery({ name: 'status', description: '用户状态 1正常 0封禁', required: false, example: 1 })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          list: [
            { id: 1, username: 'user01', nickname: '张三', phone: '13800138001', email: 'zhangsan@example.com', avatar: 'https://example.com/avatar1.jpg', status: 1, created_at: '2026-01-15 10:30:00' },
            { id: 2, username: 'user02', nickname: '李四', phone: '13800138002', email: 'lisi@example.com', avatar: 'https://example.com/avatar2.jpg', status: 1, created_at: '2026-02-20 14:00:00' },
          ],
          total: 100,
        },
      },
    },
  })
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
  @ApiOperation({ summary: '获取用户详情' })
  @ApiParam({ name: 'id', description: '用户ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          username: 'user01',
          nickname: '张三',
          phone: '13800138001',
          email: 'zhangsan@example.com',
          avatar: 'https://example.com/avatar1.jpg',
          gender: 1,
          status: 1,
          created_at: '2026-01-15 10:30:00',
          updated_at: '2026-03-10 08:45:00',
        },
      },
    },
  })
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
  @ApiOperation({ summary: '创建用户' })
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string', description: '用户名', example: 'user01' },
        password: { type: 'string', description: '密码', example: 'User@123456' },
        nickname: { type: 'string', description: '昵称', example: '张三' },
        phone: { type: 'string', description: '手机号', example: '13800138001' },
        email: { type: 'string', description: '邮箱', example: 'zhangsan@example.com' },
        avatar: { type: 'string', description: '头像URL', example: 'https://example.com/avatar1.jpg' },
        gender: { type: 'number', description: '性别 0未知 1男 2女', example: 1 },
        status: { type: 'number', description: '状态 1正常 0封禁', example: 1 },
      },
      example: {
        username: 'user01',
        password: 'User@123456',
        nickname: '张三',
        phone: '13800138001',
        email: 'zhangsan@example.com',
        avatar: 'https://example.com/avatar1.jpg',
        gender: 1,
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
          id: 1,
          username: 'user01',
          nickname: '张三',
          phone: '13800138001',
          email: 'zhangsan@example.com',
          avatar: 'https://example.com/avatar1.jpg',
          gender: 1,
          status: 1,
          created_at: '2026-06-21 10:00:00',
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
  @ApiOperation({ summary: '更新用户信息' })
  @ApiParam({ name: 'id', description: '用户ID', example: 1 })
  @ApiBody({
    schema: {
      properties: {
        nickname: { type: 'string', description: '昵称', example: '张三丰' },
        phone: { type: 'string', description: '手机号', example: '13900139001' },
        email: { type: 'string', description: '邮箱', example: 'zhangsanfeng@example.com' },
        avatar: { type: 'string', description: '头像URL', example: 'https://example.com/avatar_new.jpg' },
        gender: { type: 'number', description: '性别 0未知 1男 2女', example: 1 },
        password: { type: 'string', description: '密码（可选，传入则自动加密）', example: 'NewPass@123' },
      },
      example: {
        nickname: '张三丰',
        phone: '13900139001',
        email: 'zhangsanfeng@example.com',
        avatar: 'https://example.com/avatar_new.jpg',
        gender: 1,
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
          username: 'user01',
          nickname: '张三丰',
          phone: '13900139001',
          email: 'zhangsanfeng@example.com',
          avatar: 'https://example.com/avatar_new.jpg',
          gender: 1,
          status: 1,
          updated_at: '2026-06-21 10:30:00',
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
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', description: '用户ID', example: 1 })
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
  @ApiOperation({ summary: '封禁用户' })
  @ApiParam({ name: 'id', description: '用户ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '封禁成功',
    schema: {
      example: {
        code: 200,
        message: '封禁成功',
        data: {
          id: 1,
          username: 'user01',
          nickname: '张三',
          status: 0,
        },
      },
    },
  })
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
  @ApiOperation({ summary: '解封用户' })
  @ApiParam({ name: 'id', description: '用户ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '解封成功',
    schema: {
      example: {
        code: 200,
        message: '解封成功',
        data: {
          id: 1,
          username: 'user01',
          nickname: '张三',
          status: 1,
        },
      },
    },
  })
  async unban(@Param('id') id: number) {
    const item = await this.userService.update(Number(id), { status: 1 });
    if (!item) return { code: 404, message: '用户不存在', data: null };
    return { code: 200, message: '解封成功', data: item };
  }
}
