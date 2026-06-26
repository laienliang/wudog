import { Provide } from '@midwayjs/core';
import { CoolCache, BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { LodgingRoomTypeEntity } from '../entity/roomType';

@Provide()
export class LodgingRoomTypeService extends BaseService {
  @InjectEntityModel(LodgingRoomTypeEntity)
  lodgingRoomTypeEntity: Repository<LodgingRoomTypeEntity>;

  @CoolCache(30 * 60) // 30 分钟缓存
  async list(query?, option?, connectionName?) {
    return super.list(query, option, connectionName);
  }
}
