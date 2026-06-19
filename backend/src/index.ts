import { Bootstrap } from '@midwayjs/bootstrap';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 加载 .env 文件
dotenv.config({ path: path.join(__dirname, '..', '.env') });

Bootstrap.run().then(() => {
  console.log('Wudong Admin Server started successfully');
});
