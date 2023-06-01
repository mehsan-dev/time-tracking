import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: String(process.env.DATABASE_PASSWORD),
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    synchronize: true,
    migrations: ['dist/**/migrations/*.{ts,js}'],
    migrationsTableName: 'migrations',
  }),
);
