import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { LodgingHostelPolicyEntity } from '../entity/hostelPolicy';

@Provide()
export class LodgingHostelPolicyService extends BaseService {
  @InjectEntityModel(LodgingHostelPolicyEntity)
  lodgingHostelPolicyEntity: Repository<LodgingHostelPolicyEntity>;
}
