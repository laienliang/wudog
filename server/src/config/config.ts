const dbConfig = {
  type: 'mysql' as const,
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '123456',
  database: process.env.DB_NAME || 'wudong_village',
  synchronize: false,
  logging: false,
  entities: ['src/entity/**/*.ts'],
  timezone: '+08:00',
};

export default {
  port: parseInt(process.env.PORT || '3000'),
  jwt: {
    secret: process.env.JWT_SECRET || 'wudong-village-jwt-secret-2026',
    expiresIn: '7d',
  },
  database: dbConfig,
  upload: {
    dir: 'uploads',
    maxSize: 10 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'],
  },
};
