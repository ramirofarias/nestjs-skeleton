import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UserTasks {
  @Cron(CronExpression.EVERY_DAY_AT_3PM, {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  public log() {
    console.log('Esto se loguea todos los días a las 3 hora Buenos Aires');
  }

  @Cron('0 33 15 * * *', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  public log2() {
    console.log('Esto se loguea a las 15 01 hora Buenos Aires');
  }
}
