import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from 'src/mail/mail.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserCreatedEvent {
  constructor(private readonly mailService: MailService) {}

  @OnEvent('user.created')
  private sendConfirmationEmail(user: User) {
    const token = 'token';
    this.mailService.sendUserConfirmationEmail(user, token);
  }

  @OnEvent('user.deleted')
  private logDeletedUser(user: User) {
    console.log(user);
  }
}
