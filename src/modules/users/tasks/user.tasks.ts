import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UserTasksService {
  @Cron(CronExpression.EVERY_10_SECONDS)
  public log() {
    console.log('Esto se loguea cada 10 segundos');
  }
}
