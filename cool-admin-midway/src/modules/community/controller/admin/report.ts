import { CoolController, BaseController } from '@cool-midway/core';
import { CommunityReportEntity } from '../../entity/report';
import { CommunityReportService } from '../../service/report';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CommunityReportEntity,
  service: CommunityReportService,
  pageQueryOp: {
    keyWordLikeFields: ['reason'],
    fieldEq: ['userId', 'targetType', 'targetId', 'status'],
  },
})
export class AdminCommunityReportController extends BaseController {}
