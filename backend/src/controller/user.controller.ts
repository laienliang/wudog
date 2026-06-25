import { Controller, Get, Post, Put, Del, Query, Body, Param, Inject } from '@midwayjs/core';
import { UserService } from '../service/user.service';
import { success, fail } from '../utils/response';

@Controller('/user')
export class UserController {
  @Inject()
  userService: UserService;

  /**
   * 用户列表（分页）
   * GET /api/user/list?page=1&pageSize=20&keyword=xxx
   */
  @Get('/list')
  async list(@Query() query: any) {
    const result = await this.userService.list(query);
    return success(result);
  }

  /**
   * 用户详情
   * GET /api/user/detail/:id
   */
  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    if (!id) return fail('参数错误: id 不能为空');
    const data = await this.userService.detail(Number(id));
    if (!data) return fail('用户不存在', 404);
    return success(data);
  }

  /**
   * 新增用户
   * POST /api/user/create
   */
  @Post('/create')
  async create(@Body() body: any) {
    if (!body || !body.username || !body.password) {
      return fail('参数错误: username、password 不能为空');
    }
    const data = await this.userService.create(body);
    return success(data, '创建成功');
  }

  /**
   * 更新用户
   * PUT /api/user/update/:id
   */
  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    if (!id) return fail('参数错误: id 不能为空');
    if (!body) return fail('参数错误: 更新内容不能为空');
    const data = await this.userService.update(Number(id), body);
    if (!data) return fail('用户不存在', 404);
    return success(data, '更新成功');
  }

  /**
   * 软删除用户
   * DELETE /api/user/delete/:id
   */
  @Del('/delete/:id')
  async delete(@Param('id') id: number) {
    if (!id) return fail('参数错误: id 不能为空');
    try {
      await this.userService.softDelete(Number(id));
      return success(null, '删除成功');
    } catch (e) {
      return fail(e.message, 404);
    }
  }
}
