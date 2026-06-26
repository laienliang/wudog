import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityReportEntity } from '../entity/report';

@Provide()
export class CommunityReportService extends BaseService {
  @InjectEntityModel(CommunityReportEntity)
  communityReportEntity: Repository<CommunityReportEntity>;
}
