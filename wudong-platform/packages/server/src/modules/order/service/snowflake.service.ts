import { Provide } from '@midwayjs/core';

/**
 * 雪花算法ID生成器
 *
 * 基于 Twitter Snowflake 算法，使用 BigInt 处理 64 位整数运算。
 * - 自定义纪元：2026-01-01 00:00:00 UTC
 * - machineIdBits = 10（支持 1024 台机器）
 * - sequenceBits = 12（每毫秒支持 4096 个序列号）
 * - 生成的 ID 为 19 位纯数字字符串
 */
@Provide()
export class SnowflakeService {
  /** 自定义纪元：2026-01-01 00:00:00 UTC（毫秒时间戳） */
  private readonly epoch = 1767225600000n;

  /** 机器ID所占位数 */
  private readonly machineIdBits = 10n;

  /** 序列号所占位数 */
  private readonly sequenceBits = 12n;

  /** 机器ID左移位数 */
  private readonly machineIdShift = this.sequenceBits;

  /** 时间戳左移位数 */
  private readonly timestampShift = this.sequenceBits + this.machineIdBits;

  /** 序列号掩码（4095） */
  private readonly sequenceMask = (1n << this.sequenceBits) - 1n;

  /** 机器ID */
  private machineId = 0n;

  /** 上次生成ID的时间戳 */
  private lastTimestamp = -1n;

  /** 当前毫秒内的序列号 */
  private sequence = 0n;

  constructor() {
    // 单机部署，machineId 固定为 0
    this.machineId = 0n;
  }

  /**
   * 生成下一个唯一ID
   * @returns 19位纯数字字符串
   * @throws 当时钟回拨时抛出异常
   */
  nextId(): string {
    let timestamp = this.currentTimestamp();

    // 时钟回拨检测
    if (timestamp < this.lastTimestamp) {
      throw new Error('时钟回拨，拒绝生成ID');
    }

    // 同一毫秒内
    if (timestamp === this.lastTimestamp) {
      // 序列号自增，并通过掩码取低 sequenceBits 位
      this.sequence = (this.sequence + 1n) & this.sequenceMask;
      // 当前毫秒序列耗尽，等待下一毫秒
      if (this.sequence === 0n) {
        while (timestamp <= this.lastTimestamp) {
          timestamp = this.currentTimestamp();
        }
      }
    } else {
      // 新的一毫秒，序列号归零
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;

    // 组装ID：时间戳差值 << 22 | machineId << 12 | sequence
    const id =
      ((timestamp - this.epoch) << this.timestampShift) |
      (this.machineId << this.machineIdShift) |
      this.sequence;

    return id.toString();
  }

  /**
   * 解析雪花算法生成的ID，提取时间戳、机器ID和序列号
   * @param id - 雪花算法生成的ID字符串
   * @returns 解析结果，包含生成时间、机器ID和序列号
   */
  parseId(id: string): { timestamp: Date; machineId: number; sequence: number } {
    const idBig = BigInt(id);
    const timestamp =
      Number((idBig >> this.timestampShift) + this.epoch);
    const machineId = Number(
      (idBig >> this.machineIdShift) & ((1n << this.machineIdBits) - 1n)
    );
    const sequence = Number(idBig & this.sequenceMask);
    return { timestamp: new Date(timestamp), machineId, sequence };
  }

  /**
   * 获取当前毫秒时间戳（BigInt 格式）
   */
  private currentTimestamp(): bigint {
    return BigInt(Date.now());
  }
}
