import { Provide } from '@midwayjs/decorator';
import * as path from 'path';
import * as fs from 'fs';
import { getOssConfig } from '../config/oss.config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const OSS = require('ali-oss');

/**
 * OSS 存储服务
 * 处理阿里云 OSS 文件的上传、删除及签名生成操作
 */
@Provide()
export class OssService {
  private client: any = null;

  /**
   * 获取 OSS 客户端（单例模式，首次调用时初始化）
   * @returns ali-oss 客户端实例
   */
  private getClient(): any {
    if (!this.client) {
      const ossConfig = getOssConfig();

      if (!ossConfig.accessKeyId || !ossConfig.accessKeySecret) {
        throw new Error('OSS 配置缺失：请配置 OSS_ACCESS_KEY_ID 和 OSS_ACCESS_KEY_SECRET');
      }

      const options: any = {
        accessKeyId: ossConfig.accessKeyId,
        accessKeySecret: ossConfig.accessKeySecret,
        bucket: ossConfig.bucket,
      };

      if (ossConfig.endpoint) {
        options.endpoint = ossConfig.endpoint;
      } else {
        options.region = ossConfig.region;
      }

      if (ossConfig.cname) {
        options.cname = ossConfig.cname;
      }

      options.secure = ossConfig.secure;

      this.client = new OSS(options);
    }
    return this.client;
  }

  /**
   * 上传文件到 OSS
   * @param fileBuffer 文件内容的 Buffer
   * @param originalName 原始文件名
   * @param mimeType 文件 MIME 类型（可选，自动根据扩展名推断）
   * @returns 包含 url、name、originalName 和 size 的上传结果
   */
  async uploadFile(fileBuffer: Buffer, originalName: string, mimeType?: string): Promise<{
    url: string;
    name: string;
    originalName: string;
    size: number;
  }> {
    const client = this.getClient();
    const ossConfig = getOssConfig();

    // 生成唯一文件名
    const ext = path.extname(originalName).toLowerCase();
    const fileName = `${ossConfig.dir}${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    // 上传到 OSS
    const result = await client.put(fileName, fileBuffer, {
      headers: {
        'Content-Type': mimeType || this.getMimeType(ext),
        'x-oss-storage-class': 'Standard',
      },
    });

    return {
      url: result.url,
      name: fileName,
      originalName: originalName,
      size: fileBuffer.length,
    };
  }

  /**
   * 生成预签名 URL（用于前端直传）
   * @param fileName 文件名
   * @param expires 过期时间（秒），默认 3600
   * @returns 预签名 URL 字符串
   */
  async getSignedUrl(fileName: string, expires = 3600): Promise<string> {
    const client = this.getClient();
    const url = client.signatureUrl(fileName, {
      expires,
      method: 'PUT',
    });
    return url;
  }

  /**
   * 生成上传签名（用于前端直传 OSS）
   * @param dir 上传目录（可选，默认使用配置的目录）
   * @param expires 签名过期时间（秒），默认 3600
   * @returns 包含 accessKeyId、policy、signature、dir、host 和 expire 的签名信息
   */
  async getUploadSignature(dir?: string, expires = 3600) {
    const ossConfig = getOssConfig();

    // 生成 policy
    const date = new Date();
    date.setSeconds(date.getSeconds() + expires);

    const policy = {
      expiration: date.toISOString(),
      conditions: [
        ['starts-with', '$key', dir || ossConfig.dir],
        ['content-length-range', 0, 10 * 1024 * 1024], // 最大 10MB
      ],
    };

    const policyBase64 = Buffer.from(JSON.stringify(policy)).toString('base64');

    // 计算签名
    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha1', ossConfig.accessKeySecret)
      .update(policyBase64)
      .digest('base64');

    return {
      accessKeyId: ossConfig.accessKeyId,
      policy: policyBase64,
      signature: signature,
      dir: dir || ossConfig.dir,
      host: `https://${ossConfig.bucket}.${ossConfig.region}.aliyuncs.com`,
      expire: Math.floor(date.getTime() / 1000),
    };
  }

  /**
   * 删除 OSS 文件
   * @param fileName 要删除的文件名
   */
  async deleteFile(fileName: string): Promise<void> {
    const client = this.getClient();
    await client.delete(fileName);
  }

  /**
   * 检查是否配置了 OSS
   * @returns 已配置返回 true，否则返回 false
   */
  isConfigured(): boolean {
    const ossConfig = getOssConfig();
    return !!(ossConfig.accessKeyId && ossConfig.accessKeySecret);
  }

  /**
   * 根据文件扩展名获取 MIME 类型
   * @param ext 文件扩展名（含点号，如 ".jpg"）
   * @returns MIME 类型字符串
   */
  private getMimeType(ext: string): string {
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
}
