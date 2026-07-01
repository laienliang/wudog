import { Controller, Post } from '@midwayjs/core';
import * as multer from 'multer';
import * as path from 'path';

// multer export workaround for TypeScript
const multerFn = (multer as any).default || multer;

const storage = multerFn.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (_req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multerFn({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

@Controller('/api/upload')
export class UploadController {
  @Post('/image')
  async uploadImage(ctx: any) {
    return new Promise((resolve) => {
      upload.single('file')(ctx.req, ctx.res, (err: any) => {
        if (err) {
          resolve({ code: 400, message: err.message || '上传失败', data: null });
          return;
        }
        if (!ctx.req.file) {
          resolve({ code: 400, message: '请选择文件', data: null });
          return;
        }
        const url = `/uploads/${ctx.req.file.filename}`;
        resolve({ code: 200, message: '上传成功', data: { url } });
      });
    });
  }
}
