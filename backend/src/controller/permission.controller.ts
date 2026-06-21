import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { ApiOperation, ApiBody, ApiQuery, ApiParam, ApiTags, ApiResponse, ApiBearerAuth } from '@midwayjs/swagger';
import { PermissionService } from '../service/permission.service';

/**
 * 权限控制器
 * 处理权限相关的 API 请求，包括权限的增删改查、树形结构查询及角色权限分配
 */
@ApiTags('Permission')
@ApiBearerAuth()
@Controller('/api/permissions')
export class PermissionController {
  @Inject()
  permissionService: PermissionService;

  /**
   * 获取权限列表（分页）
   * GET /api/permissions/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @param keyword - 搜索关键词（可选）
   * @returns 分页权限列表
   */
  @Get('/list')
  @ApiOperation({ summary: '获取权限列表（分页）' })
  @ApiQuery({ name: 'page', description: '页码', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', description: '每页数量', required: false, example: 20 })
  @ApiQuery({ name: 'keyword', description: '搜索关键词', required: false, example: '用户管理' })
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          list: [
            { id: 1, name: '用户管理', code: 'user:manage', type: 'menu', parent_id: 0, sort: 1, status: 1 },
            { id: 2, name: '用户列表', code: 'user:list', type: 'button', parent_id: 1, sort: 1, status: 1 },
          ],
          total: 50,
          page: 1,
          pageSize: 20,
        },
      },
    },
  })
  async list(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('keyword') keyword?: string
  ) {
    const result = await this.permissionService.findAll(Number(page), Number(pageSize), keyword);
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取权限树形结构
   * GET /api/permissions/tree
   * @returns 树形结构的权限列表
   */
  @Get('/tree')
  @ApiOperation({ summary: '获取权限树形结构' })
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: [
          {
            id: 1,
            name: '用户管理',
            code: 'user:manage',
            type: 'menu',
            children: [
              { id: 2, name: '用户列表', code: 'user:list', type: 'button', children: [] },
              { id: 3, name: '用户编辑', code: 'user:edit', type: 'button', children: [] },
            ],
          },
        ],
      },
    },
  })
  async tree() {
    const result = await this.permissionService.getTree();
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取权限详情
   * GET /api/permissions/detail/:id
   * @param id - 权限 ID
   * @returns 权限详细信息
   */
  @Get('/detail/:id')
  @ApiOperation({ summary: '获取权限详情' })
  @ApiParam({ name: 'id', description: '权限ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: { id: 1, name: '用户管理', code: 'user:manage', type: 'menu', parent_id: 0, sort: 1, status: 1, description: '用户管理模块' },
      },
    },
  })
  async detail(@Param('id') id: number) {
    const item = await this.permissionService.findById(Number(id));
    if (!item) return { code: 404, message: '权限不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 创建权限
   * POST /api/permissions/create
   * @param body - 权限信息
   * @returns 创建后的权限信息
   */
  @Post('/create')
  @ApiOperation({ summary: '创建权限' })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', description: '权限名称', example: '用户管理' },
        code: { type: 'string', description: '权限编码', example: 'user:manage' },
        type: { type: 'string', description: '权限类型 menu/button', example: 'menu' },
        parent_id: { type: 'number', description: '父权限ID', example: 0 },
        sort: { type: 'number', description: '排序', example: 1 },
        status: { type: 'number', description: '状态 1启用 0禁用', example: 1 },
        description: { type: 'string', description: '描述', example: '用户管理模块' },
      },
      example: {
        name: '用户管理',
        code: 'user:manage',
        type: 'menu',
        parent_id: 0,
        sort: 1,
        status: 1,
        description: '用户管理模块',
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
        data: { id: 1, name: '用户管理', code: 'user:manage', type: 'menu', parent_id: 0, sort: 1, status: 1, description: '用户管理模块' },
      },
    },
  })
  async create(@Body() body: any) {
    const item = await this.permissionService.create(body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 更新权限信息
   * PUT /api/permissions/update/:id
   * @param id - 权限 ID
   * @param body - 更新的权限信息
   * @returns 更新后的权限信息
   */
  @Put('/update/:id')
  @ApiOperation({ summary: '更新权限信息' })
  @ApiParam({ name: 'id', description: '权限ID', example: 1 })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', description: '权限名称', example: '用户管理' },
        code: { type: 'string', description: '权限编码', example: 'user:manage' },
        type: { type: 'string', description: '权限类型 menu/button', example: 'menu' },
        parent_id: { type: 'number', description: '父权限ID', example: 0 },
        sort: { type: 'number', description: '排序', example: 1 },
        status: { type: 'number', description: '状态 1启用 0禁用', example: 1 },
        description: { type: 'string', description: '描述', example: '用户管理模块' },
      },
      example: {
        name: '用户管理',
        code: 'user:manage',
        type: 'menu',
        parent_id: 0,
        sort: 1,
        status: 1,
        description: '用户管理模块',
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
        data: { id: 1, name: '用户管理', code: 'user:manage', type: 'menu', parent_id: 0, sort: 1, status: 1, description: '用户管理模块' },
      },
    },
  })
  async update(@Param('id') id: number, @Body() body: any) {
    delete body.id;
    const item = await this.permissionService.update(Number(id), body);
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 删除权限
   * DELETE /api/permissions/delete/:id
   * @param id - 权限 ID
   * @returns 操作结果
   */
  @Del('/delete/:id')
  @ApiOperation({ summary: '删除权限' })
  @ApiParam({ name: 'id', description: '权限ID', example: 1 })
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
    await this.permissionService.delete(Number(id));
    return { code: 200, message: 'success', data: null };
  }

  /**
   * 获取指定角色的权限列表
   * GET /api/permissions/role/:roleId
   * @param roleId - 角色 ID
   * @returns 该角色拥有的权限列表
   */
  @Get('/role/:roleId')
  @ApiOperation({ summary: '获取指定角色的权限列表' })
  @ApiParam({ name: 'roleId', description: '角色ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: [
          { id: 1, name: '用户管理', code: 'user:manage', type: 'menu' },
          { id: 2, name: '用户列表', code: 'user:list', type: 'button' },
        ],
      },
    },
  })
  async getRolePermissions(@Param('roleId') roleId: number) {
    const result = await this.permissionService.findByRoleId(Number(roleId));
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 设置角色权限
   * POST /api/permissions/role/:roleId
   * @param roleId - 角色 ID
   * @param body - 包含 permissionIds（权限 ID 数组）
   * @returns 设置结果
   */
  @Post('/role/:roleId')
  @ApiOperation({ summary: '设置角色权限' })
  @ApiParam({ name: 'roleId', description: '角色ID', example: 1 })
  @ApiBody({
    schema: {
      properties: {
        permissionIds: { type: 'array', items: { type: 'number' }, description: '权限ID数组', example: [1, 2, 3] },
      },
      example: {
        permissionIds: [1, 2, 3],
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
        data: { roleId: 1, permissionIds: [1, 2, 3] },
      },
    },
  })
  async setRolePermissions(@Param('roleId') roleId: number, @Body() body: { permissionIds: number[] }) {
    const result = await this.permissionService.setRolePermissions(Number(roleId), body.permissionIds);
    return { code: 200, message: 'success', data: result };
  }
}
