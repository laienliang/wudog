import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { ApiOperation, ApiBody, ApiQuery, ApiParam, ApiTags, ApiResponse, ApiBearerAuth } from '@midwayjs/swagger';
import { RoleService } from '../service/role.service';

/**
 * 角色控制器
 * 处理角色相关的 API 请求，包括角色的增删改查操作
 */
@ApiTags('Role')
@ApiBearerAuth()
@Controller('/api/roles')
export class RoleController {
  @Inject()
  roleService: RoleService;

  /**
   * 获取角色列表（分页）
   * GET /api/roles/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @param keyword - 搜索关键词（可选）
   * @returns 分页角色列表
   */
  @Get('/list')
  @ApiOperation({ summary: '获取角色列表（分页）' })
  @ApiQuery({ name: 'page', description: '页码', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', description: '每页数量', required: false, example: 20 })
  @ApiQuery({ name: 'keyword', description: '搜索关键词', required: false, example: '管理员' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          list: [
            { id: 1, name: '超级管理员', description: '拥有所有权限', type: 'system', status: 1, created_at: '2025-01-01 00:00:00' },
            { id: 2, name: '内容编辑', description: '负责内容管理', type: 'custom', status: 1, created_at: '2025-01-15 10:30:00' },
          ],
          total: 2,
        },
      },
    },
  })
  async list(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('keyword') keyword?: string) {
    const result = await this.roleService.findAll(Number(page), Number(pageSize), keyword);
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取角色详情
   * GET /api/roles/detail/:id
   * @param id - 角色 ID
   * @returns 角色详细信息
   */
  @Get('/detail/:id')
  @ApiOperation({ summary: '获取角色详情' })
  @ApiParam({ name: 'id', description: '角色ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: { id: 1, name: '超级管理员', description: '拥有所有权限', type: 'system', status: 1, created_at: '2025-01-01 00:00:00' },
      },
    },
  })
  async detail(@Param('id') id: number) {
    const item = await this.roleService.findById(Number(id));
    if (!item) return { code: 404, message: '不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 创建角色
   * POST /api/roles/create
   * @param body - 角色信息
   * @returns 创建后的角色信息
   */
  @Post('/create')
  @ApiOperation({ summary: '创建角色' })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', description: '角色名称', example: '内容编辑' },
        description: { type: 'string', description: '角色描述', example: '负责内容管理' },
        status: { type: 'number', description: '状态 1启用 0禁用', example: 1 },
      },
      example: {
        name: '内容编辑',
        description: '负责内容管理',
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
        data: { id: 3, name: '内容编辑', description: '负责内容管理', type: 'custom', status: 1, created_at: '2025-06-21 10:00:00' },
      },
    },
  })
  async create(@Body() body: any) {
    const item = await this.roleService.create(body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 更新角色信息
   * PUT /api/roles/update/:id
   * @param id - 角色 ID
   * @param body - 更新的角色信息
   * @returns 更新后的角色信息
   */
  @Put('/update/:id')
  @ApiOperation({ summary: '更新角色信息' })
  @ApiParam({ name: 'id', description: '角色ID', example: 2 })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', description: '角色名称', example: '内容编辑' },
        description: { type: 'string', description: '角色描述', example: '负责内容管理和审核' },
        status: { type: 'number', description: '状态 1启用 0禁用', example: 1 },
      },
      example: {
        name: '内容编辑',
        description: '负责内容管理和审核',
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
        data: { id: 2, name: '内容编辑', description: '负责内容管理和审核', type: 'custom', status: 1, created_at: '2025-01-15 10:30:00' },
      },
    },
  })
  async update(@Param('id') id: number, @Body() body: any) {
    delete body.id;
    // 系统内置角色不允许修改 type 字段
    const existing = await this.roleService.findById(Number(id));
    if (existing && existing.type === 'system') {
      delete body.type;
    }
    const item = await this.roleService.update(Number(id), body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 删除角色
   * DELETE /api/roles/delete/:id
   * @param id - 角色 ID
   * @returns 操作结果
   */
  @Del('/delete/:id')
  @ApiOperation({ summary: '删除角色' })
  @ApiParam({ name: 'id', description: '角色ID', example: 2 })
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
    // 系统内置角色不允许删除
    const role = await this.roleService.findById(Number(id));
    if (role && role.type === 'system') {
      return { code: 403, message: '系统内置角色不允许删除', data: null };
    }
    await this.roleService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }

  /**
   * 获取角色的权限列表
   * GET /api/roles/:id/permissions
   * @param id - 角色 ID
   * @returns 权限 ID 列表
   */
  @Get('/:id/permissions')
  @ApiOperation({ summary: '获取角色的权限列表' })
  @ApiParam({ name: 'id', description: '角色ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: [1, 2, 3, 5, 8, 13],
      },
    },
  })
  async getPermissions(@Param('id') id: number) {
    const permIds = await this.roleService.getPermissionIds(Number(id));
    return { code: 200, message: 'success', data: permIds };
  }

  /**
   * 设置角色的权限
   * PUT /api/roles/:id/permissions
   * @param id - 角色 ID
   * @param body - { permissionIds: number[] }
   * @returns 操作结果
   */
  @Put('/:id/permissions')
  @ApiOperation({ summary: '设置角色的权限' })
  @ApiParam({ name: 'id', description: '角色ID', example: 2 })
  @ApiBody({
    schema: {
      properties: {
        permissionIds: { type: 'array', items: { type: 'number' }, description: '权限ID列表', example: [1, 2, 3, 5] },
      },
      example: {
        permissionIds: [1, 2, 3, 5],
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '设置成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: null,
      },
    },
  })
  async setPermissions(@Param('id') id: number, @Body() body: any) {
    const permissionIds = body.permissionIds || [];
    await this.roleService.setPermissions(Number(id), permissionIds);
    return { code: 200, message: 'success', data: null };
  }
}
