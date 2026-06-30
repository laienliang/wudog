import { CoolController, BaseController, CoolCache } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { PlatformClientService } from '../../service/client';

/**
 * PC 与小程序前台接口
 */
@CoolController({
  prefix: '/open/client',
  description: 'PC 与小程序前台接口',
})
export class OpenPlatformClientController extends BaseController {
  @Inject()
  platformClientService: PlatformClientService;

  @CoolCache(30 * 60 * 1000) // 30 分钟缓存
  @Get('/home', { summary: '首页聚合数据' })
  async home() {
    return this.ok(await this.platformClientService.home());
  }

  @CoolCache(15 * 60 * 1000) // 15 分钟缓存
  @Get('/search', { summary: '全站搜索' })
  async search(@Query('keyword') keyword: string, @Query('limit') limit: number) {
    return this.ok(await this.platformClientService.search(keyword, limit));
  }

  @CoolCache(60 * 60 * 1000) // 1 小时缓存
  @Get('/categories', { summary: '前台分类与话题' })
  async categories() {
    return this.ok(await this.platformClientService.categories());
  }

  @CoolCache(30 * 60 * 1000) // 30 分钟缓存
  @Get('/page', { summary: '前台频道分页' })
  async channelPage(
    @Query('type') type,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('keyword') keyword: string,
    @Query('categoryId') categoryId: number,
    @Query('status') status: number
  ) {
    return this.ok(
      await this.platformClientService.page(type, {
        page,
        pageSize,
        keyword,
        categoryId,
        status,
      })
    );
  }

  @Get('/detail', { summary: '前台详情' })
  async detail(@Query('type') type, @Query('id') id: number) {
    const data = await this.platformClientService.detail(type, Number(id));
    if (!data) {
      return this.fail('内容不存在或已下架');
    }
    return this.ok(data);
  }

  @Get('/cart', { summary: '购物车列表' })
  async cart(@Query('userId') userId: number) {
    return this.ok(await this.platformClientService.cart(Number(userId)));
  }

  @Post('/cart/add', { summary: '加入购物车' })
  async addCart(@Body() body) {
    const res = await this.platformClientService.addCart(body || {});
    if (!res.success) {
      return this.fail(res.message || '加入购物车失败');
    }
    return this.ok(res);
  }

  @Get('/collect/status', { summary: '收藏状态' })
  async collectStatus(@Query('userId') userId: number, @Query('goodsId') goodsId: number) {
    return this.ok(
      await this.platformClientService.collectStatus(Number(userId), Number(goodsId))
    );
  }

  @Post('/collect/toggle', { summary: '切换收藏' })
  async toggleCollect(@Body() body) {
    const res = await this.platformClientService.toggleCollect(
      Number(body?.userId),
      Number(body?.goodsId)
    );
    if (!res.success) {
      return this.fail(res.message || '收藏操作失败');
    }
    return this.ok(res);
  }

  @Post('/order/create', { summary: '创建前台订单' })
  async createOrder(@Body() body) {
    const res = await this.platformClientService.createOrder(body || {});
    if (!res.success) {
      return this.fail(res.message || '创建订单失败');
    }
    return this.ok(res);
  }

  @Get('/order/page', { summary: '前台订单列表' })
  async orderPage(
    @Query('userId') userId: number,
    @Query('status') status: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number
  ) {
    return this.ok(await this.platformClientService.orderPage(Number(userId), status, page, pageSize));
  }

  @Get('/order/detail', { summary: '前台订单详情' })
  async orderDetail(@Query('id') id: number, @Query('userId') userId: number) {
    const data = await this.platformClientService.orderDetail(Number(id), Number(userId));
    if (!data) {
      return this.fail('订单不存在');
    }
    return this.ok(data);
  }

  @Post('/order/status', { summary: '更新订单状态' })
  async orderStatus(@Body() body) {
    const res = await this.platformClientService.updateOrderStatus(Number(body?.id), Number(body?.status));
    if (!res.success) {
      return this.fail(res.message || '更新订单状态失败');
    }
    return this.ok(res);
  }
}
