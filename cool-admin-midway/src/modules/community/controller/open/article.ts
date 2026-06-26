import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { CommunityArticleEntity } from '../../entity/article';
import { CommunityArticleService } from '../../service/article';

@CoolController({
  api: ['page', 'info', 'list'],
  entity: CommunityArticleEntity,
  service: CommunityArticleService,
  pageQueryOp: {
    keyWordLikeFields: ['title'],
    fieldEq: ['status'],
  },
})
export class OpenCommunityArticleController extends BaseController {
  @Inject()
  communityArticleService: CommunityArticleService;

  @Post('/publish', { summary: '发布游记' })
  async publish(@Body() body) {
    const res = await this.communityArticleService.publishArticle(body || {});
    if (!res.success) {
      return this.fail(res.message || '发布失败');
    }
    return this.ok(res);
  }
}
