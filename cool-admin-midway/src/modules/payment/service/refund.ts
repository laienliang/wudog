import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { RefundRecordEntity } from '../entity/refund';

@Provide()
export class RefundService extends BaseService {
  @InjectEntityModel(RefundRecordEntity)
  refundRecordEntity: Repository<RefundRecordEntity>;
}
