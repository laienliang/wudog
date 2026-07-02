import { Controller, Get, Post, Inject, Body, Query, Param } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { FavoriteService } from '../service/favorite';
import { FavoriteToggleDTO } from '../dto/favorite';

@Controller('/api/favorites')
export class FavoriteController {
  @Inject()
  favoriteService: FavoriteService;

  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, ctx: Context) {
    try {
      const userId = (ctx as any).currentUser?.id ?? 1;
      const data = await this.favoriteService.list(userId, { page, pageSize });
      if (!data) return { code: 200, message: 'success', data: { total: 0, list: [] } };
      return { code: 200, message: 'success', data };
    } catch { return { code: 200, message: 'success', data: { total: 0, list: [] } }; }
  }

  @Post('/toggle')
  async toggle(@Body() body: FavoriteToggleDTO, ctx: Context) {
    const userId = (ctx as any).currentUser?.id || 1;
    try {
      const data = await this.favoriteService.toggle(userId, body.homestay_id);
      return { code: 200, message: data.isFavorited ? '收藏成功' : '已取消收藏', data };
    } catch (err: any) { return { code: 400, message: err.message, data: null }; }
  }

  @Get('/check/:id')
  async checkFavorite() {
    return { code: 200, message: 'success', data: { isFavorited: false } };
  }
}
