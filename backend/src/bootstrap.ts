import { Bootstrap } from '@midwayjs/bootstrap';
import { join } from 'path';

// 入口：创建并运行 Midway 应用，监听 3000 端口
Bootstrap.configure({
  baseDir: join(__dirname),
}).run();
