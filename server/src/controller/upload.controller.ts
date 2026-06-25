import Router from '@koa/router';
import { Repository } from 'typeorm';
import { Upload } from '../entity/upload.entity';
import { requireAuth, getUserId } from '../middleware/auth.middleware';
import config from '../config/config';
import path from 'path';
import fs from 'fs';
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

  return router;
}
