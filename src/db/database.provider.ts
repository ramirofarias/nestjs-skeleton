import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('database', () => {
  return {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [join(__dirname, '/../**', '*.entity.{ts,js}')],
    migrations: ['dist/src/db/migrations/*.js'],
    cli: {
      migrationsDir: 'src/db/migrations',
    },
  };
});
