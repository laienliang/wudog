import Router from '@koa/router';
import { Repository } from 'typeorm';
import { Upload } from '../entity/upload.entity';
import { requireAuth, getUserId } from '../middleware/auth.middleware';
import config from '../config/config';
import path from 'path';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';

export function createUploadRouter(uploadRepo: Repository<Upload>): Router {
  const router = new Router();

  router.post('/public/upload', requireAuth(), async (ctx: any) => {
    try {
      const files = ctx.request.files;
      if (!files || !files.file) {
        ctx.status = 400;
        ctx.body = { code: 400, message: '请选择文件' };
        return;
      }

      const fileList = Array.isArray(files.file) ? files.file : [files.file];
      const uploadDir = path.resolve(config.upload.dir);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const results = [];
      for (const f of fileList) {
        const ext = path.extname(f.originalFilename || '');
        const filename = `${uuidv4()}${ext}`;
        const dest = path.join(uploadDir, filename);
        fs.copyFileSync(f.filepath, dest);

        const url = `/uploads/${filename}`;
        const record = uploadRepo.create({
          user_id: getUserId(ctx),
          filename,
          original_name: f.originalFilename || filename,
          url,
          size: f.size || 0,
          mime_type: f.mimetype || '',
        });
        await uploadRepo.save(record);

        results.push({ id: record.id, url, original_name: record.original_name });
      }

      ctx.body = { code: 200, message: '上传成功', data: { files: results } };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  router.post('/public/upload-url', requireAuth(), async (ctx: any) => {
    try {
      const { url } = ctx.request.body || {};
      if (!url || !/^https?:\/\/.+/.test(url)) {
        ctx.status = 400;
        ctx.body = { code: 400, message: '请提供有效的图片URL' };
        return;
      }

      const ext = path.extname(new URL(url).pathname).toLowerCase();
      const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
      const fileExt = allowedExts.includes(ext) ? ext : '.jpg';

      const uploadDir = path.resolve(config.upload.dir);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `${uuidv4()}${fileExt}`;
      const dest = path.join(uploadDir, filename);

      await new Promise<void>((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const options = {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WudongVillage/1.0)' },
        };
        client.get(url, options, (incoming) => {
          if (!incoming.statusCode || incoming.statusCode >= 400) {
            incoming.resume();
            reject(new Error(`下载失败，HTTP ${incoming.statusCode}`));
            return;
          }
          const fileStream = fs.createWriteStream(dest);
          incoming.pipe(fileStream);
          fileStream.on('finish', () => { fileStream.close(); resolve(); });
          fileStream.on('error', reject);
        }).on('error', reject);
      });

      const stat = fs.statSync(dest);
      const localUrl = `/uploads/${filename}`;
      const record = uploadRepo.create({
        user_id: getUserId(ctx),
        filename,
        original_name: path.basename(new URL(url).pathname) || filename,
        url: localUrl,
        size: stat.size,
        mime_type: `image/${fileExt.slice(1)}`,
      });
      await uploadRepo.save(record);

      ctx.body = { code: 200, message: '上传成功', data: { id: record.id, url: localUrl, original_name: record.original_name } };
    } catch (e: any) {
      ctx.status = 400;
      ctx.body = { code: 400, message: e.message };
    }
  });

  return router;
}
