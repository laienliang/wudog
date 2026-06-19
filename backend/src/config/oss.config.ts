/**
 * 阿里云 OSS 配置
 * 请在 .env 文件或环境变量中配置以下信息
 */
export function getOssConfig() {
  return {
    // 阿里云 AccessKey ID
    accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
    // 阿里云 AccessKey Secret
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
    // OSS Bucket 名称
    bucket: process.env.OSS_BUCKET || 'wudong-travel',
    // OSS 区域
    region: process.env.OSS_REGION || 'oss-cn-guiyang',
    // 上传目录前缀
    dir: process.env.OSS_DIR || 'uploads/',
    // 自定义域名（可选）
    cname: process.env.OSS_CNAME || '',
    // 是否使用 HTTPS
    secure: process.env.OSS_SECURE === 'true',
    // Endpoint（可选，优先于 region）
    endpoint: process.env.OSS_ENDPOINT || '',
  };
}
