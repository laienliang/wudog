import { Controller, Get, Post, Put, Del, Body, Param, Inject } from '@midwayjs/core';
import { CurrentUser } from '../decorator/CurrentUser';
import { AddressService } from '../service/AddressService';

@Controller('/api/address')
export class AddressController {
  @Inject()
  addressService: AddressService;

  @Get('/list')
  async list(@CurrentUser user: any) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    const list = await this.addressService.getList(user.id);
    return { code: 200, message: 'success', data: list };
  }

  @Post('/create')
  async create(@CurrentUser user: any, @Body() body: { name: string; phone: string; province: string; city: string; district: string; town?: string; detail: string }) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    if (!body.name || !body.phone || !body.province || !body.city || !body.detail) {
      return { code: 400, message: '请填写完整地址信息', data: null };
    }
    const addr = await this.addressService.create({ ...body, user_id: user.id });
    return { code: 200, message: '添加成功', data: addr };
  }

  @Put('/update/:id')
  async update(@CurrentUser user: any, @Param('id') id: number, @Body() body: any) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    const result = await this.addressService.update(id, user.id, body);
    return result.code ? result : { code: 200, message: '更新成功', data: null };
  }

  @Del('/delete/:id')
  async delete(@CurrentUser user: any, @Param('id') id: number) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    const result = await this.addressService.delete(id, user.id);
    return result;
  }

  @Put('/set-default/:id')
  async setDefault(@CurrentUser user: any, @Param('id') id: number) {
    if (!user?.id) return { code: 401, message: '未登录', data: null };
    const result = await this.addressService.setDefault(id, user.id);
    return result;
  }
}
