import { ConfigModule } from '@nestjs/config';
import dbConfiguration from './src/db/database.provider';

ConfigModule.forRoot({
  isGlobal: true,
  load: [dbConfiguration],
});

export default dbConfiguration();
