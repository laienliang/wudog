import { Provide } from '@midwayjs/core';
import { CoolCache, BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityArticleEntity } from '../entity/article';

@Provide()
export class CommunityArticleService extends BaseService {
  @InjectEntityModel(CommunityArticleEntity)
  communityArticleEntity: Repository<CommunityArticleEntity>;

  @CoolCache(15 * 60) // 15 分钟缓存，UGC 内容更新较频繁
  async list(query?, option?, connectionName?) {
    return super.list(query, option, connectionName);
  }

  @CoolCache(15 * 60) // 15 分钟缓存
  async page(query?, option?, connectionName?) {
    return super.page(query, option, connectionName);
  }

  @CoolCache(15 * 60) // 15 分钟缓存
  async info(id, infoIgnoreProperty?) {
    return super.info(id, infoIgnoreProperty);
  }

  async publishArticle(input: {
    userId?: number;
    title?: string;
    content?: string;
    images?: string[];
    videoUrl?: string;
    topicIds?: number[];
    relatedPlaceType?: number;
    relatedPlaceId?: number;
  }) {
    const title = (input.title || '').trim();
    const content = (input.content || '').trim();
    if (!title || !content) {
      return { success: false, message: '请填写标题和内容' };
    }

    const article = this.communityArticleEntity.create({
      userId: Number(input.userId || 0),
      title,
      content,
      images: Array.isArray(input.images) ? input.images : [],
      videoUrl: input.videoUrl || '',
      topicIds: Array.isArray(input.topicIds) ? input.topicIds : [],
      relatedPlaceType: input.relatedPlaceType ? Number(input.relatedPlaceType) : null,
      relatedPlaceId: input.relatedPlaceId ? Number(input.relatedPlaceId) : null,
      likes: 0,
      comments: 0,
      collects: 0,
      views: 0,
      status: 0,
    });

    return { success: true, article: await this.communityArticleEntity.save(article) };
  }
}
