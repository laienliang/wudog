import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { ApiOperation, ApiBody, ApiQuery, ApiParam, ApiTags, ApiResponse, ApiBearerAuth } from '@midwayjs/swagger';
import { AdminService } from '../service/admin.service';
import { RoleService } from '../service/role.service';

/**
 * 管理员控制器
 * 处理管理员相关的 API 请求，包括管理员的增删改查操作
 */
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('/api/admin')
export class AdminController {
  @Inject()
  adminService: AdminService;

  @Inject()
  roleService: RoleService;

  /**
   * 获取管理员列表（分页）
   * GET /api/admin/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @param keyword - 搜索关键词（可选）
   * @returns 分页管理员列表
   */
  @Get('/list')
  @ApiOperation({ summary: '获取管理员列表（分页）' })
  @ApiQuery({ name: 'page', description: '页码', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', description: '每页数量', required: false, example: 20 })
  @ApiQuery({ name: 'keyword', description: '搜索关键词（用户名/姓名/手机号）', required: false, example: 'admin' })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          list: [
            { id: 1, username: 'admin01', name: '张三', phone: '13800138000', role_id: 1, role_name: '超级管理员', status: 1, created_at: '2026-01-01 10:00:00' },
            { id: 2, username: 'admin02', name: '李四', phone: '13900139000', role_id: 2, role_name: '运营管理员', status: 1, created_at: '2026-01-02 14:30:00' },
          ],
          total: 15,
          page: 1,
          pageSize: 20,
        },
      },
    },
  })
  async list(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('keyword') keyword?: string) {
    const result = await this.adminService.findAll(Number(page), Number(pageSize), keyword);
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取管理员详情
   * GET /api/admin/detail/:id
   * @param id - 管理员 ID
   * @returns 管理员详细信息
   */
  @Get('/detail/:id')
  @ApiOperation({ summary: '获取管理员详情' })
  @ApiParam({ name: 'id', description: '管理员ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: { id: 1, username: 'admin01', name: '张三', phone: '13800138000', role_id: 1, role_name: '超级管理员', status: 1, created_at: '2026-01-01 10:00:00', updated_at: '2026-01-01 10:00:00' },
      },
    },
  })
  async detail(@Param('id') id: number) {
    const item = await this.adminService.findById(Number(id));
    if (!item) return { code: 404, message: '不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 创建管理员
   * POST /api/admin/create
   * @param body - 管理员信息（包含 password 字段会自动加密为 password_hash）
   * @returns 创建后的管理员信息
   */
  @Post('/create')
  @ApiOperation({ summary: '创建管理员' })
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string', description: '用户名', example: 'admin01' },
        password: { type: 'string', description: '密码', example: 'admin123' },
        name: { type: 'string', description: '姓名', example: '张三' },
        phone: { type: 'string', description: '手机号', example: '13800138000' },
        role_id: { type: 'number', description: '角色ID', example: 1 },
        status: { type: 'number', description: '状态 1启用 0禁用', example: 1 },
      },
      example: {
        username: 'admin01',
        password: 'admin123',
        name: '张三',
        phone: '13800138000',
        role_id: 1,
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
        data: { id: 1, username: 'admin01', name: '张三', phone: '13800138000', role_id: 1, status: 1 },
      },
    },
  })
  async create(@Body() body: any) {
    const bcrypt = require('bcryptjs');
    if (body.password) {
      body.password_hash = bcrypt.hashSync(body.password, 12);
      delete body.password;
    }
    const item = await this.adminService.create(body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 更新管理员信息
   * PUT /api/admin/update/:id
   * @param id - 管理员 ID
   * @param body - 更新的管理员信息（包含 password 字段会自动加密为 password_hash）
   * @returns 更新后的管理员信息
   */
  @Put('/update/:id')
  @ApiOperation({ summary: '更新管理员信息' })
  @ApiParam({ name: 'id', description: '管理员ID', example: 1 })
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string', description: '用户名', example: 'admin01' },
        password: { type: 'string', description: '密码（留空则不修改）', example: 'newpass123' },
        name: { type: 'string', description: '姓名', example: '张三' },
        phone: { type: 'string', description: '手机号', example: '13800138000' },
        role_id: { type: 'number', description: '角色ID', example: 1 },
        status: { type: 'number', description: '状态 1启用 0禁用', example: 1 },
      },
      example: {
        name: '张三',
        phone: '13800138000',
        role_id: 1,
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
        data: { id: 1, username: 'admin01', name: '张三', phone: '13800138000', role_id: 1, status: 1 },
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
    const item = await this.adminService.update(Number(id), body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 删除管理员
   * DELETE /api/admin/delete/:id
   * @param id - 管理员 ID
   * @returns 操作结果
   */
  @Del('/delete/:id')
  @ApiOperation({ summary: '删除管理员' })
  @ApiParam({ name: 'id', description: '管理员ID', example: 1 })
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
    // 系统内置角色的管理员不允许删除
    const admin = await this.adminService.findById(Number(id));
    if (admin && admin.role_id) {
      const role = await this.roleService.findById(admin.role_id);
      if (role && role.type === 'system') {
        return { code: 403, message: '系统内置角色的管理员不允许删除', data: null };
      }
    }
    await this.adminService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }
}
