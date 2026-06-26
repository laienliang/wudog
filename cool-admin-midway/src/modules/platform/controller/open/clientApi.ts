import { CoolController } from '@cool-midway/core';
import { Get, Query } from '@midwayjs/core';
import { OpenPlatformClientController } from './client';

/**
 * 前台接口旧路径兼容
 */
@CoolController({
  prefix: '/api/open/client',
  description: 'PC 与小程序前台接口旧路径兼容',
})
export class OpenPlatformClientApiController extends OpenPlatformClientController {
  @Get('/home', { summary: '首页聚合数据' })
  async home() {
    return super.home();
  }

  @Get('/search', { summary: '全站搜索' })
  async search(@Query('keyword') keyword: string, @Query('limit') limit: number) {
    return super.search(keyword, limit);
  }

  @Get('/categories', { summary: '前台分类与话题' })
  async categories() {
    return super.categories();
  }

  @Get('/page', { summary: '前台频道分页' })
  async channelPage(
    @Query('type') type,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('keyword') keyword: string,
    @Query('categoryId') categoryId: number,
    @Query('status') status: number
  ) {
    return super.channelPage(type, page, pageSize, keyword, categoryId, status);
  }

  @Get('/detail', { summary: '前台详情' })
  async detail(@Query('type') type, @Query('id') id: number) {
    return super.detail(type, id);
  }

  @Get('/cart', { summary: '购物车列表' })
  async cart(@Query('userId') userId: number) {
    return super.cart(userId);
  }
}
