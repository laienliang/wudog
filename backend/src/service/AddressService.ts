import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entity/Address';

@Provide()
export class AddressService {
  @InjectEntityModel(Address)
  addressRepo: Repository<Address>;

  async getList(userId: number) {
    return await this.addressRepo.find({
      where: { user_id: userId, is_deleted: 0 },
      order: { is_default: 'DESC', created_at: 'DESC' },
    });
  }

  async create(data: { user_id: number; name: string; phone: string; province: string; city: string; district: string; town?: string; detail: string }) {
    // 如果是第一个地址，自动设为默认
    const count = await this.addressRepo.count({ where: { user_id: data.user_id, is_deleted: 0 } });
    const addr = this.addressRepo.create({ ...data, is_default: count === 0 ? 1 : 0 });
    return await this.addressRepo.save(addr);
  }

  async update(id: number, userId: number, data: Partial<Address>) {
    const addr = await this.addressRepo.findOne({ where: { id, user_id: userId, is_deleted: 0 } });
    if (!addr) return { code: 404, message: '地址不存在' };
    await this.addressRepo.update(id, data);
    return { code: 200, message: '更新成功' };
  }

  async delete(id: number, userId: number) {
    const addr = await this.addressRepo.findOne({ where: { id, user_id: userId, is_deleted: 0 } });
    if (!addr) return { code: 404, message: '地址不存在' };
    await this.addressRepo.update(id, { is_deleted: 1 });
    // 如果删除的是默认地址，将第一个地址设为默认
    if (addr.is_default) {
      const first = await this.addressRepo.findOne({ where: { user_id: userId, is_deleted: 0 }, order: { created_at: 'ASC' } });
      if (first) await this.addressRepo.update(first.id, { is_default: 1 });
    }
    return { code: 200, message: '删除成功' };
  }

  async setDefault(id: number, userId: number) {
    const addr = await this.addressRepo.findOne({ where: { id, user_id: userId, is_deleted: 0 } });
    if (!addr) return { code: 404, message: '地址不存在' };
    // 取消所有默认
    await this.addressRepo.update({ user_id: userId }, { is_default: 0 });
    // 设置当前为默认
    await this.addressRepo.update(id, { is_default: 1 });
    return { code: 200, message: '设置成功' };
  }
}
