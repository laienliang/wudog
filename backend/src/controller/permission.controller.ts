import { Controller, Post, Get, Put, Del, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { PermissionService } from '../service/permission.service';

/**
 * 权限控制器
 * 处理权限相关的 API 请求，包括权限的增删改查、树形结构查询及角色权限分配
 */
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
  async setRolePermissions(@Param('roleId') roleId: number, @Body() body: { permissionIds: number[] }) {
    const result = await this.permissionService.setRolePermissions(Number(roleId), body.permissionIds);
    return { code: 200, message: 'success', data: result };
  }
}
